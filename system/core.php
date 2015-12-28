<?php

// LaPa CMS
// v.0.0.6.1215

header("HTTP/1.0 200 OK");
header("Access-Control-Allow-Origin: *");

define('VERSION',6);
define('BUILD',1215);
define('LAPA','LaPa v.0.0.6.1215');

require_once ROOT.'system/func.php';

//dbg_clean();

$cfg_dir = scandir(ROOT . 'system/conf');
for ($i = 2; $i < count($cfg_dir); $i++) {
    if (explode('.', $cfg_dir[$i])[count($cfg_dir[$i]) + 1] == 'php') {
        require_once(ROOT . 'system/config/' . $cfg_dir[$i]);
    }
}

$class_dir = scandir(ROOT . 'system/lib');
for ($i = 2; $i < count($class_dir); $i++) {
    if (explode('.', $class_dir[$i])[count($class_dir[$i])] == 'php') {
        require_once(ROOT . 'system/lib/' . $class_dir[$i]);
    }
}

$CONF=[];
$configs=DB::select('config',['*']);
while ($param = mysqli_fetch_assoc($configs)) {
    $CONF[$param['key']]=$param['value'];
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
define('HEAD','<title>'.$CONF['site.title'].'</title><meta charset="utf-8" />'.$scripts);