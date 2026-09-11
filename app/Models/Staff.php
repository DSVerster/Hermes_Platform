<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Staff extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $primaryKey = 'staff_id';

    protected $fillable = [
        'name',
        'surname',
        'role',
        'email_account',
        'password_hash',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password_hash' => 'hashed',
    ];

    /**
     * Laravel's auth system looks for a "password" attribute by default —
     * this points it at our actual column name instead.
     */
    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    /**
     * Laravel's auth system looks for an "email" attribute by default —
     * override so Auth::attempt/validate work against email_account.
     */
    public function username(): string
    {
        return 'email_account';
    }

    public function parcels(): HasMany
    {
        return $this->hasMany(Parcel::class, 'staff_id', 'staff_id');
    }
}