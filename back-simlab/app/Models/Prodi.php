<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    use HasFactory;

    protected $fillable = ['jurusan_id', 'name'];

    public function major()
    {
        return $this->belongsTo(Jurusan::class, 'jurusan_id');
    }

    public function practicalWork()
    {
        return $this->hasMany(Praktikum::class, 'prodi_id');
    }

    public function user()
    {
        return $this->hasMany(User::class, 'prodi_id');
    }
}
