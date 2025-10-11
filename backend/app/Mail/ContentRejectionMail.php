<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContentRejectionMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $contentType;
    public string $contentTitle;
    public ?string $rejectionReason;
    public string $userName;

    public function __construct(string $contentType, string $contentTitle, ?string $rejectionReason, string $userName)
    {
        $this->contentType = $contentType;
        $this->contentTitle = $contentTitle;
        $this->rejectionReason = $rejectionReason;
        $this->userName = $userName;
    }

    public function build()
    {
        $subject = "Your {$this->contentType} has been reviewed";
        
        return $this->subject($subject)
            ->view('emails.content-rejection')
            ->with([
                'contentType' => $this->contentType,
                'contentTitle' => $this->contentTitle,
                'rejectionReason' => $this->rejectionReason,
                'userName' => $this->userName,
            ]);
    }
}



