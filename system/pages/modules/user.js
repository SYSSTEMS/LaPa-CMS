function userblock_gen() {
    if (CONF['uid'] != false) {
        get('user').innerHTML = '<p>' + CONF['profile']['firstname'] + ' ' + CONF['profile']['lastname'] + '</p><br>' +
            '<button onclick="logout()">Выход</button><div id="loader"></div>';
    } else {
        get('user').innerHTML = '<label for="email">Email</label> <input id="email" type="email"><br>' +
            '<label for="password">Пароль</label> <input id="password" type="password"><br>' +
            '<button onclick="logon()">Вход</button> <button onclick="page(\'registration\')">Зарегистрироваться</button><div id="loader"></div>';
    }
}

function logon(response) {
    if (response) {
        if (response['auth']) {
            CONF['uid'] = response['auth'];
            CONF['profile'] = response['profile'];
            CONF['token'] = response['token'];
            userblock_gen();
        } else {
            get('email').value = '';
            get('password').value = '';
            alert('Неверная пара Email/Пароль');
        }
        loader('hide');
    } else {
        mail = get('email').value;
        password = get('password').value;
        if (mail != '' && password != '') {
            loader('show');
            io({'auth': {'mail': mail, 'password': password}}, logon);
        }
    }
}
function logout(response){
    if(response){
        if(response['logout']){
            CONF['uid']=false;
            CONF['profile']=false;
            CONF['token'] = false;
            page('index');
        }
        loader('hide');
    }else{
        loader('show');
        if(CONF['uid']!=false){
            io({'logout':true},logout);
        }else{
            userblock_gen();
        }
    }
}

function registration(response) {
    if (response) {
        if(response['reg']){
            CONF['uid'] = response['reg'];
            CONF['profile'] = response['profile'];
            CONF['token'] = response['token'];
            page('index');
        }
        loader('hide');
    } else {
        mail = get('email_reg').value;
        password = get('password_reg').value;
        firstname = get('firstname').value;
        lastname = get('lastname').value;
        //patronymic = get('patronymic').value;
        if (mail != '' && password != '' && firstname != '' && lastname != '') {
            // TODO Check all fields
            loader('show');
            io({
                'reg': {
                    'mail': mail,
                    'password': password,
                    'firstname': firstname,
                    'lastname': lastname,
                    //'patronymic': patronymic
                }
            }, registration);
        }else{
            alert('Необходимо заполнить все поля');
        }
    }
}
exec('user',3);