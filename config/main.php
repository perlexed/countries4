<?php

return [
    'name' => 'Countries game',
    'components' => [
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'mysql:host=localhost;dbname=yii2basic',
            'username' => 'root',
            'password' => '',
            'charset' => 'utf8',

            // Schema cache options (for production environment)
            //'enableSchemaCache' => true,
            //'schemaCacheDuration' => 60,
            //'schemaCache' => 'cache',
        ],
    ],
    'params' => [
        'adminEmail' => 'admin@example.com',
    ],
    'version' => '1.0.0',
];