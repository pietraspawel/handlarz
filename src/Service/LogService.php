<?php

declare(strict_types=1);

namespace App\Service;

use App\Service\GameService;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LogService
{
    private $projectDir;

    public function __construct(ContainerInterface $container)
    {
        $this->projectDir = $container->getParameter('kernel.project_dir');
    }

    public function save(string $mapName, array $gameLog): string
    {
        $directory = $this->projectDir . GameService::LOG_PATH;

        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }
        $fileName = sprintf('%s_%s.log', $this->sanitizeFileName($mapName), date('Y-m-d_H-i-s'));
        $path = $directory . $fileName;
        file_put_contents($path, $this->render($gameLog));

        $fileName =  str_replace('.log', '.json', $fileName);
        $path = $directory . $fileName;
        file_put_contents($path, json_encode($gameLog, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $path;
    }

    private function render(array $gameLog): string
    {
        $output = [];

        foreach ($gameLog['turnsLogs'] ?? [] as $turnLog) {
            $output[] = sprintf('%d.', $turnLog['number']);

            foreach ($turnLog['tradersLogs'] ?? [] as $traderLog) {
                $snapshot = $traderLog['snapshot'] ?? null;
                if ($snapshot === null) {
                    continue;
                }
                $output[] = sprintf('  %s:', $snapshot['name']);
                $line = sprintf('    %d;%d', $snapshot['position']['x'], $snapshot['position']['y']);
                if (!empty($snapshot['cityName'])) {
                    $line .= sprintf(';%s', $snapshot['cityName']);
                }

                foreach ($snapshot['goods'] ?? [] as $good) {
                    $line .= sprintf(' %s:%d', $good['name'], $good['quantity']);
                }
                $line .= sprintf(' %dgold', $snapshot['gold']);
                $output[] = $line;

                foreach ($traderLog['actions'] ?? [] as $action) {
                    $output[] = '    ' . $this->renderAction($action);
                }
            }
            $output[] = '';
        }

        return implode(PHP_EOL, $output);
    }

    private function renderAction(array $action): string
    {
        $result = $action['result'] ?? [];

        switch ($action['type']) {
            case 'buy':
                return sprintf('zakupił: %s %d', $result['name'], $result['amount']);

            case 'sell':
                return sprintf('sprzedał: %s %d', $result['name'], $result['amount']);

            default:
                return $action['type'];
        }
    }

    private function sanitizeFileName(string $name): string
    {
        return preg_replace('/[^a-z0-9_-]/i', '_', $name);
    }
}
