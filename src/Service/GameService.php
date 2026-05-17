<?php

namespace App\Service;

use App\Game\UI\UIService;
use App\Game\Service\CityService;
use App\Game\Service\GoodService;
use App\Game\Service\GridService;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Yaml\Yaml;

class GameService
{
    private const CITIES_AMOUNT = 3;
    private const CITY_NAMES_FILEPATH = '/config/game/city-names.txt';
    private const GOODS_NAMES_FILEPATH = '/config/game/goods-names.txt';
    public const HIGHSCORES_PATH = '/config/game/maps/';
    public const MAPS_PATH = '/config/game/maps/';
    private const START_GOLD = 100;
    private const TURNS_AMOUNT = 10;
    private const WORLD_X_SIZE = 20;
    private const WORLD_Y_SIZE = 10;
    /**
     * Mogą być podane obydwa HEX_WIDTH i HEX_HEIGHT. Jeśli jedno z nich jest null
     * to jest obliczane na podstawie drugiego. Oczywiście obydwa nie * mogą być null.
    */
    private const HEX_WIDTH = 42;
    private const HEX_HEIGHT = null;

    private $projectDir;
    private float $hexWidth;
    private float $hexHeight;
    private GridService $gridService;
    private CityService $cityService;
    private GoodService $goodService;

    public function __construct(ContainerInterface $container)
    {
        $this->projectDir = $container->getParameter('kernel.project_dir');

        if (
            self::HEX_WIDTH === null &&
            self::HEX_HEIGHT === null
        ) {
            throw new \RuntimeException(
                'HEX_WIDTH and HEX_HEIGHT cannot both equal null.'
            );
        }

        if (self::HEX_WIDTH !== null) {
            $this->hexWidth = self::HEX_WIDTH;
        }

        if (self::HEX_HEIGHT !== null) {
            $this->hexHeight = self::HEX_HEIGHT;
        }

        if (self::HEX_HEIGHT === null) {
            $this->hexHeight = $this->hexWidth * sqrt(3) / 2;
        }

        if (self::HEX_WIDTH === null) {
            $this->hexWidth = $this->hexHeight * 2 / sqrt(3);
        }

        $this->gridService = new GridService($this->hexWidth, $this->hexHeight);
        $this->cityService = new CityService();

        $filepath = $this->projectDir . self::GOODS_NAMES_FILEPATH;
        $goods = file($filepath);
        $this->goodService = new GoodService($goods);
    }

    public function generateRandomMap(string $map): array
    {
        $config = [
            'world' => [
                'map' => $map,
                'xSize' => self::WORLD_X_SIZE,
                'ySize' => self::WORLD_Y_SIZE,
                'startGold' => self::START_GOLD,
                'turnsAmount' => self::TURNS_AMOUNT,
                'cities' => $this->generateRandomCities(),
            ]
        ];
        return $this->generateTwigData($config);
    }

    private function generateRandomCities(): array
    {
        $cities = $this->randomCityNames();
        $cities = $this->randomCityPositionIndexes($cities);
        $cities = $this->goodService->randomGoodsPrices($cities);
        return $cities;
    }

    private function randomCityNames(): array
    {
        $filepath = $this->projectDir . self::CITY_NAMES_FILEPATH;

        $cities = array();
        $list = file($filepath);
        foreach ($list as $key => $value) {
            $list[$key] = trim($value);
        }
        while (count($cities) < self::CITIES_AMOUNT) {
            $randomName = $list[mt_rand(0, count($list) - 1)];
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
    private function randomCityPositionIndexes(array $cities): array
    {
        foreach ($cities as $key => $value) {
            $cities[$key]['position']['x'] = null;
            $cities[$key]['position']['y'] = null;
        }
        foreach ($cities as $key => $value) {
            do {
                $posX = mt_rand(1, self::WORLD_X_SIZE);
                $posY = mt_rand(1, self::WORLD_Y_SIZE);
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
        [$q1, $r1] = $this->gridService->offsetToAxial($x, $y);

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
            [$q2, $r2] = $this->gridService->offsetToAxial(
                $city['position']['x'],
                $city['position']['y']
            );

            $distance = $this->gridService->hexDistance($q1, $r1, $q2, $r2);

            if ($distance < 3) {
                return false;
            }
        }

        return true;
    }

    public function loadPredefinedMap(string $map): array
    {
        $filepath = $this->projectDir . self::MAPS_PATH . $map . '.yaml';
        $config = Yaml::parseFile($filepath);
        $config['world']['map'] = $map;
        return $this->generateTwigData($config);
    }

    private function generateTwigData($config): array
    {
        $filepath = $this->projectDir . self::HIGHSCORES_PATH . $config['world']['map'] . '.hs';
        if (!is_file($filepath)) {
            file_put_contents($filepath, '0');
        }
        $highscore = file_get_contents($filepath);
        $config['world']['highscore'] = $highscore;

        $filepath = $this->projectDir . self::GOODS_NAMES_FILEPATH;
        $goods = file($filepath);
        foreach ($goods as $key => $value) {
            $goods[$key] = trim($value);
        }
        $config['world']['goods'] = $goods;

        $cookie = filter_input(INPUT_COOKIE, 'tooltips');
        $showTooltips = "";
        if ($cookie == 1 || $cookie === null) {
            $showTooltips = "checked";
        }
        $config['general']['tooltips'] = $showTooltips;

        $config['world']['hexWidth'] = $this->hexWidth;
        $config['world']['hexHeight'] = $this->hexHeight;

        $data = base64_encode(json_encode($config));

        UIService::calculateCityNamePosition($config);

        $config['world']['grid'] = $this->gridService->build(
            $config['world']['xSize'],
            $config['world']['ySize']
        );

        return [
            'config' => $config,
            'data' => $data,
        ];
    }
}
