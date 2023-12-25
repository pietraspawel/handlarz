<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Yaml\Yaml;

class GameService
{
    private const DEFAULT_WORLD_X_SIZE = 20;
    private const DEFAULT_WORLD_Y_SIZE = 10;
    private const DEFAULT_WORLD_START_GOLD = 100;
    private const DEFAULT_WORLD_TURNS_AMOUNT = 10;
    private const CITIES_AMOUNT = 3;

    private $projectDir;

    public function __construct(ContainerInterface $container)
    {
        $this->projectDir = $container->getParameter('kernel.project_dir');
    }

    public function loadPredefinedMap(string $filepath): array
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
