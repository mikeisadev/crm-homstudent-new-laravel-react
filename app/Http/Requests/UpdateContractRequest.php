<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContractRequest extends FormRequest
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
            // Core fields (sometimes required for update)
            'client_id' => 'sometimes|required|exists:clients,id',
            'property_type' => 'sometimes|required|in:condominium,property,room',
            'contract_type' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',

            // Optional client
            'secondary_client_id' => 'nullable|exists:clients,id|different:client_id',

            // Property references
            'condominium_id' => 'nullable|exists:condominiums,id',
            'property_id' => 'nullable|exists:properties,id',
            'room_id' => 'nullable|exists:rooms,id',

            // Optional fields
            'proposal_id' => 'nullable|exists:proposals,id',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'cancellation_notice_months' => 'nullable|integer|min:0',
            'deposit_return_days' => 'nullable|integer|min:0',
            'validity_days' => 'nullable|integer|min:1',

            // Financial fields
            'monthly_rent' => 'nullable|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'entry_fee' => 'nullable|numeric|min:0',
            'deposit_refund_percentage' => 'nullable|integer|min:0|max:100',

            // Installments JSON (array of 12 installments)
            'installments_json' => 'nullable|array',
            'installments_json.*.number' => 'nullable|integer|min:1|max:12',
            'installments_json.*.date' => 'nullable|date',
            'installments_json.*.amount' => 'nullable|numeric|min:0',
            'installments_json.*.is_payment_completed' => 'nullable|boolean',

            // Document fields
            'html_content' => 'nullable|string',
            'html_document' => 'nullable|string',
            'pdf_path' => 'nullable|string|max:255',
            'origin' => 'nullable|string|max:255',
        ];
    }
}
