<?php

require_once ROOT.'system/lib/db.php';

class PAGE {
    public static function init(){
        global $CONF;
        $link = explode('/', $_SERVER['REQUEST_URI']);
        $page = 'index';
        if (!empty($link[1])) {
            // Case for pages
            define('PAGE', strtolower($page));
        }
        $scripts=PAGE::requireJs();
        define('HEAD','<title>'.$CONF['site.title'].'</title><meta charset="utf-8" />'.$scripts);
    }
    public static function requireJs(){
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
        return $scripts;
    }
    public static function load($id){
        $path = ROOT . 'system/pages/' . $id . '.php';
        $PAGE = false;
        if (file_exists($path)) {
            require_once $path;
            return $PAGE;
        } else {
            $page = DB::select('page', ['*'], 'id="' . $id . '"');
            if ($page) {
                return mysqli_fetch_assoc($page);
            }
        }
        return false;
    }
    public static function module($id){
        $path=ROOT.'system/pages/modules/'.$id.'.js';
        $module = false;
        if(file_exists($path)){
            return file_get_contents($path);
        }
        return false;
    }
}