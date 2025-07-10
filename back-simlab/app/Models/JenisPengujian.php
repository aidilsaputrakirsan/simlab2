<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisPengujian extends Model
{
    use HasFactory;
    protected $fillable = ['testing_type'];
}
