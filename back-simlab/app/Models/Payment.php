<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payable_id',
        'payable_type',
        'user_id',
        'payment_number',
        'amount',
        'invoice_file',
        'payment_proof',
        'va_number',
        'status',
    ];

    public function payable()
    {
        return $this->morphTo();
    }

    public function paymentItems()
    {
        return $this->hasMany(PaymentItem::class, 'payment_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getIsInvoiceHasUploadedAttribute() {
        return $this->invoice_file ? true : false;
    }

    public function getIsPaymentProofHasUploadedAttribute() {
        return $this->payment_proof ? true : false;
    }
}
