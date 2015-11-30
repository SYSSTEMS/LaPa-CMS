<?php

define('ROOT',$_SERVER['DOCUMENT_ROOT'].'/');

require_once ROOT . 'system/core.php';

if(!isset($_GET['query'])OR!isset($_GET['ver'])){
    exit;
}

$QUERY=json_decode($_GET['query']); // Запрос
$QUERY=objectToArray($QUERY); // Трансформируем из Object в Array
$RESPONSE=array();

if($_GET['ver']<VERSION){
    $RESPONSE['old_version']=true;
    exit(json_encode($RESPONSE));
}

echo(json_encode($RESPONSE));