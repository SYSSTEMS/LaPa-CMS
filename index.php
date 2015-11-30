<?php

define('ROOT',$_SERVER['DOCUMENT_ROOT'].'/');

require_once ROOT . 'system/core.php';

$PAGE='<!DOCTYPE html><html lang="'.$CONF['lang'].'"><head>'.HEAD.'</head><body></body></html>';

echo $PAGE;