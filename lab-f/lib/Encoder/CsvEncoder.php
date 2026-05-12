<?php
namespace App\Encoder;

class CsvEncoder implements EncoderInterface {
    public function supports(string $format): bool {
        return in_array(strtolower($format), ['csv', 'ssv', 'tsv']);
    }

    private function getDelimiter(string $format): string {
        return match (strtolower($format)) {
            'csv' => ',',
            'ssv' => ';',
            'tsv' => "\t",
            default => ',',
        };
    }

    public function encode(array $data, string $format): string {
        if (empty($data)) return '';
        $delimiter = $this->getDelimiter($format);

        $output = fopen('php://temp', 'r+');
        fputcsv($output, array_keys($data[0]), $delimiter, '"', '\\');

        foreach ($data as $row) {
            fputcsv($output, $row, $delimiter, '"', '\\');
        }

        rewind($output);
        $encoded = stream_get_contents($output);
        fclose($output);
        return trim($encoded);
    }

    public function decode(string $data, string $format): array {
        $delimiter = $this->getDelimiter($format);
        $lines = explode("\n", trim($data));
        if (empty($lines[0])) return [];

        $headers = str_getcsv(array_shift($lines), $delimiter, '"', '\\');
        $result = [];

        foreach ($lines as $line) {
            if (trim($line) === '') continue;
            $row = str_getcsv(trim($line), $delimiter, '"', '\\');
            if (count($headers) === count($row)) {
                $result[] = array_combine($headers, $row);
            }
        }
        return $result;
    }
}