<?php

namespace App\Mail;

use App\Models\Parcel;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ParcelReadyForCollection extends Mailable
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
            ->subject('Your package is ready for collection.')
            ->view('emails.parcel-ready-for-collection');
    }
}