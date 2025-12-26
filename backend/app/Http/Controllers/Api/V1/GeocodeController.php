<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GeocodeController extends Controller
{
    use ApiResponse;

    public function search(Request $request)
    {
        try {
            $request->validate([
                'q' => 'required|string|min:3|max:200',
            ]);

            $ip = $request->ip() ?? 'unknown';
            $rateKey = 'geocode:rate:' . $ip;

            $hits = Cache::get($rateKey, 0);
            if ($hits >= 60) {
                return $this->errorResponse('Too many requests. Please wait a minute and try again.', [], 429);
            }

            Cache::put($rateKey, $hits + 1, now()->addMinute());

            $q = trim($request->query('q'));
            $cacheKey = 'geocode:search:' . md5(mb_strtolower($q));

            $results = Cache::remember($cacheKey, now()->addHours(6), function () use ($q) {
                $response = Http::withHeaders([
                    'User-Agent' => 'Pharmy/1.0 (contact: admin@pharmy.local)',
                    'Accept' => 'application/json',
                ])
                    ->connectTimeout(5)
                    ->timeout(12)
                    ->retry(2, 250)
                    ->withOptions([
                        'curl' => [
                            CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
                        ],
                    ])
                    ->get('https://nominatim.openstreetmap.org/search', [
                    'format' => 'jsonv2',
                    'q' => $q,
                    'addressdetails' => 1,
                    'limit' => 6,
                    'countrycodes' => 'lb',
                ]);

                if (!$response->ok()) {
                    throw new \Exception('Geocoding provider error');
                }

                $data = $response->json();
                if (!is_array($data)) {
                    return [];
                }

                return array_map(function ($item) {
                    return [
                        'place_id' => $item['place_id'] ?? null,
                        'display_name' => $item['display_name'] ?? null,
                        'lat' => $item['lat'] ?? null,
                        'lon' => $item['lon'] ?? null,
                        'type' => $item['type'] ?? null,
                    ];
                }, $data);
            });

            return $this->successResponse('Geocode results', $results);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->errorResponse('Invalid query', $e->errors(), 422);
        } catch (ConnectionException $e) {
            return $this->errorResponse('Geocoding service unavailable. Please try again.', [], 503);
        } catch (\Exception $e) {
            return $this->errorResponse('Geocode search failed: ' . $e->getMessage(), [], 500);
        }
    }
}
