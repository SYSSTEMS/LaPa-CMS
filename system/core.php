<?php

// LaPa CMS
// v.0.0.4.1115

header("HTTP/1.0 200 OK");
header("Access-Control-Allow-Origin: *");

define('VERSION',4);
define('BUILD',1115);
define('LAPA','LaPa v.0.0.4.1115');

function objectToArray($d){
    if (is_object($d)) {
        $d = get_object_vars($d);
    }
    if (is_array($d)) {
        return array_map(__FUNCTION__, $d);
    } else {
        return $d;
    }
}

function dbg($text){
    //if (!defined('USER_ID')||USER_ID == 1) {
    $text = $text . '
';
    $old = file(ROOT . 'errlog.txt')||array('');
    if ($old && $old[count($old) - 1] == $text) {
        return true;
    }
    $file = fopen(ROOT . 'errlog.txt', 'a');
    fwrite($file, $text);
    fclose($file);
    //}
}

function dbg_clean(){
    $file = fopen(ROOT . 'errlog.txt', 'w');
    fclose($file);
    dbg('');
}

dbg_clean();

function check($string,$cls_probels=false){ // Функция обработки принятых данных
    // $cls_probels устанавливает разрешение на очистку строки от пробелов
    $string=stripslashes($string);
    $string=htmlspecialchars($string);
    $string=$cls_probels==true?trim($string):$string;
    return $string;
}

function genHash($isNum=false){
    $chars = $isNum?'1234567890':'abdefhiknrstyzABDEFGHKNQRSTYZ23456789';
    $numChars = strlen($chars);
    $string = '';
    $length=$isNum?8:rand(8,16);
    for ($i = 0; $i < $length; $i++) {
        $string .= substr($chars, rand(1, $numChars) - 1, 1);
    }
    return $isNum?$string:md5($string);
}

function getIspByIp($ip){
    $json = file_get_contents("http://ipinfo.io/{$ip}/json");
    $details = objectToArray(json_decode($json));
    //$isp=explode(' ',$details['org']);
    //return $isp[count($isp)-1];
    return $details['org'];
}

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

$CONF=mysqli_fetch_assoc(DB::select('config',['*']));

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
define('HEAD','<title>'.$CONF['site.title'].'</title><meta charset="utf-8" />'.$scripts);