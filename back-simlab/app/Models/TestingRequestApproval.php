<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestingRequestApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'testing_request_id',
        'action',
        'approver_id',
        'is_approved',
        'information'
    ];

    public function testRequest()
    {
        return $this->belongsTo(TestingRequest::class, 'testing_request_id');
    }

    static function approvalFlows()
    {
        return [
            'request_booking',
            'verified_by_head',
            'verified_by_laboran',
        ];
    }

    static function roleApprovalFlows()
    {
        return [
            'kepala_lab_terpadu' => 'verified_by_head',
            'laboran'            => 'verified_by_laboran',
        ];
    }
}
