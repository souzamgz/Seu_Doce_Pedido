<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;



class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;
    public $email;
    /**
     * Create a new notification instance.
     */
    public function __construct($token, $email)
    {
          $this->token = $token;
           $this->email = $email;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Recuperação de Senha - AmorComRecheio')
            ->greeting('Olá!')
            ->line('Você está recebendo este e-mail porque recebemos uma solicitação de redefinição de senha para sua conta.')
            ->action(
             'Redefinir Senha',
            url(config('app.url') . 'reset-password/' . $this->token . '?email=' . urlencode($this->email))
                )

            ->line('Este link irá expirar em '.config('auth.passwords.'.config('auth.defaults.passwords').'.expire').' minutos.')
            ->line('Se você não solicitou a redefinição de senha, nenhuma ação adicional é necessária.')
            ->salutation('Atenciosamente, '.config('app.name'));
    }
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
