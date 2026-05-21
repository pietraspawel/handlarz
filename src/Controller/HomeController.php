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
        $files = glob($dir . '*.yaml');
        $files[] = 'random.yaml';

        foreach ($files as $file) {
            $map = pathinfo($file, PATHINFO_FILENAME);
            $hsFile = $dir . $map . '.hs';

            if (file_exists($hsFile)) {
                $score = (int) file_get_contents($hsFile);
                if ($score > 0) {
                    $highscores[$map] = ' (' . $formatterService->formatGold($score) . ')';
                } else {
                    $highscores[$map] = '';
                }
            } else {
                $highscores[$map] = '';
            }
        }

        return $this->render('home/main_menu.html.twig', [
            'highscore' => $highscores,
        ]);
    }
}
