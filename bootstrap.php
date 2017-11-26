<?php

// Load custom config, if exists
ob_start();
$config = file_exists(__DIR__ . '/config.php') ?
    require __DIR__ . '/config.php' :
    [];
ob_end_clean();
