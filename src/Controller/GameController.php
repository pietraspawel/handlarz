<?php

namespace App\Controller;

use App\Service\GameService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    private const DEFAULT_WORLD_X_SIZE = 20;
    private const DEFAULT_WORLD_Y_SIZE = 10;
    private const DEFAULT_WORLD_START_GOLD = 100;
    private const DEFAULT_WORLD_TURNS_AMOUNT = 10;
    private const CITIES_AMOUNT = 3;

    /**
     * @Route("/game/{map}", name="app_game")
     */
    public function index(string $map, GameService $gameService): Response
    {
        $projectDir = $this->getParameter('kernel.project_dir');
        $filepath = $projectDir . '/config/game/maps/' . $map . '.yaml';

        if ($map == 'random') {
            $args = $this->generateRandomMap();
        } elseif (file_exists($filepath)) {
            $args = $gameService->loadPredefinedMap($filepath);
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
                'xSize' => self::DEFAULT_WORLD_X_SIZE,
                'ySize' => self::DEFAULT_WORLD_Y_SIZE,
                'startGold' => self::DEFAULT_WORLD_START_GOLD,
                'turnsAmount' => self::DEFAULT_WORLD_TURNS_AMOUNT,
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
        $cities = $this->randomCityPositionIndexes($cities);
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
    private function randomCityPositionIndexes(array $cities): array
    {
        foreach ($cities as $key => $value) {
            $cities[$key]['position']['x'] = null;
            $cities[$key]['position']['y'] = null;
        }
        foreach ($cities as $key => $value) {
            do {
                $posX = mt_rand(0, self::DEFAULT_WORLD_X_SIZE - 1);
                $posY = mt_rand(0, self::DEFAULT_WORLD_Y_SIZE - 1);
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
                and $x <= $city['position']['x'] + 1
                and $y >= $city['position']['y'] - 1
                and $y <= $city['position']['y'] + 1
            ) {
                return false;
            }
        }
        return true;
    }
}
