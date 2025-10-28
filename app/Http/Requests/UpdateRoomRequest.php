<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
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
    public function rules(): array
    {
        return [
            'property_id' => 'sometimes|required|exists:properties,id',
            'internal_code' => 'sometimes|required|string|max:255',
            'room_type' => 'sometimes|required|string|max:255',
            'surface_area' => 'nullable|numeric|min:0',
            'monthly_price' => 'nullable|numeric|min:0',
            'weekly_price' => 'nullable|numeric|min:0',
            'daily_price' => 'nullable|numeric|min:0',
            'minimum_stay_type' => 'nullable|in:days,weeks,months,years',
            'minimum_stay_number' => 'nullable|integer|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'entry_fee' => 'nullable|numeric|min:0',
            'min_age' => 'nullable|integer|min:0',
            'max_age' => 'nullable|integer|min:0',
            'smoking_allowed' => 'nullable|boolean',
            'pets_allowed' => 'nullable|boolean',
            'musical_instruments_allowed' => 'nullable|boolean',
            'gender_preference' => 'nullable|in:male,female,couple,family,any',
            'occupant_type' => 'nullable|string|max:255',
            'has_double_bed' => 'nullable|boolean',
            'cancellation_notice_months' => 'nullable|integer|min:0',
            'fiscal_regime' => 'nullable|string|max:255',
            'fiscal_rate' => 'nullable|numeric|min:0',
            'is_published_web' => 'nullable|boolean',
            'availability_type' => 'sometimes|required|in:auto_from_contracts,forced_free,forced_occupied,forced_free_from_date',
            'available_from' => 'nullable|date',
            'notes' => 'nullable|string',
        ];
    }
}
