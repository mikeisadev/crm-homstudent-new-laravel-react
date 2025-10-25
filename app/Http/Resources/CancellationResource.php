<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CancellationResource extends JsonResource
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
            'cancellation_date' => $this->cancellation_date?->format('Y-m-d'),
            'requested_by' => $this->requested_by,
            'reason' => $this->reason,
            'notice_given_date' => $this->notice_given_date?->format('Y-m-d'),
            'effective_date' => $this->effective_date?->format('Y-m-d'),
            'penalty_amount' => $this->penalty_amount,
            'deposit_refund_amount' => $this->deposit_refund_amount,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relationships
            'contract' => ContractResource::make($this->whenLoaded('contract')),
        ];
    }
}
