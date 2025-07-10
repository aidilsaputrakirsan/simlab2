<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlatLaboratorium extends Model
{
    use HasFactory;

    protected $fillable = ['ruangan_laboratorium_id', 'equipment_name', 'quantity', 'unit', 'function', 'photo', 'brand', 'equipment_type', 'origin', 'condition', 'condition_description', 'asset_code'];

    public function ruanganLaboratorium()
    {
        return $this->belongsTo(RuanganLaboratorium::class, 'ruangan_laboratorium_id');
    }
}
