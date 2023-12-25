<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Yaml\Yaml;

class GameController extends AbstractController
{
    /**
     * @Route("/game/{map}", name="app_game")
     */
    public function index(string $map): Response
    {
        $projectDir = $this->getParameter('kernel.project_dir');
        $filepath = $projectDir . '/config/game/maps/' . $map . '.yaml';

        if ($map == 'random') {
            $config = ['random'];
            $json = '{"random"}';
            $style = [];
        } elseif (file_exists($filepath)) {
            $config = Yaml::parseFile($filepath);
            $json = json_encode($config);

            $styleMapGridTemplateColumns = '';
            for ($i = 0; $i < $config['world']['xSize']; $i++) {
                $styleMapGridTemplateColumns .= 'auto ';
            }
            $styleMapGridTemplateColumns .= ';';

            $backgroundColors = [];
            for ($y = 1; $y <= $config['world']['ySize']; $y++) {
                for ($x = 1; $x <= $config['world']['xSize']; $x++) {
                    $backgroundColors[$x][$y] = $this->generateTileBackgroundColor();
                }
            }

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

            $style = [
                'map' => [
                    'grid_template_columns' => $styleMapGridTemplateColumns,
                    'background_colors' => $backgroundColors,
                ],
            ];
        } else {
            return $this->redirectToRoute('app_home');
        }

        return $this->render('game/index.html.twig', [
            'config' => $config,
            'json' => $json,
            'style' => $style,
        ]);
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
