<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Praktikum extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'prodi_id', 'sks'];

    public function studyProgram()
    {
        return $this->belongsTo(Prodi::class, 'prodi_id');
    }
}
