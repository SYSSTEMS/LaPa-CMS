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

if(defined('USER_ID')){
    $RESPONSE['user_id']=USER_ID;
}
if(class_exists('USER')){
    //if(USER::$VERSION>=9){
        if(isset($QUERY['reg'])){
            $reg=$QUERY['reg'];
            $RESPONSE['reg']=USER::reg($reg['mail'],$reg['password'],$reg['firstname'],$reg['lastname']);
        }
        if(isset($QUERY['auth'])){
            $auth=$QUERY['auth'];
            $RESPONSE['auth']=USER::auth($auth['mail'],$auth['password']);
        }
    //}
}
if(isset($QUERY['page'])){
    $page=DB::select('page',['*'],'id="'.$QUERY['page'].'"');
    if($page){
        $RESPONSE['page']=mysqli_fetch_assoc($page);
    }else{
        $RESPONSE['page']=false;
    }
}

echo(json_encode($RESPONSE));