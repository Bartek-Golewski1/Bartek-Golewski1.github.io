<?php
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $base_dir = __DIR__.'/lib/';
    if(0 === strpos($class, $prefix)) {
        $relative = substr($class, strlen($prefix));
        $file = $base_dir.str_replace('\\', '/', $relative).'.php';
        if(file_exists($file)) {
            require $file;
        }
    }
});