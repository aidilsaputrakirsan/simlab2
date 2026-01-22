<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestingCategory extends BaseModel
{
    use HasFactory;

    protected $fillable = ['name'];

    public function testingTypes()
    {
        return $this->hasMany(TestingType::class, 'testing_category_id');
    }
}
