<?php

namespace App\Models;

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
}
