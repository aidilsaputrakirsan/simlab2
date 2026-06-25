<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticumSchedulingProposedMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'practicum_scheduling_id',
        'name',
        'quantity',
    ];

    public function practicumScheduling()
    {
        return $this->belongsTo(PracticumScheduling::class, 'practicum_scheduling_id');
    }
}
