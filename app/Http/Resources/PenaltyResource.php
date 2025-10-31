<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PenaltyResource extends JsonResource
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
            'penaltyable_type' => $this->penaltyable_type,
            'penaltyable_id' => $this->penaltyable_id,
            'contract_id' => $this->contract_id,
            'client_id' => $this->client_id,
            'penalty_type' => $this->penalty_type,
            'description' => $this->description,
            'amount' => $this->amount,
            'invoice_file' => $this->invoice_file,
            'payment_document_file' => $this->payment_document_file,
            'issue_date' => $this->issue_date?->format('Y-m-d'),
            'due_date' => $this->due_date?->format('Y-m-d'),
            'paid_date' => $this->paid_date?->format('Y-m-d'),
            'payment_status' => $this->payment_status,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relationships
            'penaltyable' => $this->whenLoaded('penaltyable'),
            'contract' => ContractResource::make($this->whenLoaded('contract')),
            'client' => ClientResource::make($this->whenLoaded('client')),
        ];
    }
}
