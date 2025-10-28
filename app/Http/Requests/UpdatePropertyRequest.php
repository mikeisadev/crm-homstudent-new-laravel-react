<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     * Validation for updating an existing property
     * All fields are optional to allow partial updates
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $propertyId = $this->route('property'); // Get property ID from route

        return [
            // Basic information
            'condominium_id' => 'sometimes|nullable|exists:condominiums,id',
            'internal_code' => 'sometimes|string|max:30|unique:properties,internal_code,' . $propertyId,
            'name' => 'sometimes|string|max:255',
            'property_type' => 'sometimes|string|in:apartment,house,villa,office',

            // Address information
            'address' => 'sometimes|string|max:255',
            'portal_address' => 'sometimes|nullable|string|max:255',
            'city' => 'sometimes|string|max:255',
            'province' => 'sometimes|string|max:10',
            'postal_code' => 'sometimes|string|max:10',
            'country' => 'sometimes|nullable|string|max:255',
            'zone' => 'sometimes|nullable|string|max:255',

            // Property details
            'intended_use' => 'sometimes|string|in:residential,directional,commercial,industrial',
            'layout' => 'sometimes|nullable|string|in:single_level,two_levels',
            'surface_area' => 'sometimes|nullable|numeric|min:0|max:99999.99',
            'property_status' => 'sometimes|nullable|string|in:operational,under_renovation',
            'floor_number' => 'sometimes|nullable|integer|min:-5|max:200',
            'total_floors' => 'sometimes|nullable|integer|min:1|max:200',
            'construction_year' => 'sometimes|nullable|integer|min:1800|max:' . (date('Y') + 5),
            'condition' => 'sometimes|nullable|string|in:new,renovated,good,needs_renovation,under_renovation',

            // Features
            'bathrooms_with_tub' => 'sometimes|nullable|integer|min:0|max:50',
            'bathrooms' => 'sometimes|nullable|integer|min:0|max:50',
            'balconies' => 'sometimes|nullable|integer|min:0|max:50',
            'has_concierge' => 'sometimes|nullable|boolean',

            // Publishing
            'is_published_web' => 'sometimes|nullable|boolean',
            'web_address' => 'sometimes|nullable|url|max:500',
            'description' => 'sometimes|nullable|string|max:5000',

            // Cadastral data
            'cadastral_section' => 'sometimes|nullable|string|max:50',
            'cadastral_sheet' => 'sometimes|nullable|string|max:50',
            'cadastral_particle' => 'sometimes|nullable|string|max:50',
            'cadastral_subordinate' => 'sometimes|nullable|string|max:50',
            'cadastral_category' => 'sometimes|nullable|string|max:50',
            'cadastral_income' => 'sometimes|nullable|numeric|min:0',

            // Energy & utilities
            'energy_certificate' => 'sometimes|nullable|string|in:a_plus_plus,a_plus,a,b,c,d,e,f,g',
            'heating_type' => 'sometimes|nullable|string|in:independent_electric,independent_gas,condominium,centralized_gas',
            'cooling_type' => 'sometimes|nullable|string|in:independent_air_conditioning,independent_ceiling_fan,condominium_floor_cooling',
            'hot_water_type' => 'sometimes|nullable|string|in:independent_electric,independent_gas',
            'cold_water_meter' => 'sometimes|nullable|string|max:100',
            'electricity_pod' => 'sometimes|nullable|string|max:100',
            'gas_pdr' => 'sometimes|nullable|string|max:100',

            // Suppliers
            'water_supplier' => 'sometimes|nullable|string|max:255',
            'water_contract_details' => 'sometimes|nullable|string|max:1000',
            'gas_supplier' => 'sometimes|nullable|string|max:255',
            'gas_contract_details' => 'sometimes|nullable|string|max:1000',
            'electricity_supplier' => 'sometimes|nullable|string|max:255',
            'electricity_contract_details' => 'sometimes|nullable|string|max:1000',

            // Notes
            'notes' => 'sometimes|nullable|string|max:10000',
        ];
    }

    /**
     * Get custom messages for validator errors (Italian)
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'internal_code.unique' => 'Questo codice interno è già utilizzato',
            'property_type.in' => 'La tipologia immobile deve essere: Appartamento, Casa, Villa o Ufficio',
            'intended_use.in' => 'La destinazione d\'uso deve essere: Abitativo, Direzionale, Commerciale o Industriale',
            'condominium_id.exists' => 'Il condominio selezionato non esiste',
            'surface_area.numeric' => 'La superficie deve essere un numero',
            'surface_area.min' => 'La superficie non può essere negativa',
            'floor_number.integer' => 'Il piano deve essere un numero intero',
            'construction_year.min' => 'L\'anno di costruzione deve essere maggiore di 1800',
            'construction_year.max' => 'L\'anno di costruzione non può essere nel futuro',
            'web_address.url' => 'L\'indirizzo web deve essere un URL valido',
        ];
    }
}
