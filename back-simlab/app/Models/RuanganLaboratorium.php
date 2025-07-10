<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RuanganLaboratorium extends Model
{
    use HasFactory;

    // user_id = laboran
    protected $fillable = ['name', 'floor', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function alatLaboratorium()
    {
        return $this->hasMany(AlatLaboratorium::class, 'ruangan_laboratorium_id');
    }

    public function bahanLaboratorium()
    {
        return $this->hasMany(BahanLaboratorium::class, 'ruangan_laboratorium_id');
    }
}
