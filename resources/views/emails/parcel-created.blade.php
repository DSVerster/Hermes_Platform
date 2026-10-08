
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Parcel Created Successfully</title>
</head>
<body>
    <p>Hello {{ $parcel->recipient_name }},</p>

    <p>Your parcel order has been created successfully.</p>

    <p>We will communicate with you when it is ready for collection.</p>

    <p>
        <strong>Tracking Number:</strong>
        {{ $parcel->tracking_number }}
    </p>

    <p>
        <strong>Parcel Type:</strong>
        {{ $parcel->parcel_type }}
    </p>

    <p>
        Regards,<br>
        Hermes Platform
    </p>
</body>
</html>