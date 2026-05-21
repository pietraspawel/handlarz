<?php

namespace App\Service;

class FormatterService
{
    public function formatGold(int $gold): string
    {
        if ($gold < 1_000_000) {
            return number_format($gold, 0, ',', ' ');
        }

        if ($gold < 1_000_000_000) {
            $value = floor(($gold / 1_000_000) * 1000) / 1000;
            return str_replace('.', ',', number_format($value, 3, '.', '')) . 'mln';
        }

        if ($gold < 1_000_000_000_000) {
            $value = floor(($gold / 1_000_000_000) * 1000) / 1000;
            return str_replace('.', ',', number_format($value, 3, '.', '')) . 'mld';
        }

        $value = floor(($gold / 1_000_000_000_000) * 1000) / 1000;
        return str_replace('.', ',', number_format($value, 3, '.', '')) . 'bln';
    }
}
