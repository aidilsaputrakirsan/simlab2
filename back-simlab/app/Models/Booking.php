<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends BaseModel
{
    use HasFactory;
    protected $fillable = ['academic_year_id', 'user_id', 'phone_number', 'purpose', 'supporting_file', 'activity_name', 'supervisor', 'supervisor_email', 'start_time', 'end_time', 'status', 'booking_type', 'total_participant', 'participant_list', 'laboratory_room_id', 'laboran_id', 'is_allowed_offsite'];
    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
    ];

    public function setStartTimeAttribute($value)
    {
        $this->attributes['start_time'] = Carbon::parse($value)->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');
    }

    public function setEndTimeAttribute($value)
    {
        $this->attributes['end_time'] = Carbon::parse($value)->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');
    }

    public function getCreatedAtApiAttribute()
    {
        return $this->created_at ? $this->created_at->setTimezone(config('app.timezone'))->toIso8601String() : null;
    }

    public function getUpdatedAtApiAttribute()
    {
        return $this->updated_at ? $this->updated_at->setTimezone(config('app.timezone'))->toIso8601String() : null;
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function laboran()
    {
        return $this->belongsTo(User::class, 'laboran_id');
    }

    public function laboratoryRoom()
    {
        return $this->belongsTo(LaboratoryRoom::class, 'laboratory_room_id');
    }

    public function equipments()
    {
        return $this->hasMany(BookingEquipment::class, 'booking_id');
    }

    public function materials()
    {
        return $this->hasMany(BookingMaterial::class, 'booking_id');
    }

    public function approvals()
    {
        return $this->hasMany(BookingApproval::class, 'booking_id');
    }

    public function payment()
    {
        return $this->morphOne(Payment::class, 'payable');
    }

    public function event()
    {
        return $this->morphOne(Event::class, 'eventable');
    }

    /**
     * Get the total price for room booking based on user type
     */
    public function getRoomPriceAttribute()
    {
        if (!$this->laboratoryRoom || !$this->user) {
            return 0;
        }

        $userType = $this->getUserPriceType();
        $room = $this->laboratoryRoom;

        return match ($userType) {
            'student' => $room->student_price ?? 0,
            'lecturer' => $room->lecturer_price ?? 0,
            'external' => $room->external_price ?? 0,
            default => 0
        };
    }

    /**
     * Get the total price for equipment booking
     */
    public function getEquipmentTotalPriceAttribute()
    {
        return $this->equipments->sum(function ($equipment) {
            return $equipment->price * $equipment->quantity;
        });
    }

    /**
     * Get the total price for material booking
     */
    public function getMaterialTotalPriceAttribute()
    {
        return $this->materials->sum(function ($material) {
            return $material->price * $material->quantity;
        });
    }

    /**
     * Get the grand total price for the booking
     */
    public function getTotalPriceAttribute()
    {
        return $this->room_price + $this->equipment_total_price + $this->material_total_price;
    }

    /**
     * Check if this booking has any paid items (price > 0)
     */
    public function getHasPaidItemsAttribute()
    {
        if ($this->room_price > 0) {
            return true;
        }

        $hasEquipmentWithPrice = $this->equipments->contains(fn($e) => $e->price > 0);
        $hasMaterialWithPrice = $this->materials->contains(fn($m) => $m->price > 0);

        return $hasEquipmentWithPrice || $hasMaterialWithPrice;
    }

    /**
     * Determine user type for pricing (student, lecturer, external)
     */
    private function getUserPriceType(): string
    {
        $user = $this->user;

        // If user has study_program_id, they're internal (student or lecturer)
        if ($user->study_program_id) {
            return $user->role === 'dosen' ? 'lecturer' : 'student';
        }

        // External user
        return 'external';
    }

    public function getKepalaLabApprovalAttribute()
    {
        $approval = $this->approvals()
            ->where('action', 'verified_by_head')
            ->first();
        return $approval ?: null;
    }

    public function getLaboranApprovalAttribute()
    {
        $approval = $this->approvals()
            ->where('action', 'verified_by_laboran')
            ->first();
        return $approval ?: null;
    }

    /**
     * Determine if a user can verify this booking
     * Returns:
     * - 0: Already approved by this role
     * - 1: Can verify now
     * - 2: Waiting for previous step / cannot verify
     * - 3: Rejected
     */
    public function canVerif(User $user)
    {
        $hasPaidItems = $this->hasPaidItems;
        $flows = $this->getApprovalFlowsForBooking();
        $roleStep = $this->getRoleApprovalFlows();

        $action = $roleStep[$user->role] ?? null;

        // For admin_pengujian, only allow verification if booking has paid items
        if ($user->role === 'admin_pengujian' && !$hasPaidItems) {
            return 2; // Cannot verify non-paid bookings
        }

        // For kepala_lab_terpadu, only allow verification if booking has no paid items
        if ($user->role === 'kepala_lab_terpadu' && $hasPaidItems) {
            return 2; // Cannot verify paid bookings (admin_pengujian handles this)
        }

        // Step index of this role
        $targetIndex = array_search($action, $flows);

        if ($targetIndex === false) {
            return 2; // Role not in flow
        }

        // Steps that have been completed
        $doneCount = $this->approvals->count();

        // Check whether it has been approved/rejected
        $existing = $this->approvals()->where('action', $action)->first();
        if ($existing) {
            // If it has been verified
            if ($existing->is_approved) return 0; // already verified
            if (!$existing->is_approved) return 3; // rejected
        }

        // If it can't be verified yet because it hasn't reached the sequence yet
        if ($doneCount < $targetIndex) {
            return 2; // waiting for the previous stage
        }

        // If you have reached the step → you can verify
        if ($doneCount == $targetIndex) {
            return 1; // can verify now
        }

        // Default fallback
        return 2;
    }

    /**
     * Get the approval flows for booking
     * Both paid and non-paid items use the same flow: request_booking -> verified_by_head -> verified_by_laboran
     * The difference is WHO can do verified_by_head (admin_pengujian for paid, kepala_lab_terpadu for non-paid)
     */
    private function getApprovalFlowsForBooking()
    {
        return [
            'request_booking',
            'verified_by_head',
            'verified_by_laboran',
        ];
    }

    /**
     * Get role to approval action mapping
     */
    private function getRoleApprovalFlows()
    {
        return [
            'kepala_lab_terpadu' => 'verified_by_head',
            'admin_pengujian' => 'verified_by_head',
            'laboran' => 'verified_by_laboran',
        ];
    }

    public function getIsRequestorCanReturnAttribute(): bool
    {
        if ($this->status !== 'approved') {
            return false;
        }

        // Return true only if there is NO approved 'return_by_requestor' record
        $hasApprovedReturn = $this->approvals()
            ->where('action', 'returned_by_requestor')
            ->where('is_approved', true)
            ->exists();

        return !$hasApprovedReturn;
    }

    public function getLaboranOffsiteApprovedAttribute()
    {
        return $this->approvals()
            ->where('role', 'laboran')
            ->where('approved', 1)
            ->where('is_allowed_offsite', 1)
            ->exists();
    }

    public function getBookingTypeFormattedAttribute()
    {
        switch ($this->booking_type) {
            case 'room_n_equipment':
                return 'Ruangan & Alat';
            case 'room':
                return 'Ruangan';
            case 'equipment':
                return 'Alat';
        }
    }

    public function getApprovalStepsAttribute()
    {
        $approvals = [];
        $allApproved = true;
        $hasBeenRejected = false;

        // Pastikan booking_type tersedia
        if (!$this->booking_type) {
            return [];
        }

        $approvalFlows = BookingApproval::getFlow($this->booking_type);

        foreach ($approvalFlows as $flow) {
            $approval = $this->approvals
                ->where('action', $flow['action'])
                ->sortByDesc('created_at')
                ->first();

            if ($approval) {
                if (!$approval->is_approved) {
                    $hasBeenRejected = true;
                }
                $status = $approval->approval_status_label;
            } else {
                $status = $hasBeenRejected ? 'rejected' : 'pending';
            }

            $approvals[] = [
                'action' => $flow['action'],
                'description' => $flow['description'],
                'role' => $flow['role'],
                'status' => $status,
                'information' => $approval?->information,
                'approved_at' => $approval?->created_at_api,
                'approver' => $approval?->approver?->name,
            ];

            if ($status !== 'approved') {
                $allApproved = false;
            }
        }

        // Add finish step
        $approvals[] = [
            'action' => 'finish',
            'description' => '',
            'role' => 'selesai',
            'status' => $allApproved ? 'approved' : ($hasBeenRejected ? 'rejected' : 'pending'),
            'information' => null,
            'approved_at' => null,
            'approver' => null,
        ];

        return $approvals;
    }
}
