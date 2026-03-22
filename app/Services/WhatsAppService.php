<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $token;
    protected $phoneNumberId;
    protected $baseUrl;

    public function __construct()
    {
        $this->token = config('services.whatsapp.api_token');
        $this->phoneNumberId = config('services.whatsapp.phone_number_id');
        $this->baseUrl = "https://graph.facebook.com/v20.0/{$this->phoneNumberId}/messages";
    }

    /**
     * Envia uma mensagem de modelo para um número de telefone.
     *
     * @param string $recipientPhoneNumber
     * @param string $templateName
     * @param array $parameters
     * @param string $langCode
     * @return bool
     */
    public function sendTemplateMessage(string $recipientPhoneNumber, string $templateName, array $parameters = [], string $langCode = 'en_US'): bool
    {
        if (!$this->token || !$this->phoneNumberId) {
            Log::error('Credenciais da API do WhatsApp não configuradas.');
            return false;
        }

        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $recipientPhoneNumber,
            'type' => 'template',
            'template' => [
                'name' => $templateName,
                'language' => [
                    'code' => $langCode
                ],
                'components' => [
                    [
                        'type' => 'body',
                        'parameters' => $this->formatParameters($parameters)
                    ]
                ]
            ]
        ];
        
        // Se não houver parâmetros, remove o componente
        if (empty($parameters)) {
            unset($payload['template']['components']);
        }

        try {
            $response = Http::withToken($this->token)->post($this->baseUrl, $payload);

            if ($response->successful()) {
                Log::info("Mensagem do WhatsApp enviada para {$recipientPhoneNumber}.");
                return true;
            }

            // Log de erro detalhado
            Log::error('Falha ao enviar mensagem do WhatsApp.', [
                'status' => $response->status(),
                'response' => $response->json()
            ]);
            return false;

        } catch (\Exception $e) {
            Log::error('Exceção ao enviar mensagem do WhatsApp: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Formata os parâmetros para o formato exigido pela API.
     * @param array $parameters
     * @return array
     */
    private function formatParameters(array $parameters): array
    {
        $formatted = [];
        foreach ($parameters as $param) {
            $formatted[] = ['type' => 'text', 'text' => $param];
        }
        return $formatted;
    }
}