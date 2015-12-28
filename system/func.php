<?php

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