<?php // I:\ptw\lab-f\yaml.php

$data = [
    'name' => 'Bartek Golewski',
    'index' => '57779',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;