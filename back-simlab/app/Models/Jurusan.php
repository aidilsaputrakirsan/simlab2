<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jurusan extends Model
{
    use HasFactory;

    protected $fillable = ['major_code', 'name'];

    public function studyProgram()
    {
        return $this->hasMany(Prodi::class, 'jurusan_id');
    }
}
