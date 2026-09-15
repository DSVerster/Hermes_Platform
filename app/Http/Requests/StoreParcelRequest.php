<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreParcelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'courier_id' => ['required', 'exists:couriers,courier_id'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['required', 'string', 'max:50'],
            'tracking_number' => ['required', 'string', 'max:255', 'unique:parcels,tracking_number'],
            'parcel_type' => ['required', 'string', 'max:255'],
            'courier_service' => ['nullable', 'string', 'max:255'],
            'storage_location' => ['required', 'string', 'max:255'],
            'status' => ['required', 'string', 'max:50'],
            'collection_fee' => ['required', 'numeric', 'min:0'],
        ];
    }
}