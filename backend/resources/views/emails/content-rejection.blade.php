<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Content Review Notification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #fff; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6c757d; }
        .status { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .reason { background: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .no-reply { color: #6c757d; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Cordillera Heritage</h1>
            <p>Content Review Notification</p>
        </div>
        
        <div class="content">
            <p>Hello {{ $userName }},</p>
            
            <p>We have reviewed your {{ $contentType }} submission and unfortunately, it does not meet our community guidelines at this time.</p>
            
            <div class="status">
                <strong>Content Type:</strong> {{ ucfirst($contentType) }}<br>
                <strong>Title:</strong> {{ $contentTitle }}<br>
                <strong>Status:</strong> Rejected
            </div>
            
            <p>We encourage you to review our community guidelines and submit new content that aligns with our standards. Thank you for your understanding and continued participation in our community.</p>
            
            <p>Best regards,<br>
            The Cordillera Heritage Team</p>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <div class="no-reply">
                <p>If you have questions, please contact us through our support channels.</p>
            </div>
        </div>
    </div>
</body>
</html>
