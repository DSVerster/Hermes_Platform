<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Package Ready For Collection</title>
</head>
<body>
    <p>Hello {{ $parcel->recipient_name }},</p>

    <p>Your package is ready for collection.</p>

    <p>
        <strong>Tracking Number:</strong>
        {{ $parcel->tracking_number }}
    </p>

    <p>
        <strong>Parcel Type:</strong>
        {{ $parcel->parcel_type }}
    </p>

    <p>
        <strong>Storage Location:</strong>
        {{ $parcel->storage_location }}
    </p>

    <p>
        Please collect your package at your earliest convenience.
    </p>

    <p>
        Regards,<br>
        Hermes Platform
    </p>
</body>
</html>