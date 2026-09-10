<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
<<<<<<< HEAD
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'tracking_label',
        'parcel_type',
        'date_received',
        'date_collected',
        'storage_location',
        'status'
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
}
=======

class Parcel extends Model
{
    protected $fillable = [
        'tracking_number',
        'status',
        'received_at',
    ];
}
>>>>>>> c4faf9af31407980159f0789ffe960231b04ea6f
