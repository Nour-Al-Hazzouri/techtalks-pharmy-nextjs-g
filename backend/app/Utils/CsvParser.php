<?php

namespace App\Utils;

class CsvParser
{
    /**
     * Parse a CSV file into an array of associative arrays.
     *
     * @param string $filePath
     * @return array
     */
    public static function parse(string $filePath): array
    {
        $data = [];
        if (($handle = fopen($filePath, 'r')) !== false) {
            $headers = fgetcsv($handle, 1000, ',');
            
            // Normalize headers (trim, lowercase if needed, but keeping simple for now)
            
            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (count($headers) === count($row)) {
                    $data[] = array_combine($headers, $row);
                }
            }
            fclose($handle);
        }
        return $data;
    }
}
