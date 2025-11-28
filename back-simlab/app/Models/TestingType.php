<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestingType extends BaseModel
{
    use HasFactory;
    protected $fillable = ['name', 'unit', 'student_price', 'lecturer_price', 'external_price', 'testing_category_id'];

    public function testingCategory()
    {
        return $this->belongsTo(TestingCategory::class, 'testing_category_id');
    }
}
