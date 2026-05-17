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

        $filepath = $this->projectDir . self::GOODS_NAMES_FILEPATH;
        $goods = file($filepath);
        $this->goodService = new GoodService($goods);

        $filepath = $this->projectDir . self::CITY_NAMES_FILEPATH;
        $cityNamesList = file($filepath);
        foreach ($cityNamesList as $key => $value) {
            $cityNamesList[$key] = trim($value);
        }
        $this->cityService = new CityService($this->goodService, self::CITIES_AMOUNT, $cityNamesList);
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
                'cities' => $this->cityService->generateRandomCities(self::WORLD_X_SIZE, self::WORLD_Y_SIZE),
            ]
        ];
        return $this->generateTwigData($config);
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
