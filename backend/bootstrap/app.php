<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        $middleware->alias([
            'auth.jwt' => \App\Http\Middleware\IsAuth::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                $debug = (bool) config('app.debug');

                if ($e instanceof ValidationException) {
                    $errors = $e->errors();
                    $firstError = null;
                    foreach ($errors as $messages) {
                        if (is_array($messages) && isset($messages[0])) {
                            $firstError = $messages[0];
                            break;
                        }
                    }

                    return response()->json([
                        'status' => false,
                        'message' => $firstError ?: 'Validation failed.',
                        'data' => null,
                        'errors' => $errors,
                    ], 422);
                }

                if ($e instanceof AuthenticationException) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Unauthorized. Please log in and try again.',
                        'data' => null,
                        'errors' => null,
                    ], 401);
                }

                if ($e instanceof AuthorizationException) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Forbidden. You do not have permission to perform this action.',
                        'data' => null,
                        'errors' => null,
                    ], 403);
                }

                if ($e instanceof ModelNotFoundException) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Resource not found.',
                        'data' => null,
                        'errors' => null,
                    ], 404);
                }

                if ($e instanceof NotFoundHttpException) {
                    return response()->json([
                        'status' => false,
                        'message' => 'API route not found.',
                        'data' => null,
                        'errors' => null,
                    ], 404);
                }

                if ($e instanceof MethodNotAllowedHttpException) {
                    return response()->json([
                        'status' => false,
                        'message' => 'Method not allowed for this endpoint.',
                        'data' => null,
                        'errors' => null,
                    ], 405);
                }

                if ($e instanceof QueryException) {
                    $rawMessage = $e->getMessage();
                    if (stripos($rawMessage, 'unique') !== false || stripos($rawMessage, 'duplicate') !== false) {
                        return response()->json([
                            'status' => false,
                            'message' => 'This record already exists.',
                            'data' => null,
                            'errors' => null,
                        ], 409);
                    }
                }

                if ($e instanceof HttpExceptionInterface) {
                    $status = $e->getStatusCode();
                    $message = $e->getMessage();
                    if ($message === '') {
                        $message = 'Request failed.';
                    }

                    return response()->json([
                        'status' => false,
                        'message' => $message,
                        'data' => null,
                        'errors' => $debug ? $e->getTrace() : null,
                    ], $status);
                }

                return response()->json([
                    'status' => false,
                    'message' => $debug ? $e->getMessage() : 'Server error. Please try again later.',
                    'data' => null,
                    'errors' => $debug ? $e->getTrace() : null,
                ], 500);
            }
        });
    })->create();
