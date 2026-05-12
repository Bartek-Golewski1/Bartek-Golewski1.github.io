<?php
require_once 'autoload.php';

use App\Serializer;
use App\Encoder\CsvEncoder;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;

$inputFormat = $_COOKIE['input_format'] ?? 'csv';
$outputFormat = $_COOKIE['output_format'] ?? 'json';
$inputData = $_COOKIE['input_data'] ?? '';
$outputData = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputFormat = $_POST['input_format'] ?? 'csv';
    $outputFormat = $_POST['output_format'] ?? 'json';
    $inputData = $_POST['input_data'] ?? '';

    setcookie('input_format', $inputFormat, time() + 3600 * 24);
    setcookie('output_format', $outputFormat, time() + 3600 * 24);
    setcookie('input_data', $inputData, time() + 3600 * 24);

    if (!empty(trim($inputData))) {
        $serializer = new Serializer([
            new CsvEncoder(),
            new JsonEncoder(),
            new YamlEncoder()
        ]);

        try {
            $parsedData = $serializer->deserialize($inputData, $inputFormat);
            $outputData = $serializer->serialize($parsedData, $outputFormat);
        } catch (Exception $e) {
            $outputData = "Błąd: " . $e->getMessage();
        }
    }
}

require 'templates/layout.php';