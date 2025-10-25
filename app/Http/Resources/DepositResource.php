<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepositResource extends JsonResource
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
            'contract_id' => $this->contract_id,
            'client_id' => $this->client_id,
            'property_type' => $this->property_type,
            'property_id' => $this->property_id,
            'room_id' => $this->room_id,
            'amount' => $this->amount,
            'payment_receipt' => $this->payment_receipt,
            'refund_date' => $this->refund_date?->format('Y-m-d'),
            'refund_amount' => $this->refund_amount,
            'refund_notes' => $this->refund_notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relationships
            'contract' => ContractResource::make($this->whenLoaded('contract')),
            'client' => ClientResource::make($this->whenLoaded('client')),
            'property' => PropertyResource::make($this->whenLoaded('property')),
            'room' => RoomResource::make($this->whenLoaded('room')),
        ];
    }
}
