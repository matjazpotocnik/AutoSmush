<?php


namespace ImageOptimizer;


use ImageOptimizer\Exception\Exception;

class ChainOptimizer implements Optimizer
{
    /**
     * @var Optimizer[]
     */
    private $optimizers;
    private $executeFirst;

    public function __construct(array $optimizers, $executeFirst = false)
    {
        $this->optimizers = $optimizers;
        $this->executeFirst = (boolean) $executeFirst;
    }

    public function optimize($filepath)
    {
        // chain exceptions stack
        $exceptions = array();

        foreach($this->optimizers as $optimizer) {
            try {
                $optimizer->optimize($filepath);
            } catch (\Exception $e) { //MP When catching an exception inside a namespace it is important that you escape to the global space
                // remember our exception and skip current optimization method
                array_push($exceptions, $e);
                continue;
            }

            if($this->executeFirst) break;
        }

        // if we have some exceptions - throw them to save library functionality
        //MP but only if all optimizers failed
        if(count($exceptions) == count($this->optimizers)) {
        	  $msg = "";
            foreach ($exceptions as $e) $msg .= $e->getMessage() . ' ';
            throw new Exception($msg);
        }
    }
}