<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentApproval extends Model
{
    use HasFactory;
    protected $fillable = [
        'payment_id',
        'action',
        'approver_id',
        'is_approved',
        'information'
    ];
}
