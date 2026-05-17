<?php

namespace App\Game\Service;

class GoodService
{
	private $goods;

    public function __construct(array $goods)
    {
    	$this->goods = $goods;
    }

    /**
     * Random goods prices.
     */
    public function randomGoodsPrices($cities): array
    {
        foreach ($this->goods as $key => $value) {
            $this->goods[$key] = trim($value);
        }

        foreach ($cities as $key => $city) {
            foreach ($this->goods as $goodKey => $good) {
                $cities[$key]['goods'][] = [
                    'name' => $good,
                    'price' => mt_rand(1, 100),
                ];
            }
        }
        return $cities;
    }
}
