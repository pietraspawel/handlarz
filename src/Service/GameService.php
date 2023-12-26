<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Yaml\Yaml;

class GameService
{
    private const CITIES_AMOUNT = 3;
    private const CITY_NAMES_FILEPATH = '/config/game/city-names.txt';
    private const GOODS_NAMES_FILEPATH = '/config/game/goods-names.txt';
    private const HIGHSCORES_PATH = '/config/game/maps/';
    private const START_GOLD = 100;
    private const TURNS_AMOUNT = 10;
    private const WORLD_X_SIZE = 20;
    private const WORLD_Y_SIZE = 10;

    private $projectDir;

    public function __construct(ContainerInterface $container)
    {
        $this->projectDir = $container->getParameter('kernel.project_dir');
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
        $cities = $this->randomGoodsPrices($cities);
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
     */
    private function areCoordinatesOfCityCorrect(array $cities, int $x, int $y): bool
    {
        foreach ($cities as $key => $city) {
            if (
                $x >= $city['position']['x'] - 1
                && $x <= $city['position']['x'] + 2
                && $y >= $city['position']['y'] - 1
                && $y <= $city['position']['y'] + 1
            ) {
                return false;
            }
        }
        return true;
    }

    /**
     * Random goods prices.
     */
    private function randomGoodsPrices($cities): array
    {
        $filepath = $this->projectDir . self::GOODS_NAMES_FILEPATH;

        $goods = file($filepath);
        foreach ($goods as $key => $value) {
            $goods[$key] = trim($value);
        }

        foreach ($cities as $key => $city) {
            foreach ($goods as $goodKey => $good) {
                $cities[$key]['goods'][] = [
                    'name' => $good,
                    'price' => mt_rand(1, 100),
                ];
            }
        }
        return $cities;
    }

    public function loadPredefinedMap(string $map): array
    {
        $filepath = $this->projectDir . '/config/game/maps/' . $map . '.yaml';
        $config = Yaml::parseFile($filepath);
        $config['world']['map'] = $map;
        return $this->generateTwigData($config);
    }

    private function generateTwigData($config): array
    {
        $filepath = $this->projectDir . self::HIGHSCORES_PATH . $config['world']['map'] . '.hs';
        $highscore = file_get_contents($filepath);
        $config['world']['highscore'] = $highscore;
        $data = base64_encode(json_encode($config));

        $this->calculateCityNameStyle($config);
        $style = [
            'map' => [
                'grid_template_columns' => $this->calculateStyleMapGridTemplateColumns($config),
                'background_colors' => $this->generateTileBackgroundColors($config),
            ],
        ];

        return [
            'config' => $config,
            'data' => $data,
            'style' => $style,
        ];
    }

    /**
     * Calculate city name position depends on city position.
     */
    private function calculateCityNameStyle(&$config)
    {
        foreach ($config['world']['cities'] as $key => $city) {
            $top = "32px";
            $left = "0px";
            if ($city['position']['x'] >= $config['world']['xSize'] - 2) {
                $left = "auto";
            }
            if ($city['position']['y'] >= $config['world']['ySize'] - 1) {
                $top = "-25px";
            }
            $config['world']['cities'][$key]['name_style'] = "top: $top; left: $left;";
        }
    }

    /**
     * Generate style for map depends on world xSize.
     */
    private function calculateStyleMapGridTemplateColumns($config): string
    {
        $styleMapGridTemplateColumns = '';
        for ($i = 0; $i < $config['world']['xSize']; $i++) {
            $styleMapGridTemplateColumns .= 'auto ';
        }
        $styleMapGridTemplateColumns .= ';';
        return $styleMapGridTemplateColumns;
    }

    /**
     * Generate random tile background colors.
     */
    private function generateTileBackgroundColors($config): array
    {
        $backgroundColors = [];
        for ($y = 1; $y <= $config['world']['ySize']; $y++) {
            for ($x = 1; $x <= $config['world']['xSize']; $x++) {
                $backgroundColors[$x][$y] = $this->generateTileBackgroundColor();
            }
        }
        return $backgroundColors;
    }

    /**
     * Generate random background color.
     */
    private function generateTileBackgroundColor(): string
    {
        $colour = mt_rand(0, 9); //0 red 2-8 green 9 blue
        $green = mt_rand(225, 255);
        $red = 0;
        $blue = 0;
        if ($colour == 0) {
            $red = mt_rand(0, 150);
        }
        if ($colour == 9) {
            $blue = mt_rand(0, 150);
        }
        return "$red, $green, $blue";
    }
}
