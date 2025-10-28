<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Format meta data as key-value object
        $metaData = [];
        if ($this->relationLoaded('meta')) {
            foreach ($this->meta as $meta) {
                $metaData[$meta->meta_key] = $meta->meta_value;
            }
        }

        return [
            'id' => $this->id,
            'condominium_id' => $this->condominium_id,
            'internal_code' => $this->internal_code,
            'name' => $this->name,
            'property_type' => $this->property_type,
            'address' => $this->address,
            'portal_address' => $this->portal_address,
            'city' => $this->city,
            'province' => $this->province,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'zone' => $this->zone,
            'intended_use' => $this->intended_use,
            'layout' => $this->layout,
            'surface_area' => $this->surface_area,
            'property_status' => $this->property_status,
            'floor_number' => $this->floor_number,
            'total_floors' => $this->total_floors,
            'construction_year' => $this->construction_year,
            'condition' => $this->condition,
            'bathrooms_with_tub' => $this->bathrooms_with_tub,
            'bathrooms' => $this->bathrooms,
            'balconies' => $this->balconies,
            'has_concierge' => $this->has_concierge,
            'is_published_web' => $this->is_published_web,
            'web_address' => $this->web_address,
            'description' => $this->description,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Formatted meta data as object
            'meta_data' => $metaData,

            // Relationships
            'condominium' => CondominiumResource::make($this->whenLoaded('condominium')),
            'rooms' => RoomResource::collection($this->whenLoaded('rooms')),
            'owners' => OwnerResource::collection($this->whenLoaded('owners')),
        ];
    }
}
