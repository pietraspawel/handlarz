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

        $color = $this->generateTileBackgroundColor();

        return new Tile($x, $y, $q, $r, $cx, $cy, $color);
    }

    /**
     * Generate random background color.
     */
    private function generateTileBackgroundColor(): string
    {
        $colour = mt_rand(0, 9); //0 red 2-8 green 9 blue
        $green = mt_rand(225, 255);
        $red = 0;
        $blue = 0;
        if ($colour == 0) {
            $red = mt_rand(0, 150);
        }
        if ($colour == 9) {
            $blue = mt_rand(0, 150);
        }
        return "$red, $green, $blue";
    }
}
