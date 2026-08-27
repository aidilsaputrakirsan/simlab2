<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Config;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(public string $token)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $expire = Config::get('auth.passwords.users.expire', 60);

        return (new MailMessage)
            ->subject('Reset Password - Laboratorium Terpadu ITK')
            ->greeting('Halo, ' . $notifiable->name)
            ->line('Kami menerima permintaan reset password untuk akun Anda.')
            ->action('Reset Password', $this->resetUrl($notifiable))
            ->line("Tautan reset password ini akan kedaluwarsa dalam {$expire} menit.")
            ->line('Jika Anda tidak merasa meminta reset password, abaikan email ini.')
            ->salutation('Terima kasih, Laboratorium Terpadu ITK');
    }

    private function resetUrl(object $notifiable): string
    {
        return rtrim(Config::get('app.frontend_url'), '/')
            . '/reset-password?token=' . $this->token
            . '&email=' . urlencode($notifiable->getEmailForPasswordReset());
    }
}
