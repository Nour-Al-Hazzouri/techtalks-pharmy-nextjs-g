<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To allow your specific Netlify frontend, add its URL to the FRONTEND_URL
    | environment variable in Render.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter([
        env('FRONTEND_URL', 'https://techtalks-pharmy.netlify.app'),
        'http://localhost:3000',
    ])),

    'allowed_origins_patterns' => [
        '/^https:\/\/[a-z0-9-]+--techtalks-pharmy\.netlify\.app$/',
        '/^https:\/\/techtalks-pharmy\.netlify\.app$/',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
