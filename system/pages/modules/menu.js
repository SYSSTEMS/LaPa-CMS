function top_menu(){
    get('top_menu').innerHTML='<button onclick="page(\'index\');">Главная</button><div id="user"></div>';
    userblock_gen();
}
exec('menu',1);