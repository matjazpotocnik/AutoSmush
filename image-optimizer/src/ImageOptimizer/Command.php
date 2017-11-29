<?php


namespace ImageOptimizer;


use ImageOptimizer\Exception\CommandNotFound;
use ImageOptimizer\Exception\Exception;

final class Command
{
    private $cmd;
    private $args = array();

    public function __construct($bin, array $args = array())
    {
        $this->cmd = $bin;
        $this->args = $args;
    }

    public function execute(array $customArgs = array())
    {
        $isWindowsPlatform = defined('PHP_WINDOWS_VERSION_BUILD');

        if(!is_executable($this->cmd)) {
            $ext = strtolower(pathinfo($this->cmd, PATHINFO_EXTENSION));
            if($isWindowsPlatform && $ext == 'bat') {
                $this->cmd = "cmd /c " . $this->cmd;
            }
            else throw new CommandNotFound(sprintf('Optimizer "%s" not found.', $this->cmd));
        }

        $args = array_merge($this->args, $customArgs);

        if($isWindowsPlatform) {
            $suppressOutput = '';
            $escapeShellCmd = 'escapeshellarg';
        } else {
            //$suppressOutput = ' 1> /dev/null 2> /dev/null';
            $suppressOutput = ' 2>&1';
            $escapeShellCmd = 'escapeshellcmd';
        }

        //$command = $escapeShellCmd($this->cmd).' '.implode(' ', array_map($escapeShellCmd, $args)).$suppressOutput;
        $commandArgs = 0 === count($args) ? '' : ' '.implode(' ', array_map($escapeShellCmd, $args));
        $command = $escapeShellCmd($this->cmd).$commandArgs.$suppressOutput;

        exec($command, $output, $result);

        if($result == 127) {
            throw new CommandNotFound(sprintf('Command "%s" not found.', $command));
        } else if($result != 0) {
            throw new Exception(sprintf('Command failed, return code: %d, command: %s', $result, $command));
        }
    }
}
