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
            'secondary_client_id' => $this->secondary_client_id,
            'property_type' => $this->property_type,
            'property_id' => $this->property_id,
            'room_id' => $this->room_id,
            'proposal_type' => $this->proposal_type,
            'status' => $this->status,
            'proposed_start_date' => $this->proposed_start_date?->format('Y-m-d'),
            'proposed_end_date' => $this->proposed_end_date?->format('Y-m-d'),
            'notice_months' => $this->notice_months,
            'deposit_return_days' => $this->deposit_return_days,
            'sent_at' => $this->sent_at?->toISOString(),
            'monthly_rent' => $this->monthly_rent,
            'deposit_amount' => $this->deposit_amount,
            'entry_fee' => $this->entry_fee,
            'validity_days' => $this->validity_days,
            'installments_json' => $this->installments_json, // Already decoded from JSON by Laravel
            'html_document' => $this->html_document,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relationships
            'client' => ClientResource::make($this->whenLoaded('client')),
            'secondaryClient' => ClientResource::make($this->whenLoaded('secondaryClient')),
            'property' => PropertyResource::make($this->whenLoaded('property')),
            'room' => RoomResource::make($this->whenLoaded('room')),
        ];
    }
}
