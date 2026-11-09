<?php


return [
    'paths' => ['api/*', 'storage/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
    'http://localhost:5174',
    'http://127.0.0.1:5174',
],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Bearer-token API: cookies are not used, so credentials stay off.
    'supports_credentials' => false,
];
