
SYS.auth2step = {};


SYS.auth2step.get2authParse = f(resp, rewrites, done) {
    if ( okeys(resp).length == 0 ) {
        var node = cr('div');
        node.cr('h4').VAL(PAGE.ld('Please, enter code'));
        var inp = VIEW.input_text();
        node.attach(inp);
        inp.label = 'Code';
        
        var on_confirm = f() {
            rewrites.auth2 = { code: inp.val };
            done();
        }
        
        var popView = SYS.confirm(node, 'center', on_confirm);
        inp.V.input.onkeyup = f(ev) {
            if ( ev.keyCode == 13 ) {
                on_confirm();
                popView._close();
            }
        }
        
    } else if ( def(resp.g_acc) ) {
        var node = cr('div');
        node.cr('h4').VAL(PAGE.ld('Google'));
        var dd  = cr.dropdown(resp.g_acc, null, node, {
            defValue: true
        });
        var inp = VIEW.input_text();
        node.attach(inp);
        inp.label = 'Code';
        
        var on_confirm = f() {
            rewrites.auth2 = {
                title: resp.g_acc[dd.val],
                code: inp.val
            }
            done();
        }
        
        var popView = SYS.confirm(node, 'center', on_confirm);
        inp.V.input.onkeyup = f(ev) {
            if ( ev.keyCode == 13 ) {
                on_confirm();
                popView._close();
            }
        }
        
    } else {
        done();
    }
    //-log('resp', resp);
}


SYS.auth2step.writer = f(done, data) {
    var adrMap = data[1].split(':');
    var model  = adrMap[0].split('_')[0];
    var method = adrMap[1];
    
    var rewrites;
    data[5] = data[5] || {};
    rewrites = data[5];
    
    if ( PAGE.userData.auth2stepOn && PAGE.userData.auth2stepOn[model] && PAGE.userData.auth2stepOn[model].contains(method) ) {
        SYS.auth2step.get2auth(rewrites, done);
    } else {
        done();
    }
    
};

SYS.auth2step.get2auth = f(rewrites, todo) {
    PROTOCOL.auth.write(':get2auth', f(list, resp) {
        SYS.auth2step.get2authParse(resp, rewrites, todo);
    });
}

SYS.auth2step.reader = f(done, data) {
    data = parseObj(data[1]);
    
    if ( def(data.statusData) && data.statusData.exception == 'ReqExcept' && data.statusData.field == 'code' ) {
        SYS.alert(PAGE.ld('Wrong code'), 'center red', done);
    } else {
        done();
    }
}
