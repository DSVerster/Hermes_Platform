<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Staff extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'staff';
    protected $primaryKey = 'staff_id';

    protected $fillable = [
        'name', 'surname', 'role', 'email_account', 'password_hash',
    ];

    protected $hidden = ['password_hash', 'remember_token'];

    protected $casts = [
        'password_hash' => 'hashed',
    ];

    public function parcels(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Parcel::class, 'staff_id', 'staff_id');
    }
}