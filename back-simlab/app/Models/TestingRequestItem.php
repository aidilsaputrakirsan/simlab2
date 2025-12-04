<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestingRequestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'testing_type_id',
        'test_request_id',
        'quantity'
    ];

    public function testRequest()
    {
        return $this->belongsTo(TestingRequest::class, 'testing_request_id');
    }

    public function testingType()
    {
        return $this->belongsTo(TestingType::class, 'testing_type_id');
    }
}
