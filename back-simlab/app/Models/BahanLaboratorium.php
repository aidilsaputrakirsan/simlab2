<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BahanLaboratorium extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'ruangan_laboratorium_id', 'material_name', 'brand', 'stock', 'unit', 'purchase_date', 'expiry_date', 'description', 'refill_date'];

    public function ruanganLaboratorium()
    {
        return $this->belongsTo(RuanganLaboratorium::class, 'ruangan_laboratorium_id');
    }
}
