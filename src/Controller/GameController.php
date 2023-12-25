<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    /**
     * @Route("/game/{map}", name="app_game")
     */
    public function index(string $map): Response
    {
        return $this->render('game/index.html.twig', [
            'name' => $map,
        ]);
    }
}
