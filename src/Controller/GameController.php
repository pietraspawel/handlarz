<?php

namespace App\Controller;

use App\Service\GameService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    /**
     * @Route("/game/{map}", name="app_game")
     */
    public function index(string $map, GameService $gameService): Response
    {
        $projectDir = $this->getParameter('kernel.project_dir');
        $filepath = $projectDir . GameService::MAPS_PATH . $map . '.yaml';

        if ($map == 'random') {
            $args = $gameService->generateRandomMap($map);
        } elseif (file_exists($filepath)) {
            $args = $gameService->loadPredefinedMap($map);
        } else {
            return $this->redirectToRoute('app_home');
        }

        return $this->render('game/index.html.twig', $args);
    }

    /**
     * @Route("/game-over", name="app_game_over")
     */
    public function gameOver(): Response
    {
        $map = filter_input(INPUT_COOKIE, 'map');
        $score = filter_input(INPUT_COOKIE, 'score');
        $highscore = filter_input(INPUT_COOKIE, 'highscore');
        $projectDir = $this->getParameter('kernel.project_dir');
        $filepath = $projectDir . GameService::HIGHSCORES_PATH . $map . '.hs';
        $currentHighscore = file_get_contents($filepath);

        // skasuj ciastka
        // zapisz highscore
        return $this->render('game/game_over.html.twig', [
            'score' => $score,
            'highscore' => $highscore,
        ]);
    }
}
