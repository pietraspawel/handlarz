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
}
