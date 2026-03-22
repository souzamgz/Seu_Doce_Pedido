<?php

namespace App\Jobs;

use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNewOrderWhatsAppNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $sellerPhoneNumber;
    protected $storeLink;

    public function __construct(string $sellerPhoneNumber, string $storeLink)
    {
        $this->sellerPhoneNumber = $sellerPhoneNumber;
        $this->storeLink = $storeLink;
    }

    public function handle(WhatsAppService $whatsappService): void
    {
        $templateName = 'hello_world';
        $whatsappService->sendTemplateMessage(
            $this->sellerPhoneNumber,
            $templateName,
            //[$this->storeLink]
        );
    }
}