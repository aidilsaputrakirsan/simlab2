<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaboratoryRoom extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'name',
        'floor',
        'user_id',
        'student_price',
        'lecturer_price',
        'external_price'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function laboratoryEquipments()
    {
        return $this->hasMany(LaboratoryEquipment::class, 'laboratory_room_id');
    }
}
