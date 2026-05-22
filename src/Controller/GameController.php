<?php

namespace App\Controller;

use App\Service\FormatterService;
use App\Service\GameService;
use App\Service\LogService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
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
     * @Route("/game-over/save", name="app_game_over_save", methods={"POST"})
     */
    public function saveGameOver(Request $request, LogService $logService): Response
    {
        $data = json_decode($request->getContent(), true);
        if (!empty($data['gameLog'])) {
            $logService->save($data['map'], $data['gameLog']);
        }
        $this->get('session')->set('game_over_data', $data);
        return new Response('', 204);
    }

    /**
     * @Route("/game-over", name="app_game_over", methods={"GET"})
     */
    public function gameOver(Request $request, FormatterService $formatterService): Response
    {
        $data = $request->getSession()->get('game_over_data');

        if (!$data) {
            return $this->redirectToRoute('app_home');
        }

        $map = $data['map'];
        $score = $data['score'];
        $aiTraders = $data['aiPlayers'];

        $oldHighscore = $this->_handleHighscore($map, $score);

        // Result
        $result = 'solo';
        $scores = [];

        foreach ($aiTraders as $aiTrader) {
            $scores[] = [
                'type' => 'ai',
                'name' => $aiTrader['name'],
                'gold' => $aiTrader['gold'],
                'goldFormatted' => $formatterService->formatGold($aiTrader['gold']),
            ];
        }

        usort($scores, function ($a, $b) {
            return $b['gold'] <=> $a['gold'];
        });

        if (!empty($aiTraders)) {
            $result = $this->_calculateResult($scores, $score);
            $scores = $this->_calculateScores($formatterService, $scores, $score);
        }

        return $this->render('game/game_over.html.twig', [
            'score' => $score,
            'scoreFormatted' => $formatterService->formatGold($score),
            'oldHighscore' => $oldHighscore,
            'result' => $result,
            'scores' => $scores,
            'logData' => $data['gameLog'],
        ]);
    }

    private function _handleHighscore(string $map, int $score): int
    {
        $projectDir = $this->getParameter('kernel.project_dir');
        $filepath = $projectDir . GameService::HIGHSCORES_PATH . $map . '.hs';

        $highscore = file_get_contents($filepath);

        if ($score > $highscore) {
            file_put_contents($filepath, $score);
        }
        return $highscore;
    }

    private function _calculateResult(array $results, int $score): string
    {
        $bestScore = $results[0]['gold'];

        if ($score == $bestScore) {
            return 'remis';
        } elseif ($score < $bestScore) {
            return 'loser';
        }
        return 'winner';
    }

    private function _calculateScores(FormatterService $formatterService, array $results, int $score): array
    {
        $results[] = [
            'type' => 'player',
            'name' => null,
            'gold' => $score,
            'goldFormatted' => $formatterService->formatGold($score),
        ];

        usort($results, function ($a, $b) {
            return $b['gold'] <=> $a['gold'];
        });
        return $results;
    }
}
