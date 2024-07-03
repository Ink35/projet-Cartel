<?php

abstract class AbstractController
{
    protected function render(array $values)  
    {  
        echo json_encode($values);  
    } 
    
}