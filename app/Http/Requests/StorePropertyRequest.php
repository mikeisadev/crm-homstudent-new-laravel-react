<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    /**
     * Get the validation rules that apply to the request.
     * Validation for creating a new property
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Basic information
            'condominium_id' => 'nullable|exists:condominiums,id',
            'internal_code' => 'required|string|max:30|unique:properties,internal_code',
            'name' => 'required|string|max:255',
            'property_type' => 'required|string|in:apartment,house,villa,office',

            // Address information
            'address' => 'required|string|max:255',
            'portal_address' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:10',
            'postal_code' => 'required|string|max:10',
            'country' => 'nullable|string|max:255',
            'zone' => 'nullable|string|max:255',

            // Property details
            'intended_use' => 'required|string|in:residential,directional,commercial,industrial',
            'layout' => 'nullable|string|in:single_level,two_levels',
            'surface_area' => 'nullable|numeric|min:0|max:99999.99',
            'property_status' => 'nullable|string|in:operational,under_renovation',
            'floor_number' => 'nullable|integer|min:-5|max:200',
            'total_floors' => 'nullable|integer|min:1|max:200',
            'construction_year' => 'nullable|integer|min:1800|max:' . (date('Y') + 5),
            'condition' => 'nullable|string|in:new,renovated,good,needs_renovation,under_renovation',

            // Features
            'bathrooms_with_tub' => 'nullable|integer|min:0|max:50',
            'bathrooms' => 'nullable|integer|min:0|max:50',
            'balconies' => 'nullable|integer|min:0|max:50',
            'has_concierge' => 'nullable|boolean',

            // Publishing
            'is_published_web' => 'nullable|boolean',
            'web_address' => 'nullable|url|max:500',
            'description' => 'nullable|string|max:5000',

            // Cadastral data
            'cadastral_section' => 'nullable|string|max:50',
            'cadastral_sheet' => 'nullable|string|max:50',
            'cadastral_particle' => 'nullable|string|max:50',
            'cadastral_subordinate' => 'nullable|string|max:50',
            'cadastral_category' => 'nullable|string|max:50',
            'cadastral_income' => 'nullable|numeric|min:0',

            // Energy & utilities
            'energy_certificate' => 'nullable|string|in:a_plus_plus,a_plus,a,b,c,d,e,f,g',
            'heating_type' => 'nullable|string|in:independent_electric,independent_gas,condominium,centralized_gas',
            'cooling_type' => 'nullable|string|in:independent_air_conditioning,independent_ceiling_fan,condominium_floor_cooling',
            'hot_water_type' => 'nullable|string|in:independent_electric,independent_gas',
            'cold_water_meter' => 'nullable|string|max:100',
            'electricity_pod' => 'nullable|string|max:100',
            'gas_pdr' => 'nullable|string|max:100',

            // Suppliers
            'water_supplier' => 'nullable|string|max:255',
            'water_contract_details' => 'nullable|string|max:1000',
            'gas_supplier' => 'nullable|string|max:255',
            'gas_contract_details' => 'nullable|string|max:1000',
            'electricity_supplier' => 'nullable|string|max:255',
            'electricity_contract_details' => 'nullable|string|max:1000',

            // Notes
            'notes' => 'nullable|string|max:10000',
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
            'internal_code.required' => 'Il codice interno è obbligatorio',
            'internal_code.unique' => 'Questo codice interno è già utilizzato',
            'name.required' => 'Il nome dell\'immobile è obbligatorio',
            'property_type.required' => 'La tipologia immobile è obbligatoria',
            'property_type.in' => 'La tipologia immobile deve essere: Appartamento, Casa, Villa o Ufficio',
            'address.required' => 'L\'indirizzo è obbligatorio',
            'city.required' => 'Il comune è obbligatorio',
            'province.required' => 'La provincia è obbligatoria',
            'postal_code.required' => 'Il CAP è obbligatorio',
            'intended_use.required' => 'La destinazione d\'uso è obbligatoria',
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
