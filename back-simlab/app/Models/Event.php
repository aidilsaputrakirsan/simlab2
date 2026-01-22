<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends BaseModel
{
    use HasFactory;
    protected $fillable = [
        'eventable_id',
        'eventable_type',
        'title',
        'start_date',
        'end_date'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime'
    ];

    public function eventable()
    {
        return $this->morphTo();
    }
}
