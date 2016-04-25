
new eHtml('googleauth_confirm','<div class="mk_description"></div>\
<div class="gau_cont">\
    <div class="gau_img"><img src="about:blank" /></div>\
    <div class="gau_data"></div>\
    <div class="submit asBtn"><span><p></p></span></div>\
</div>',{
    'img':'img',
    '.gau_data':'container',
    '.submit':'confirm',
    'p':'confirm_str'
});


new eView('googleauth_confirm', {
    create: f() { return HTML.googleauth_confirm(cr('div')); },
    init: f(self, obj) {
        self.V.img.src = obj.qrsrc;
        
        var inp = {
            name: VIEW.input_text(),
            secret: VIEW.input_text(),
            code: VIEW.input_text()
        }
        self.V.container.attach(inp.name);
        self.V.container.attach(inp.secret);
        self.V.container.attach(inp.code);
        
        inp.name.V.input.val = obj.title;
        inp.name.V.input.attr('disabled', 'true');
        inp.name.label = PAGE.ld('Username');
        inp.secret.V.input.val = obj.token;
        inp.secret.V.input.attr('disabled', 'true');
        inp.secret.label = PAGE.ld('Secret key 16 digits');
        inp.code.label = PAGE.ld('Code 6 digits');
        
        
        self.V.confirm_str.val = PAGE.ld('Confirm');
        
        self.V.confirm.clickOn = f(ev) {
            if ( VALIDATOR.notEmpty(inp.code.V.input) ) {
                
                
                ORM.req(obj._oid+':confirm', {
                    code: inp.code.V.input.val
                }, f(resp) {
                    if ( resp.exception == 'ReqExcept' ) {
                        SYS.alert(PAGE.ld('Wrong code'), 'center orange');
                    } else {
                        EVENT.emit('updateGoogleAuthList');
                        delete obj.qrsrc;
                        delete obj.token;
                        self.val = '';
                    }
                });
            }
        }
        
        clearEvents(self.V.confirm).onclick = f(ev) {
            ev.preventDefault();
            self.V.confirm.clickOn();
            return false;
        };
        inp.code.V.input.onkeyup = f(ev) {
            if ( ev.keyCode == 13 ) {
                self.V.confirm.clickOn(ev);
            }
        }
        
    }
});




new eHtml('googleauth_item','<div></div><div></div><div></div>',{
    div: 'key,date,close'
});


new eView('googleauth_item', {
    create: f() { return HTML.googleauth_item(cr('div','gau_item')); },
    init: f(self, obj) {
        self.V.key.val = obj.title;
        var mDelBtn = self.V.close.cr('div', 'block-hide asBtn').VAL(PAGE.ld('Delete account'));
        var dDelBtn = self.V.close.cr('div', 'asBtn cbtn');
        SVG.close(dDelBtn);
        
        dDelBtn.onclick = mDelBtn.onclick = f() {
            SYS.confirm(PAGE.ld('Are you sure you want to delete this account')+'?', 'center', f() {
                ORM.req(obj._oid+':delete', f() {
                    EVENT.emit('updateGoogleAuthList');
                });
            });
        }
    }
});



new eHtml('googleauth', '<div class="gau_header">\
<div class="txt"></div>\
<div class="inp-block">\
    <div class="asBtn"></div>\
    <div class="inp"><input type="text"></div>\
</div>\
</div><div class="mk_infoplaceholder"></div><div class="gau_details"></div><div class="txt"></div><div class="gau_body"></div>', {
    '.txt'         : 'str_username,str_list',
    '.asBtn'       : 'btn_username',
    'input'        : 'inp_username',
    '.gau_header'  : 'header',
    '.gau_details' : 'details',
    '.gau_body'    : 'body',
    '.mk_infoplaceholder':'infoph'
});

new eView('googleauth', {
    create: f() { return HTML.googleauth(cr('div', 'google-auth-block')); },
    init: f(self) {
        
        if ( !PAGE.user ) { return 0; }
        
        self.V.str_username.val = PAGE.ld('Enter username') + ':';
        self.V.btn_username.val = PAGE.ld('Add');
        self.V.str_list.val = PAGE.ld('Connected users');
        
        
        self.V.btn_username.onclick = f() {
            if ( VALIDATOR.notEmpty(self.V.inp_username) ) {
                ORM.req('googleauth:insert', {
                    title: self.V.inp_username.val
                }, f(list) {
                    if ( list.length && list.length > 0 ) {
                        self.V.details.val = '';
                        self.V.details.attach(VIEW.googleauth_confirm(list[0]));
                    }
                });
            }
        }
        
    }
});










