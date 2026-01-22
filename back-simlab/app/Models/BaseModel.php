<?php

namespace App\Models;

use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    protected function serializeDate(DateTimeInterface $date)
    {
        return Carbon::instance($date)
            ->setTimezone(config('app.timezone'))
            ->toIso8601String();
    }

    public function convertToISO($column)
    {
        return $this->getAttribute($column) ? $this->getAttribute($column)->setTimezone(config('app.timezone'))->toIso8601String() : null;
    }
}
