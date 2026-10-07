<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Parcel Collected</title>
</head>
<body>
    <p>Hello {{ $parcel->recipient_name }},</p>

    <p>
        Your parcel has been collected.
    </p>

    <p>
        <strong>Tracking Number:</strong>
        {{ $parcel->tracking_number }}
    </p>

    <p>
        <strong>Parcel Type:</strong>
        {{ $parcel->parcel_type }}
    </p>

    <p>
        <strong>Collection Date:</strong>
        {{ $parcel->date_collected }}
    </p>

    <p>
        Thank you for doing business with us.
    </p>

    <p>
        Regards,<br>
        Hermes Platform
    </p>
</body>
</html>