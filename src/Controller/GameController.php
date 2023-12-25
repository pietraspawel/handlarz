<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Yaml\Yaml;

class GameController extends AbstractController
{
    private const CITIES_AMOUNT = 3;

    /**
     * @Route("/game/{map}", name="app_game")
     */
    public function index(string $map): Response
    {
        $projectDir = $this->getParameter('kernel.project_dir');
        $filepath = $projectDir . '/config/game/maps/' . $map . '.yaml';

        if ($map == 'random') {
            $args = $this->generateRandomMap();
        } elseif (file_exists($filepath)) {
            $args = $this->loadPredefinedMap($filepath);
        } else {
            return $this->redirectToRoute('app_home');
        }

        var_dump($args['config']['world']['cities']);
        die;

        return $this->render('game/index.html.twig', $args);
    }

    private function generateRandomMap(): array
    {
        $config = [
            'world' => [
                'xSize' => 20,
                'ySize' => 10,
                'startGold' => 100,
                'turnsAmount' => 10,
                'cities' => $this->generateRandomCities(),
            ]
        ];
        $data = base64_encode(json_encode($config));
        $style = [];
        return [
            'config' => $config,
            'data' => $data,
            'style' => $style,
        ];
    }

    private function generateRandomCities(): array
    {
        $cities = $this->randomCityNames();
        return $cities;
    }

    private function randomCityNames(): array
    {
        $projectDir = $this->getParameter('kernel.project_dir');
        $filepath = $projectDir . '/config/game/city-names.txt';

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
    private function randomCitiesPositionIndexes()
    {
        foreach ($this->cities as $key => $value) {
            $this->cities[$key]['x'] = null;
            $this->cities[$key]['y'] = null;
        }
        foreach ($this->cities as $key => $value) {
            do {
                $posX = mt_rand(0, $this->getXSize() - 1);
                $posY = mt_rand(0, $this->getYSize() - 1);
            } while (!$this->areCoordinatesOfCityCorrect($posX, $posY));
            $this->cities[$key]['x'] = $posX;
            $this->cities[$key]['y'] = $posY;
        }
    }

    /**
     * Check if coordinates of new city are correct.
     */
    private function areCoordinatesOfCityCorrect(int $x, int $y): bool
    {
        foreach ($this->cities as $key => $city) {
            if (
                $x >= $city['x'] - 1
                and $x <= $city['x'] + 1
                and $y >= $city['y'] - 1
                and $y <= $city['y'] + 1
            ) {
                return false;
            }
        }
        return true;
    }

    private function loadPredefinedMap(string $filepath): array
    {
        $config = Yaml::parseFile($filepath);
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
}
