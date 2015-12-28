var LIB=9;

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires||9999999;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}

function dbg(text){
    window.console.log(text);
}

function parseParams () {
    var match,
        pl     = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    params = {};
    while (match = search.exec(query)) {
        params[decode(match[1])] = decode(match[2]);
    }
    return params;
}

function historyNav(){
    if(SYSTEM['current_page']!=window.history.state){
        page(window.history.state);
    }
}

function get(objID) {
    if (document.getElementById) {return document.getElementById(objID);}
    else if (document.all) {return document.all[objID];}
    else if (document.layers) {return document.layers[objID];}
}

function moduleLoad(url)
{
    var e = document.createElement("script");
    e.src = url;
    e.type="text/javascript";
    document.getElementsByTagName("head")[0].appendChild(e);
}

function pageBuild(url)
{
    var e = document.createElement("script");
    e.src = url;
    e.type="text/javascript";
    document.getElementsByTagName("body")[0].appendChild(e);
}

function io(array,callback){
    callback = callback ? callback : handler;
    query = JSON.stringify(array);
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                response = xmlhttp.responseText;
                try {
                    var jsonObject = JSON.parse(response);
                } catch (e) {
                    // handle error
                    dbg('ERROR PARSING RESPONSE FROM SERVER [' + callback.name + '] SOURCE: ' + response);
                    return false;
                }
                callback(JSON.parse(response));
            } else {
                callback();
                //return false;
            }
        }
    }
    xmlhttp.open('GET', ('http://'+location.host+'/ajax.php?query=' + query + '&ver=' + SYSTEM['modules']['lib'] + (CONF['token']?'&token='+CONF['token']:'') + '&rand=' + new Date().getTime()), true);
    xmlhttp.send();
}

/*function page(id) {
    if (PAGE[id]) {
        document.title=PAGE[id]['title']+' | '+CONF['site.title'];
        document.body.innerHTML = PAGE[id]['body'];
        for(i in PAGE[id]['dependency']){
            module(PAGE[id]['dependency'][i]);
        }
        eval(PAGE[id]['build']);
    } else {
        io({'page': id}, pageLoaded);
    }
}*/

function page(id) {
    if (PAGE[id]) {
        if ((SYSTEM['preloading'] == false) || SYSTEM['preloading'] == id) {
            dependency = true;
            for (i in PAGE[id]['dependency']) {
                //module();
                module = PAGE[id]['dependency'][i];
                if (SYSTEM['modules'][module]) {
                } else {
                    dependency = false;
                    //io({'module': module}, moduleLoaded); // TODO upgade for multiversion support
                    moduleLoad('/system/pages/modules/'+module+'.js');
                }
            }
            if (dependency == true) {
                SYSTEM['preloading'] = false;
                document.title = PAGE[id]['title'] + ' | ' + CONF['site.title'];
                document.body.innerHTML = PAGE[id]['body'];
                //pageBuild('/system/pages/'+id+'.js');
                eval(PAGE[id]['build']);
            } else {
                SYSTEM['preloading'] = id;
            }
        }
    } else {
        io({'page': id}, pageLoaded);
    }
}

function pageLoaded(response) {
    if (response['page']) {
        item = response['page'];
        PAGE[item['id']] = item;
        page(item['id']);
    }
}

function moduleLoaded(response){
    if(response['module']){
        eval(response['module']);
    }
}

function exec(module,version){
    if(module&&version){
        SYSTEM['modules'][module]=version;
    }
    load=true;
    for(i in PAGE[SYSTEM['preloading']]['dependency']){
        if(SYSTEM['modules'][PAGE[SYSTEM['preloading']]['dependency'][i]]){
        }else{
            load=false;
            break;
        }
    }
    if(load==true) {
        page(SYSTEM['preloading']);
    }
}

function loader(state){
    if(state=='show'){
        get('loader').innerHTML='<div class="cssload-container"><div class="cssload-speeding-wheel"></div></div>';
    }else if(state=='hide'){
        get('loader').innerHTML='';
    }
}