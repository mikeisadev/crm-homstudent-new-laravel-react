<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CondominiumResource extends JsonResource
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
            'name' => $this->name,
            'tax_code' => $this->tax_code,
            'address' => $this->address,
            'city' => $this->city,
            'province' => $this->province,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'construction_year' => $this->construction_year,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'administrator_name' => $this->administrator_name,
            'administrator_phone' => $this->administrator_phone,
            'administrator_mobile' => $this->administrator_mobile,
            'administrator_toll_free' => $this->administrator_toll_free,
            'administrator_email' => $this->administrator_email,
            'administrator_pec' => $this->administrator_pec,
            'water_meters_info' => $this->water_meters_info,
            'electricity_meters_info' => $this->electricity_meters_info,
            'gas_meters_info' => $this->gas_meters_info,
            'heating_system_info' => $this->heating_system_info,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
