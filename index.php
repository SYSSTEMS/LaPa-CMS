<?php

define('ROOT',$_SERVER['DOCUMENT_ROOT'].'/');

require_once ROOT . 'system/core.php';

PAGE::init();

$PAGE='<!DOCTYPE html><html lang="'.$CONF['lang'].'"><head><meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />'.HEAD.'<link rel="stylesheet" href="/css/loader.css"></head><body onload="init();"><div id="page"></div>
<div id="loader-wrapper"><div id="loader"></div><div class="loader-section section-left"></div><div class="loader-section section-right"></div></div>
</body></html>';

exit($PAGE);