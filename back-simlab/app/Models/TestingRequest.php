<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TestingRequest extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id',
        'requestor_id',
        'laboran_id',
        'phone_number',
        'activity_name',
        'supervisor_name',
        'supervisor_email',
        'testing_time',
        'status',
        'information',
        'result_file'
    ];

    protected $casts = [
        'testing_time' => 'datetime'
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function requestor()
    {
        return $this->belongsTo(User::class, 'requestor_id');
    }

    public function laboran()
    {
        return $this->belongsTo(User::class, 'laboran_id');
    }

    public function testRequestItems()
    {
        return $this->hasMany(TestingRequestItem::class, 'testing_request_id');
    }

    public function testRequestApprovals()
    {
        return $this->hasMany(TestingRequestApproval::class, 'testing_request_id');
    }

    public function payment()
    {
        return $this->morphOne(Payment::class, 'payable');
    }

    public function event()
    {
        return $this->morphOne(Event::class, 'eventable');
    }

    public function setTestingTimeAttribute($value)
    {
        $this->attributes['testing_time'] = Carbon::parse($value)->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');
    }

    public function getHasPaidItemsAttribute()
    {
        return collect($this->testRequestItems)
            ->contains(fn($item) => $item['price'] > 0);
    }


    public function canVerif(User $user)
    {
        $hasPaidItems = $this->hasPaidItems;
        $flows = $this->getApprovalFlowsForRequest();
        $roleStep = TestingRequestApproval::roleApprovalFlows();

        $action = $roleStep[$user->role] ?? null;

        // For admin_pengujian, only allow verification if request has paid items
        if ($user->role === 'admin_pengujian' && !$hasPaidItems) {
            return 2; // Cannot verify non-paid requests
        }

        // For kepala_lab_terpadu, only allow verification if request has no paid items
        if ($user->role === 'kepala_lab_terpadu' && $hasPaidItems) {
            return 2; // Cannot verify paid requests (admin_pengujian handles this)
        }

        // Step index of this role
        $targetIndex = array_search($action, $flows);

        // Steps that have been completed
        $doneCount = $this->testRequestApprovals->count();

        // Check whether it has been approved/rejected
        $existing = $this->testRequestApprovals()->where('action', $action)->first();
        if ($existing) {
            // If it has been verified
            if ($existing->is_approved)
                return 0; // sudah diverif
            if (!$existing->is_approved)
                return 3; // ditolak
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

    /**
     * Get the approval flows based on whether request has paid items
     * Both paid and non-paid items use the same flow: request_testing -> verified_by_head -> verified_by_laboran
     * The difference is WHO can do verified_by_head (admin_pengujian for paid, kepala_lab_terpadu for non-paid)
     */
    public function getApprovalFlowsForRequest()
    {
        return [
            'request_testing',
            'verified_by_head',
            'verified_by_laboran',
        ];
    }

    public function getApprovalStepsAttribute()
    {
        $approvals = [];
        $allApproved = true;
        $hasBeenRejected = false;

        $approvalFlows = $this->getApprovalFlowDefinitions();
        foreach ($approvalFlows as $flow) {
            $action = $flow['action'];

            // Check if this is a payment/report action
            $isPaymentAction = in_array($action, ['payment_created', 'payment_uploaded', 'payment_verified', 'report_uploaded']);

            if ($isPaymentAction) {
                // Get status from Payment model or TestingRequest model
                $status = $this->getPaymentStepStatus($action);
                $approval = null; // Payment/report steps don't have approval records
            } else {
                // Get status from TestingRequestApproval
                $approval = $this->testRequestApprovals
                    ->where('action', $action)
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

    /**
     * Get the approval flow definitions based on whether request has paid items
     */
    public function getApprovalFlowDefinitions(): array
    {
        $definition = TestingRequestApproval::actionDefinition();
        $flows = $this->getApprovalFlowsForRequest();
        $hasPaidItems = $this->hasPaidItems;

        $result = collect($flows)->map(function ($action) use ($definition, $hasPaidItems) {
            $role = $definition[$action]['role'];
            $description = $definition[$action]['description'];

            // For verified_by_head action, use admin_pengujian for paid items, kepala_lab_terpadu for free items
            if ($action === 'verified_by_head') {
                $role = $hasPaidItems ? 'admin_pengujian' : 'kepala_lab_terpadu';
                $description = $hasPaidItems
                    ? 'Admin Pengujian memverifikasi pengajuan pengujian berbayar'
                    : 'Kepala Lab Terpadu memverifikasi pengajuan pengujian gratis';
            }

            return [
                'action' => $action,
                'role' => $role,
                'description' => $description
            ];
        })->toArray();

        // Add payment steps ONLY if has paid items
        if ($hasPaidItems) {
            $result[] = [
                'action' => 'payment_created',
                'role' => 'admin_pengujian',
                'description' => $definition['payment_created']['description']
            ];
            $result[] = [
                'action' => 'payment_uploaded',
                'role' => 'pemohon',
                'description' => $definition['payment_uploaded']['description']
            ];
            $result[] = [
                'action' => 'payment_verified',
                'role' => 'admin_pengujian',
                'description' => $definition['payment_verified']['description']
            ];
        }

        // Add report upload step (for BOTH paid and free items)
        $result[] = [
            'action' => 'report_uploaded',
            'role' => 'laboran',
            'description' => $definition['report_uploaded']['description']
        ];

        return $result;
    }

    /**
     * Get payment/report step status based on Payment model and TestingRequest
     */
    private function getPaymentStepStatus(string $action): string
    {
        switch ($action) {
            case 'payment_created':
                if (!$this->payment)
                    return 'pending';
                // Payment created if payment exists and has invoice_file or va_number
                return ($this->payment->invoice_file || $this->payment->va_number) ? 'approved' : 'pending';

            case 'payment_uploaded':
                if (!$this->payment)
                    return 'pending';
                // Payment uploaded if user has uploaded payment_proof
                return $this->payment->payment_proof ? 'approved' : 'pending';

            case 'payment_verified':
                if (!$this->payment)
                    return 'pending';
                // Payment verified if admin has verified (status = 'paid' or 'verified')
                return in_array($this->payment->status, ['paid', 'verified', 'approved']) ? 'approved' : 'pending';

            case 'report_uploaded':
                // Report uploaded if laboran has uploaded result_file (PDF)
                return $this->result_file ? 'approved' : 'pending';

            default:
                return 'pending';
        }
    }
}
