var LIB=11;

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
        if((id!=CONF['pid'])||SYSTEM['initialized']==false) {
            if ((SYSTEM['preloading'] == false) || SYSTEM['preloading'] == id) {
                dependency = true;
                loader('show');
                if (PAGE[id]['dependency']) {
                    for (i in PAGE[id]['dependency']) {
                        //module();
                        module = PAGE[id]['dependency'][i];
                        if (SYSTEM['modules'][module]) {
                        } else {
                            dependency = false;
                            //io({'module': module}, moduleLoaded); // TODO upgade for multiversion support
                            moduleLoad('/system/pages/modules/' + module + '.js');
                        }
                    }
                }
                if (PAGE[id]['template']) {
                    if (PAGE[id]['template']['js']) {
                        if (document.getElementById('template_js')) {
                            document.head.removeChild(document.getElementById('template_js'));
                        }
                        var js_head = document.createElement("script");
                        js_head.setAttribute("type", "text/javascript");
                        js_head.setAttribute("id", "template_js");
                        js_head.setAttribute("src", PAGE[id]['template']['js']);
                        document.getElementsByTagName("head")[0].appendChild(js_head);
                    }
                    if (PAGE[id]['template']['css']) {
                        if (document.getElementById('template_css')) {
                            document.head.removeChild(document.getElementById('template_css'));
                        }
                        var css_head = document.createElement("link");
                        css_head.setAttribute("type", "text/css");
                        css_head.setAttribute("rel", "stylesheet");
                        css_head.setAttribute("id", "template_css");
                        css_head.setAttribute("href", PAGE[id]['template']['css']);
                        document.getElementsByTagName("head")[0].appendChild(css_head);
                    }
                }
                if (dependency == true) {
                    SYSTEM['preloading'] = false;
                    document.title = PAGE[id]['title'] + ' | ' + CONF['site.title'];
                    if (document.getElementById('css_link')) {
                        document.head.removeChild(document.getElementById('css_link'));
                    }
                    if (PAGE[id]['css']) {
                        var fileref = document.createElement("link");
                        fileref.setAttribute("rel", "stylesheet");
                        fileref.setAttribute("type", "text/css");
                        fileref.setAttribute("id", "css_link");
                        fileref.setAttribute("href", PAGE[id]['css']);
                        document.getElementsByTagName("head")[0].appendChild(fileref);
                    }
                    document.getElementById('page').innerHTML = PAGE[id]['body'];
                    if(PAGE[id]['header']&&document.getElementById('header')) {
                        document.getElementById('header').innerHTML = PAGE[id]['header'];
                    }
                    if(PAGE[id]['footer']&&document.getElementById('footer')) {
                        document.getElementById('footer').innerHTML = PAGE[id]['footer'];
                    }
                    //pageBuild('/system/pages/'+id+'.js');
                    eval(PAGE[id]['build']);
                    if (PAGE[id]['postloads']) {
                        for (i in PAGE[id]['postloads']) {
                            var js_page = document.createElement("script");
                            js_page.setAttribute("type", "text/javascript");
                            //js_page.setAttribute("id", "js");
                            js_page.setAttribute("src", PAGE[id]['postloads'][i]);
                            document.getElementById('page').appendChild(js_page);
                        }
                    }
                    loader('hide');
                    SYSTEM['initialized'] = true;
                    CONF['pid']=id;
                } else {
                    SYSTEM['preloading'] = id;
                }
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
        document.body.classList.remove('loaded');
        //get('loader').innerHTML='<div class="cssload-container"><div class="cssload-speeding-wheel"></div></div>';
    }else if(state=='hide'){
        document.body.classList.add('loaded');
        //get('loader').innerHTML='';
    }
}