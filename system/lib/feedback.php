<?php

require_once ROOT.'system/lib/db.php';
require_once ROOT.'system/lib/PHPMailer.php';

class FB{
    public static $VERSION='0.7';
    public static function add($message,$channel,$link){
        global $CONF;
        DB::insert('feedback',['text'=>check($message),'channel'=>check($channel),'link'=>check($link),'user'=>(defined('USER_ID')?USER_ID:'')]);
        $topic=mysqli_fetch_assoc(DB::select('feedback',['*'],'text="'.check($message).'" AND channel="'.check($channel).'"'));
        if(is_numeric($topic['id'])){
            $link=check($link,true);
            $link=is_numeric($link)?'Позвонить: <a href="tel:'.$link.'">'.$link.'</a>':'Ответить: <a href="mailto:'.$link.'">'.$link.'</a>';
            $text=check($channel).'<br><br>'.check($message).'<br><br>'.$link.'<br><br><hr>This message prepared by FeedBack v'.FB::$VERSION.'<br>Based on '.LAPA.'<br><a href="http://lapa.96.lt">LaPa.96.lt</a>';
            sendMail($CONF['admin.mail'],$CONF['fb.message.title'],$text);
            return $topic['id'];
        }
        return false;
    }
}