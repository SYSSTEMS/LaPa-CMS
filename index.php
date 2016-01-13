<?php

define('ROOT',$_SERVER['DOCUMENT_ROOT'].'/');

require_once ROOT . 'system/core.php';

PAGE::init();

$PAGE='<!DOCTYPE html><html lang="'.$CONF['lang'].'"><head>'.HEAD.'<link rel="stylesheet" href="/css/loader.css"></head><body onload="init();"><div id="loader"><div class="cssload-container"><div class="cssload-speeding-wheel"></div></div></div></body></html>';

exit($PAGE);