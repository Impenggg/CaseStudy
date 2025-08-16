<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'buyer_id',
        'quantity',
        'total_amount',
        'status',
        'shipping_address',
        'payment_method',
        'tracking_number',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'shipping_address' => 'array',
        'total_amount' => 'decimal:2',
    ];

    /**
     * Get the product for this order.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the buyer for this order.
     */
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
