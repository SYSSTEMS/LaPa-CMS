// LaPa JS Layer v.0.0.4

var VERSION=4;

var SYSTEM={};
var CONF={};

SYSTEM['current_page']=false;

tmpver=VERSION.toString();
LAPA=tmpver.length<3?'0.':'';
for(i in tmpver){LAPA+=(i==0?'':'.')+tmpver[i];}
delete tmpver;

window.onload=init;
window.onresize=sizing;

SYSTEM['current_page'] = location.pathname.substr(1)!=''?location.pathname.substr(1):false;

parseParams();
window.onpopstate=function(){historyNav()};

function init(){

    io({'status':'init'});
    SYSTEM['query']=location.search;
    history.replaceState(null,null,SYSTEM['current_page']||'/');
}

function sizing(){

}