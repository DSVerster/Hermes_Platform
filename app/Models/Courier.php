<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Courier extends Model
{
    use HasFactory;

    protected $primaryKey = 'courier_id';

    protected $fillable = [
        'name',
        'description',
        'contact_person',
        'contact_number',
        'email',
        'website',
    ];

    public function parcels(): HasMany
    {
        return $this->hasMany(Parcel::class, 'courier_id', 'courier_id');
    }
} //They asked me how well I understood theoretical physics. I said I had a theoretical degree in physics. They said welcome aboard.