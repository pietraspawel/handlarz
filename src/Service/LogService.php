<?php

declare(strict_types=1);

namespace App\Service;

use App\Service\GameService;

class LogService
{
    public function save(string $mapName, array $gameLog, GameService $gameService): string
    {
        $directory = __DIR__ . GameService::LOG_PATH;
        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $fileName = sprintf('%s_%s.log', $this->sanitizeFileName($mapName), date('Y-m-d_H-i-s'));
        $path = $directory . '/' . $fileName;

        file_put_contents($path, $this->render($gameLog));
        return $path;
    }

    private function render(array $gameLog): string
    {
        $output = [];
        foreach ($gameLog['turns'] ?? [] as $turn) {
            $output[] = sprintf('%d.', $turn['number']);
            foreach ($turn['playerLogs'] ?? [] as $playerLog) {
                $output[] = sprintf('  %s:', $playerLog['name']);
                $line = sprintf('    %d;%d', $playerLog['x'], $playerLog['y']);

                if (!empty($playerLog['city'])) {
                    $line .= ';(' . $playerLog['city'] . ')';
                }

                foreach ($playerLog['goods'] ?? [] as $goodName => $amount) {
                    $line .= sprintf(' %s:%d', $goodName, $amount);
                }

                $line .= sprintf(' %dgold', $playerLog['gold']);

                $output[] = $line;

                foreach ($playerLog['actions'] ?? [] as $action) {
                    $output[] = sprintf('    %s', $action);
                }
            }

            $output[] = '';
        }

        return implode(PHP_EOL, $output);
    }

    private function sanitizeFileName(string $name): string
    {
        return preg_replace('/[^a-z0-9_-]/i', '_', $name);
    }
}
