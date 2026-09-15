<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Parcel extends Model
{
    use HasFactory;

    // 1. Tell Laravel the true name of your primary key column
    protected $primaryKey = 'parcel_id';

    // 2. Allow all the database columns to accept data entries
    protected $fillable = [
        'courier_id',
        'staff_id',
        'recipient_name',
        'recipient_phone',
        'tracking_number',
        'parcel_type',
        'courier_service',
        'date_received',
        'date_collected',
        'storage_location',
        'status',
        'collection_fee',
    ];

    /**
     * Get the courier that handles this specific parcel.
     */
    public function courier(): BelongsTo
    {
        // Points to Courier model using your custom courier_id column
        return $this->belongsTo(Courier::class, 'courier_id', 'courier_id');
    }

    /**
     * Get the staff member who processed this specific parcel.
     */
    public function staff(): BelongsTo
    {
        // Points to Staff model using your custom staff_id column
        return $this->belongsTo(Staff::class, 'staff_id', 'staff_id');
    }

    /**
     * Get the notifications sent for this parcel.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'parcel_id', 'parcel_id');
    }
}