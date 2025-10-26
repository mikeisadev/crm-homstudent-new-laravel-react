<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
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

        // Format contacts data as key-value object
        $contactsData = [];
        if ($this->relationLoaded('contacts')) {
            foreach ($this->contacts as $contact) {
                $contactsData[$contact->type] = $contact->value;
            }
        }

        // Format banking data as object (get primary)
        $bankingData = [];
        if ($this->relationLoaded('banking')) {
            $primaryBanking = $this->banking->where('is_primary', true)->first();
            if ($primaryBanking) {
                $bankingData = [
                    'bank_name' => $primaryBanking->bank_name,
                    'iban' => $primaryBanking->iban,
                    'payment_method' => $primaryBanking->payment_method,
                ];
            }
        }

        return [
            'id' => $this->id,
            'type' => $this->type,
            'company_name' => $this->company_name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'mobile' => $this->mobile,
            'tax_code' => $this->tax_code,
            'vat_number' => $this->vat_number,
            'address' => $this->address,
            'city' => $this->city,
            'province' => $this->province,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'origin_source' => $this->origin_source,
            'origin_details' => $this->origin_details,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),

            // Formatted relationships as objects
            'meta_data' => $metaData,
            'contacts_data' => $contactsData,
            'banking_data' => $bankingData,

            // Other relationships (only when loaded)
            'addresses' => $this->whenLoaded('addresses'),
            'proposals' => $this->whenLoaded('proposals'),
            'contracts' => $this->whenLoaded('contracts'),
        ];
    }
}
