<?php

namespace App\Mail;

use App\Models\Parcel;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ParcelCollected extends Mailable
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
            ->subject('Your parcel has been collected.')
            ->view('emails.parcel-collected');
    }
}