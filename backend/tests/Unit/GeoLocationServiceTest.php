<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Utils\GeoLocationService;

class GeoLocationServiceTest extends TestCase
{
    public function test_distance_calculation()
    {
        // Distance roughly between 10,10 and 10.1,10.1 is ~15km
        $dist = GeoLocationService::getDistance(10, 10, 10.1, 10.1);
        $this->assertGreaterThan(0, $dist);
        $this->assertIsFloat($dist);
    }
}
