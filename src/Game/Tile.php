<?php

namespace App\Game\Map;

class Tile
{
    private int $x;
    private int $y;
    private int $q;
    private int $r;
    private float $cx;
    private float $cy;

    public function __construct(
        int $x,
        int $y,
        int $q,
        int $r,
        float $cx,
        float $cy
    ) {
        $this->x = $x;
        $this->y = $y;
        $this->q = $q;
        $this->r = $r;
        $this->cx = $cx;
        $this->cy = $cy;
    }

    public function getX(): int
    {
        return $this->x;
    }

    public function getY(): int
    {
        return $this->y;
    }

    public function getQ(): int
    {
        return $this->q;
    }

    public function getR(): int
    {
        return $this->r;
    }

    public function getCx(): float
    {
        return $this->cx;
    }

    public function getCy(): float
    {
        return $this->cy;
    }

    public function toArray(): array
    {
        return [
            'x' => $this->x,
            'y' => $this->y,
            'q' => $this->q,
            'r' => $this->r,
            'cx' => $this->cx,
            'cy' => $this->cy,
        ];
    }
}
