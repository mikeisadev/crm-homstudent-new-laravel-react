<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
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
            'file' => [
                'required',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png', // Allowed extensions
                'max:2560', // 2.5 MB in kilobytes (2560 KB = 2.5 MB)
            ],
            'folder_id' => [
                'nullable',
                'exists:client_folders,id',
            ],
        ];
    }

    /**
     * Custom validation messages in Italian
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'file.required' => 'Il file è obbligatorio',
            'file.file' => 'Il file caricato non è valido',
            'file.mimes' => 'Tipo di file non supportato. Usa PDF, DOC, DOCX, JPG o PNG',
            'file.max' => 'Il file supera il limite di 2.5 MB',
            'folder_id.exists' => 'La cartella selezionata non esiste',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Additional security validation: check folder belongs to client
            if ($this->folder_id) {
                $folder = \App\Models\ClientFolder::find($this->folder_id);
                $clientId = $this->route('client')->id ?? $this->route('client');

                if ($folder && $folder->client_id != $clientId) {
                    $validator->errors()->add('folder_id', 'La cartella non appartiene a questo cliente');
                }
            }

            // Security: Check file name for path traversal attempts
            if ($this->hasFile('file')) {
                $originalName = $this->file('file')->getClientOriginalName();
                if (preg_match('/\.\.\/|\.\.\\\\/', $originalName)) {
                    $validator->errors()->add('file', 'Nome file non valido: possibile tentativo di path traversal');
                }
            }
        });
    }
}
