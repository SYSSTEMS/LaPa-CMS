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
if(class_exists('USER')) {
    //if(USER::$VERSION>=9){
    if (isset($QUERY['reg'])) {
        $reg = $QUERY['reg'];
        $RESPONSE['reg'] = USER::reg($reg['mail'], $reg['password'], $reg['firstname'], $reg['lastname']);
        if (defined('USER_ID')) {
            $user = mysqli_fetch_assoc(DB::select('user', ['*'], 'id="' . USER_ID.'"'));
            $RESPONSE['profile'] = ['firstname' => $user['firstname'], 'lastname' => $user['lastname'], 'pic' => $user['pic']];
            $RESPONSE['token']=USER_TOKEN;
        }
    }
    if (isset($QUERY['auth'])) {
        $auth = $QUERY['auth'];
        $RESPONSE['auth'] = USER::auth($auth['mail'], $auth['password']);
        if (defined('USER_ID')) {
            $user = mysqli_fetch_assoc(DB::select('user', ['*'], 'id=' . USER_ID));
            $RESPONSE['profile'] = ['firstname' => $user['firstname'], 'lastname' => $user['lastname'], 'pic' => $user['pic']];
            $RESPONSE['token']=USER_TOKEN;
        }
    }
    if(isset($QUERY['logout'])){
        $RESPONSE['logout'] = USER::logout();
    }
    //}
}

if(isset($QUERY['status'])) {
    if($QUERY['status']=='init') {
        $RESPONSE['init']=$CONF;
        $RESPONSE['init']['uid']=defined('USER_ID') ? USER_ID : false;
        $RESPONSE['init']['pid']=defined('PAGE') ? PAGE : 'index';
        if (defined('USER_ID')) {
            $user = mysqli_fetch_assoc(DB::select('user', ['*'], 'id=' . USER_ID));
            $RESPONSE['init']['profile'] = ['firstname' => $user['firstname'], 'lastname' => $user['lastname'], 'pic' => $user['pic']];
            $RESPONSE['init']['token']=$_COOKIE['token'];
        }
    }
}
if(isset($QUERY['page'])){
    $RESPONSE['page']=PAGE::load($QUERY['page']);
}
if(isset($QUERY['module'])){
    $RESPONSE['module']=PAGE::module($QUERY['module']);
}

echo(json_encode($RESPONSE));