<?php

require_once ROOT.'system/lib/db.php';

class USER {
    public static $VERSION=9;
    public static function init(){
        if(isset($_COOKIE['token'])){
            $id=mysqli_fetch_assoc(DB::select('atoken',['*'],'hash="'.check($_COOKIE['token'],true).'"'));
            if(is_numeric($id['id'])){
                $user=mysqli_fetch_assoc(DB::select('user',['*'],'id='.$id['id']));
                define('USER_ID',$user['id']);
            }else{
                USER::logout();
            }
        }
    }
    public static function auth($login,$password){
        $user=mysqli_fetch_assoc(DB::select('user',['*'],'mail="'.strtolower(check($login,true)).'" AND password="'.md5(strtolower(check($password,true))).'"'));
        if(is_numeric($user['id'])){
            $token=genHash();
            DB::insert('atoken',['hash'=>$token,'id'=>$user['id']]);
            setcookie('token',$token);
            define('USER_TOKEN',$token);
            define('USER_ID',$user['id']);
            return USER_ID;
        }
        return false;
    }
    public static function reg($mail,$password,$firstname,$lastname){
        $password=md5(strtolower(check($password,true)));
        $mail=strtolower(check($mail,true));
        DB::insert('user',['mail'=>$mail,'password'=>$password,'firstname'=>check($firstname,true),'lastname'=>check($lastname,true)]);
        $user=mysqli_fetch_assoc(DB::select('user',['*'],'mail="'.$mail.'" AND password="'.$password.'"'));
        //if(isset($user['id'])){
            if(is_numeric($user['id'])){
                $token=md5(time());
                DB::insert('atoken',['hash'=>$token,'id'=>$user['id']]);
                setcookie('token',$token);
                define('USER_TOKEN',$token);
                define('USER_ID',$user['id']);
                return USER_ID;
            }
        //}
        return false;
    }
    public static function logout(){
        if(DB::delete('atoken','hash="'.$_COOKIE['token'].'"')){
            unset($_COOKIE['token']);
            return true;
        }
        return false;
    }
}

USER::init();