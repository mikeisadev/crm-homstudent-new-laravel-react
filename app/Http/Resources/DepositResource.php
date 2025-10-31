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
            'depositable_type' => $this->depositable_type,
            'depositable_id' => $this->depositable_id,
            'client_id' => $this->client_id,
            'contract_id' => $this->contract_id,
            'amount' => $this->amount,
            'payment_document_file' => $this->payment_document_file,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relationships
            'depositable' => $this->whenLoaded('depositable'),
            'client' => ClientResource::make($this->whenLoaded('client')),
            'contract' => ContractResource::make($this->whenLoaded('contract')),
        ];
    }
}
