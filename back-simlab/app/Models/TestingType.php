<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class TestingType extends BaseModel
{
    use HasFactory;
    protected $fillable = ['name', 'unit', 'student_price', 'lecturer_price', 'external_price', 'testing_category_id'];

    public function testingCategory()
    {
        return $this->belongsTo(TestingCategory::class, 'testing_category_id');
    }

    public function priceForRole(string $role)
    {
        return match ($role) {
            'mahasiswa'               => $this->student_price,
            'dosen',
            'kepala_lab_jurusan',
            'kepala_lab_terpadu'    => $this->lecturer_price,
            default                 => $this->external_price,
        };
    }
}
