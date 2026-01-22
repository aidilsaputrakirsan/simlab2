<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Faculty extends BaseModel
{
    use HasFactory;
    protected $fillable = ['code', 'name'];

    public function majors()
    {
        return $this->hasMany(Major::class, 'faculty_id');
    }
}
