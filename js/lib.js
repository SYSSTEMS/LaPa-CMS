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

    SYSTEM['GET_PARAM'] = {};
    while (match = search.exec(query))
        SYSTEM['GET_PARAM'][decode(match[1])] = decode(match[2]);
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
            }
        }
    }
    xmlhttp.open('GET', ('http://'+location.host+'/ajax.php?query=' + query + '&ver=' + VERSION + (CONF['token']?'&token='+CONF['token']:'') + '&rand=' + new Date().getTime()), true);
    xmlhttp.send();
}

function page(id){
    if($PAGE[id]){
        document.body.innerHTML=$PAGE[id]['body'];
        eval($PAGE[id]['build']);
    }else{
        if(id=='index'){
            dbg('Page load loop! Index not Registred!');
        }else {
            page('index');
        }
    }
}