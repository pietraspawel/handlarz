<?php

namespace App\Game;

class UIService {

    /**
     * Calculate city name position depends on city position.
     */
    public static function calculateCityNamePosition(&$config)
    {
        foreach ($config['world']['cities'] as $key => $city) {
            $dx = 0;
            $dy = 0;
            $anchor = 'middle';
            if ($city['position']['x'] >= $config['world']['xSize'] - 2) {
                $dx = 20;
                $anchor = 'end';
            }
            if ($city['position']['x'] <= 3) {
                $dx = -20;
                $anchor = 'start';
            }
            if ($city['position']['y'] >= $config['world']['ySize']) {
                $dy = -20 - 34;
            }
            $config['world']['cities'][$key]['name_position'] = [
                'dx' => $dx,
                'dy' => $dy,
                'anchor' => $anchor,
            ];
        }
    }
}
