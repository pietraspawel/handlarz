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
        $filepath = $projectDir . '/config/game/maps/' . $map . '.yaml';

        if ($map == 'random') {
            $args = $gameService->generateRandomMap();
        } elseif (file_exists($filepath)) {
            $args = $gameService->loadPredefinedMap($filepath);
        } else {
            return $this->redirectToRoute('app_home');
        }

        return $this->render('game/index.html.twig', $args);
    }
}
