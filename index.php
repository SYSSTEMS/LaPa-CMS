<?php

define('ROOT',$_SERVER['DOCUMENT_ROOT'].'/');

require_once ROOT . 'system/core.php';

$link = explode('/', $_SERVER['REQUEST_URI']);
$page = 'index';
if (!empty($link[1])) {
    // Case for pages
    define('PAGE', strtolower($page));
}

$js_dir = scandir(ROOT.'js');
$scripts='';
for ($i = 2; $i < count($js_dir); $i++){
    $tjs=explode('.', $js_dir[$i]);
    if(isset($tjs[count($js_dir[$i])])) {
        if ($tjs[count($js_dir[$i])] == 'js') {
            $scripts .= '<script src="/js/' . $js_dir[$i] . '"></script>';
        }
    }
}
/*
for ($i=0; $i<count($SYSTEM['LIB']);$i++){
    $scripts .= '<script src="/system/lib/' . $js_dir[$i] . '"></script>';
}*/
define('HEAD','<title>'.$CONF['site.title'].'</title><meta charset="utf-8" />'.$scripts);

$PAGE='<!DOCTYPE html><html lang="'.$CONF['lang'].'"><head>'.HEAD.'</head><body></body></html>';

echo $PAGE;