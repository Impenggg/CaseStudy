<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'campaign_id',
        'donor_id',
        'amount',
        'message',
        'anonymous',
        'payment_method',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'anonymous' => 'boolean',
    ];

    /**
     * Get the campaign for this donation.
     */
    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    /**
     * Get the donor for this donation.
     */
    public function donor()
    {
        return $this->belongsTo(User::class, 'donor_id');
    }
}
