<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class LaboratoryMaterial extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'code',
        'material_name',
        'brand',
        'stock',
        'unit',
        'purchase_date',
        'expiry_date',
        'description',
        'refill_date',
        'student_price',
        'lecturer_price',
        'external_price'
    ];
}
