<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Parcel extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     */
    protected $primaryKey = 'parcel_id';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'courier_id',
        'recipient_name',
        'recipient_phone',
        'tracking_number',
        'parcel_type',
        'courier_service',
        'storage_location',
        'collection_fee',
        'staff_id',
        'status',
        'date_received',
        'date_collected'
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'date_received' => 'datetime',  // Changed to datetime to capture exact drop-off time
        'date_collected' => 'datetime', // Changed to datetime to capture exact pick-up time
        'collection_fee' => 'decimal:2',
    ];

    /**
     * Get the courier associated with the parcel.
     */
    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class, 'courier_id', 'courier_id');
    }

    /**
     * Get the staff member who processed the parcel.
     */
    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'staff_id', 'staff_id');
    }

    /**
     * Get the notifications sent out for this parcel.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'parcel_id', 'parcel_id');
    }
}
