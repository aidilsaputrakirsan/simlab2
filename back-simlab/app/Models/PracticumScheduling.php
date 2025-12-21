<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class PracticumScheduling extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'user_id',
        'laboran_id',
        'practicum_id',
        'phone_number',
        'status'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function practicum() {
        return $this->belongsTo(Practicum::class, 'practicum_id');
    }

    public function academicYear() {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function laboran() {
        return $this->belongsTo(User::class, 'laboran_id');
    }

    public function practicumClasses() {
        return $this->hasMany(PracticumClass::class, 'practicum_scheduling_id');
    }

    public function practicumSchedulingEquipments() {
        return $this->hasMany(PracticumSchedulingEquipment::class, 'practicum_scheduling_id');
    }

    public function practicumSchedulingMaterials() {
        return $this->hasMany(PracticumSchedulingMaterial::class, 'practicum_scheduling_id');
    }

    public function practicumApprovals() {
        return $this->hasMany(PracticumApproval::class, 'practicum_scheduling_id');
    }

    public function getTotalGroupsAttribute()
    {
        // If the relationship is already loaded, sum in-memory to avoid an extra query
        if ($this->relationLoaded('practicumClasses')) {
            return (int) $this->practicumClasses->sum('total_group');
        }

        // Otherwise perform a SQL SUM which is efficient for large datasets
        return (int) $this->practicumClasses()->sum('total_group');
    }

    public function getKepalaLabApprovalAttribute() {
        $approval = $this->practicumApprovals()
            ->where('role', 'kepala_lab_terpadu')
            ->first();

        return $approval;
    }

    public function getLaboranApprovalAttribute() {
        $approval = $this->practicumApprovals()
            ->where('role', 'laboran')
            ->first();
        return $approval ?: null;
    }

    public function canVerif(User $user)
    {
        $flows = PracticumApproval::approvalFlows();
        $roleStep = PracticumApproval::roleApprovalFlows();

        $action = $roleStep[$user->role] ?? null;

        // Step index of this role
        $targetIndex = array_search($action, $flows);

        // Steps that have been completed
        $doneCount = $this->practicumApprovals->count();

        // Check whether it has been approved/rejected
        $existing = $this->practicumApprovals()->where('action', $action)->first();
        if ($existing) {
            // If it has been verified
            if ($existing->is_approved) return 0; // sudah div erif
            if (!$existing->is_approved) return 3; // ditolak
        }

        // If it can't be verified yet because it hasn't reached the sequence yet
        if ($doneCount < $targetIndex) {
            return 2; // waiting for the previous stage
        }

        // If you have reached the step → you can verify
        if ($doneCount == $targetIndex) {
            return 1; //can verify now
        }

        // Default fallback
        return 2;
    }

    public function getApprovalStepsAttribute()
    {
        $approvals = [];
        $allApproved = true;
        $hasBeenRejected = false;

        $approvalFlows = PracticumApproval::getFlow();
        foreach ($approvalFlows as $flow) {
            $approval = $this->practicumApprovals
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
                'approved_at' => $approval?->convertToISO('created_at'),
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
