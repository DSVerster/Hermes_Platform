<?php

namespace App\Http\Requests\Settings;

use App\Models\Staff;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],

            'email_account' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(Staff::class, 'email_account')->ignore($this->user()->staff_id, 'staff_id'),
            ],
        ];
    }
}