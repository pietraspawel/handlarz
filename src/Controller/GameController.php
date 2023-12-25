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
            $json = '{"random"}';
        } elseif (file_exists($filepath)) {
            $config = Yaml::parseFile($filepath);
            $json = json_encode($config);
        } else {
            return $this->redirectToRoute('app_home');
        }

        return $this->render('game/index.html.twig', [
            'json' => $json,
        ]);
    }
}
