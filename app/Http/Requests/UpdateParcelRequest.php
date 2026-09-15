<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateParcelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    public function rules(): array
    {
        return [
            'tracking_number'  => [
                'required', 'string', 'max:100',
                Rule::unique('parcels', 'tracking_number')->ignore($this->parcel->parcel_id, 'parcel_id'),
            ],
            'recipient_name'   => ['required', 'string', 'max:255'],
            'recipient_phone'  => ['required', 'string', 'max:20'],
            'parcel_type'      => ['required', 'string'],
            'storage_location' => ['required', 'string', 'max:100'],
            'status'           => ['required', 'string'],
            'courier_id'       => ['required', 'integer', 'exists:couriers,courier_id'],
            'staff_id'         => ['required', 'integer', 'exists:staff,staff_id'],
            'date_collected'   => ['nullable', 'date'],
        ];
    }
}