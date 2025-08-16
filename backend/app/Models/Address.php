<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'street',
        'city',
        'province',
        'postal_code',
        'country',
        'phone',
        'is_default',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the user for this address.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full address as a string.
     */
    public function getFullAddressAttribute()
    {
        return "{$this->street}, {$this->city}, {$this->province} {$this->postal_code}, {$this->country}";
    }
}
