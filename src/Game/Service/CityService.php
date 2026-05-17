<?php

namespace App\Game\Service;

class CityService
{
    private const CITIES_AMOUNT = 3;

    private $cityNamesList;

    public function __construct(array $cityNamesList)
    {
        $this->cityNamesList = $cityNamesList;
    }

    public function randomCityNames(): array
    {
        $cities = array();
        while (count($cities) < self::CITIES_AMOUNT) {
            $randomName = $this->cityNamesList[mt_rand(0, count($this->cityNamesList) - 1)];
            if (!in_array($randomName, $cities)) {
                $cities[] = $randomName;
            }
        }
        foreach ($cities as $key => $value) {
            $cities[$key] = [ 'name' => $value ];
        }

        return $cities;
    }

    /**
     * Random cities position indexes.
     */
    public function randomCityPositionIndexes(array $cities, int $worldXSize, int $worldYSize): array
    {
        foreach ($cities as $key => $value) {
            $cities[$key]['position']['x'] = null;
            $cities[$key]['position']['y'] = null;
        }
        foreach ($cities as $key => $value) {
            do {
                $posX = mt_rand(1, $worldXSize);
                $posY = mt_rand(1, $worldYSize);
            } while (!$this->areCoordinatesOfCityCorrect($cities, $posX, $posY));
            $cities[$key]['position']['x'] = $posX;
            $cities[$key]['position']['y'] = $posY;
        }
        return $cities;
    }

    /**
     * Check if coordinates of new city are correct.
     * Cities must be at least 3 hexes apart.
     */
    private function areCoordinatesOfCityCorrect(array $cities, int $x, int $y): bool
    {
        // candidate city → axial
        [$q1, $r1] = GridService::offsetToAxial($x, $y);

        foreach ($cities as $city) {
            // pomiń miasta bez pozycji
            if (
                !isset($city['position']['x']) ||
                !isset($city['position']['y']) ||
                $city['position']['x'] === null ||
                $city['position']['y'] === null
            ) {
                continue;
            }

            // existing city → axial
            [$q2, $r2] = GridService::offsetToAxial(
                $city['position']['x'],
                $city['position']['y']
            );

            $distance = GridService::hexDistance($q1, $r1, $q2, $r2);

            if ($distance < 3) {
                return false;
            }
        }

        return true;
    }
}
