<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'property_id' => $this->property_id,
            'internal_code' => $this->internal_code,
            'room_type' => $this->room_type,
            'surface_area' => $this->surface_area,
            'monthly_price' => $this->monthly_price,
            'weekly_price' => $this->weekly_price,
            'daily_price' => $this->daily_price,
            'minimum_stay_type' => $this->minimum_stay_type,
            'minimum_stay_number' => $this->minimum_stay_number,
            'deposit_amount' => $this->deposit_amount,
            'entry_fee' => $this->entry_fee,
            'min_age' => $this->min_age,
            'max_age' => $this->max_age,
            'smoking_allowed' => $this->smoking_allowed,
            'pets_allowed' => $this->pets_allowed,
            'musical_instruments_allowed' => $this->musical_instruments_allowed,
            'gender_preference' => $this->gender_preference,
            'occupant_type' => $this->occupant_type,
            'has_double_bed' => $this->has_double_bed,
            'cancellation_notice_months' => $this->cancellation_notice_months,
            'fiscal_regime' => $this->fiscal_regime,
            'fiscal_rate' => $this->fiscal_rate,
            'is_published_web' => $this->is_published_web,
            'availability_type' => $this->availability_type,
            'available_from' => $this->available_from?->format('Y-m-d'),
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relationships
            'property' => PropertyResource::make($this->whenLoaded('property')),
        ];
    }
}
