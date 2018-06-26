<?php

ob_start();

file_exists(__DIR__ . '/env_config.php') ?
    require __DIR__ . '/env_config.php' :
    [];

ob_end_clean();


defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'dev');
