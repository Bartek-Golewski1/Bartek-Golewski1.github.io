<?php
namespace App;

use App\Encoder\EncoderInterface;
use Exception;

class Serializer {
    private array $encoders;

    public function __construct(array $encoders) {
        $this->encoders = $encoders;
    }

    private function getEncoder(string $format): EncoderInterface {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder;
            }
        }
        throw new Exception("Brak obsługi dla formatu: " . $format);
    }

    public function deserialize(string $data, string $format): array {
        return $this->getEncoder($format)->decode($data, $format);
    }

    public function serialize(array $data, string $format): string {
        return $this->getEncoder($format)->encode($data, $format);
    }
}