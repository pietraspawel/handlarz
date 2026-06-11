<?php

namespace App\Controller;

use App\Service\FormatterService;
use App\Service\GameService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="app_home")
     */
    public function index(GameService $gameService, FormatterService $formatterService): Response
    {
        $projectDir = $this->getParameter('kernel.project_dir');
        $dir = $projectDir . GameService::MAPS_PATH;
        $highscores = [];
        $mapDirs = glob($dir . '*', GLOB_ONLYDIR);

        foreach ($mapDirs as $mapDir) {
            $map = basename($mapDir);
            $hsFile = $mapDir . '/' . $map . '.hs';
            $highscore = '';
            if (file_exists($hsFile)) {
                $score = (int) file_get_contents($hsFile);
                if ($score > 0) {
                    $highscore = ' ( ' . $formatterService->formatGold($score) . ' $ )';
                }
            }

            $highscores[$map] = $highscore;
        }

        return $this->render('home/main_menu.html.twig', [
            'highscores' => $highscores,
        ]);
    }
}
