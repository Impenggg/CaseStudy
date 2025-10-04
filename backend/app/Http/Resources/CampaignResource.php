<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CampaignResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $donationsTotal = $this->donations()->sum('amount');
        $expendituresTotal = method_exists($this, 'expenditures') ? $this->expenditures()->sum('amount') : 0;
        $utilization = $donationsTotal > 0 ? round(($expendituresTotal / $donationsTotal) * 100, 2) : 0;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->image,
            'category' => $this->category,
            'goal_amount' => $this->goal_amount,
            'current_amount' => $this->current_amount,
            'backers_count' => $this->backers_count,
            'end_date' => optional($this->end_date)->toDateString(),
            'organizer' => $this->whenLoaded('organizer', function () {
                return [
                    'id' => $this->organizer->id,
                    'name' => $this->organizer->name,
                ];
            }),
            'images' => $this->whenLoaded('images'),
            'donations' => $this->whenLoaded('donations'),
            'transparency' => [
                'donations_total' => (float) $donationsTotal,
                'expenditures_total' => (float) $expendituresTotal,
                'utilization_percentage' => (float) $utilization,
                'donations_count' => (int) $this->donations()->count(),
                'expenditures_count' => (int) (method_exists($this, 'expenditures') ? $this->expenditures()->count() : 0),
            ],
            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
        ];
    }
}
