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

    public function setTestingTimeAttribute($value)
    {
        $this->attributes['testing_time'] = Carbon::parse($value)->setTimezone(config('app.timezone'))->format('Y-m-d H:i:s');
    }

    public function canVerif(User $user)
    {
        $flows = TestingRequestApproval::approvalFlows();
        $roleStep = TestingRequestApproval::roleApprovalFlows();

        $action = $roleStep[$user->role] ?? null;

        // Step index of this role
        $targetIndex = array_search($action, $flows);

        // Steps that have been completed
        $doneCount = $this->testRequestApprovals->count();

        // Check whether it has been approved/rejected
        $existing = $this->testRequestApprovals()->where('action', $action)->first();
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

        $approvalFlows = TestingRequestApproval::getFlow();
        foreach ($approvalFlows as $flow) {
            $approval = $this->testRequestApprovals
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
