<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Parcel extends Model
{
    use HasFactory;

    protected $primaryKey = 'parcel_id';

    protected $fillable = [
        'courier_id', 'staff_id', 'recipient_name', 'recipient_phone',
        'tracking_label', 'parcel_type', 'courier_service',
        'date_received', 'date_collected', 'storage_location',
        'status', 'collection_fee',
    ];

    protected $casts = [
        'date_received' => 'date',
        'date_collected' => 'date',
        'collection_fee' => 'decimal:2',
    ];

    public function courier(): BelongsTo
    {
        return $this->belongsTo(Courier::class, 'courier_id', 'courier_id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(Staff::class, 'staff_id', 'staff_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'parcel_id', 'parcel_id');
    }
}