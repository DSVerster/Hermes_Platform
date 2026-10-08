<?php

namespace App\Mail;

use App\Models\Parcel;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ParcelCreated extends Mailable
{
    use Queueable, SerializesModels;

    public Parcel $parcel;

    public function __construct(Parcel $parcel)
    {
        $this->parcel = $parcel;
    }

    public function build()
    {
        return $this
            ->subject('Your parcel order has been created successfully')
            ->view('emails.parcel-created');
    }
}