<?php

namespace App\Game\Map;

class GridService
{
    private float $hexWidth;
    private float $hexHeight;

    public function __construct(float $hexWidth, float $hexHeight)
    {
        $this->hexWidth = $hexWidth;
        $this->hexHeight = $hexHeight;
    }

    /**
     * Build full grid
     */
    public function build(int $width, int $height): array
    {
        $grid = [];

        for ($y = 1; $y <= $height; $y++) {
            for ($x = 1; $x <= $width; $x++) {
                $grid[$x][$y] = $this->createTile($x, $y);
            }
        }

        return $grid;
    }

    /**
     * Create single tile
     */
    private function createTile(int $x, int $y): Tile
    {
        $q = $x - 1;

        $r = ($y - 1) - intdiv($q - ($q & 1), 2);

        $px = $q * ($this->hexWidth * 0.75);

        $py = ($y - 1) * $this->hexHeight
            + (($q & 1) * ($this->hexHeight / 2));

        $cx = $px + $this->hexWidth / 2;
        $cy = $py + $this->hexHeight / 2;

        return new Tile($x, $y, $q, $r, $cx, $cy);
    }
}
