// LaPa JS Layer v.0.0.5

var CORE=6;

var SYSTEM={};
var CONF={};
var PAGE={};

SYSTEM['modules']={};
SYSTEM['preloading']=false;

//SYSTEM['current_page']=false;

SYSTEM['initialized']=false;

function version (ver){
    ver=ver.toString();
    tmpver=ver.length<3?'0.':'';
    for(i in ver){tmpver+=(i==0?'':'.')+ver[i];}
    return tmpver;
}

window.onload=init;
window.onresize=sizing;

//SYSTEM['current_page'] = location.pathname.substr(1)!=''?location.pathname.substr(1):false;

SYSTEM['GET_PARAM']=parseParams();
//window.onpopstate=function(){historyNav()};

function init(response) {
    if (response) {
        if(response['init']){
            //CONF['uid']=response['init']['uid'];
            //CONF['pid']=response['init']['pid'];
            //CONF['profile']=response['init']['profile'];
            for(i in response['init']){
                CONF[i]=response['init'][i];
            }
            page(CONF['pid']);
        }
    } else {
        SYSTEM['modules'] = {'core': CORE, 'lib': LIB};
        //CONF['site.title']=document.title;
        io({'status': 'init'},init);
        //SYSTEM['query']=location.search;
        //history.replaceState(null,null,SYSTEM['current_page']||'/');
    }
}

function sizing(){

}