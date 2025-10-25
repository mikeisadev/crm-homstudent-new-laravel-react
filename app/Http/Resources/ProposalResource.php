<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProposalResource extends JsonResource
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
            'proposal_number' => $this->proposal_number,
            'client_id' => $this->client_id,
            'property_type' => $this->property_type,
            'property_id' => $this->property_id,
            'room_id' => $this->room_id,
            'proposal_type' => $this->proposal_type,
            'status' => $this->status,
            'proposed_start_date' => $this->proposed_start_date?->format('Y-m-d'),
            'proposed_end_date' => $this->proposed_end_date?->format('Y-m-d'),
            'monthly_rent' => $this->monthly_rent,
            'deposit_amount' => $this->deposit_amount,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relationships
            'client' => ClientResource::make($this->whenLoaded('client')),
            'property' => PropertyResource::make($this->whenLoaded('property')),
            'room' => RoomResource::make($this->whenLoaded('room')),
        ];
    }
}
