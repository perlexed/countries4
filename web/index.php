<?php

$customConfig = require dirname(__DIR__) . '/env_bootstrap.php';

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../vendor/yiisoft/yii2/Yii.php';

$customConfig = require dirname(__DIR__) . '/yii_bootstrap.php';
$config = \yii\helpers\ArrayHelper::merge(require dirname(__DIR__) . '/config/web.php', $customConfig);

(new yii\web\Application($config))->run();
