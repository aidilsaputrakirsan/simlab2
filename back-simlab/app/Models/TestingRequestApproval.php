<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestingRequestApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_request_id',
        'action',
        'approver_id',
        'is_approved',
        'information'
    ];

    public function testRequest()
    {
        return $this->belongsTo(TestingRequest::class, 'testing_request_id');
    }
}
