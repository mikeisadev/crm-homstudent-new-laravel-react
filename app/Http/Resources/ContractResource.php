<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
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
            'contract_number' => $this->contract_number,
            'year' => $this->year,
            'sequential_number' => $this->sequential_number,
            'proposal_id' => $this->proposal_id,
            'client_id' => $this->client_id,
            'secondary_client_id' => $this->secondary_client_id,
            'property_type' => $this->property_type,
            'condominium_id' => $this->condominium_id,
            'property_id' => $this->property_id,
            'room_id' => $this->room_id,
            'contract_type' => $this->contract_type,
            'status' => $this->status,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'cancellation_notice_months' => $this->cancellation_notice_months,
            'monthly_rent' => $this->monthly_rent,
            'deposit_amount' => $this->deposit_amount,
            'entry_fee' => $this->entry_fee,
            'deposit_refund_percentage' => $this->deposit_refund_percentage,
            'pdf_path' => $this->pdf_path,
            'origin' => $this->origin,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relationships
            'client' => ClientResource::make($this->whenLoaded('client')),
            'secondary_client' => ClientResource::make($this->whenLoaded('secondaryClient')),
            'property' => PropertyResource::make($this->whenLoaded('property')),
            'room' => RoomResource::make($this->whenLoaded('room')),
            'condominium' => CondominiumResource::make($this->whenLoaded('condominium')),
            'payments' => ContractPaymentResource::collection($this->whenLoaded('payments')),
        ];
    }
}
