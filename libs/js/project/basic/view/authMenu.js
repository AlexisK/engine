
new eHtml('auth-login', '<h1>Account SignIn</h1>\
<input type="email" placeholder="e-mail">\
<input type="password" placeholder="password">\
<div class="conditions-checkbox checked"><span>remember password</span></div>\
<a href="" class="noHref button">\
    <div class="all-news big-button"><span>SignIn</span></div>\
</a>\
<a href="" class="right noHref blue">\
    <span>SignUp</span>\
</a>\
<a href="" class="left noHref blue">Forgot password?</a>', {
    h1: 'title',
    input: 'email,password',
    a: 'signin,signup,forgot',
    span: 'sremember,ssignin,ssignup'
});

new eHtml('auth-register', '<h1>Account SignUp</h1>\
<p class="hidden"></p>\
<input type="email" placeholder="e-mail">\
//-<input type="text" placeholder="Fullname">\
<input type="password" placeholder="password">\
<input type="password" placeholder="repeat password">\
<a href="" class="noHref button">\
    <div class="all-news big-button"><span>SignUp</span></div>\
</a>\
<a href="" class="noHref blue right">\
    <span>SignIn</span>\
</a>\
<div class="progress">\
    <div class="active"></div>\
    <div></div>\
    <div></div>\
</div>', {
    p:  'messageString',
    h1: 'title',
    //-input: 'email,name,password,pwd2',
    input: 'email,password,pwd2',
    a: 'signup,signin',
    span: 'ssignup,ssignin'
});


new eView('auth-login', {
    create: function() { return HTML['auth-login'](cr('div')); },
    init: function(self, obj) {
        map(parseLS('title,forgot,sremember,ssignin,ssignup'), function(key) {
            self.V[key].val = PAGE.ld(self.V[key].val);
        });
        
        self.V.password.attr({placeholder:PAGE.ld(self.V.password.attr('placeholder'))});
        
        if ( glob('email') ) {
            self.V.email.val = glob('email');
        }
        
        self.F._signin = function(reqData, rewriteData, params) {
            ENGINE._auth.login(reqData, f() {
                return true;
            }, function(sd, resp) {
                var ask2step = false;
                
                if ( sd && sd.field ) {
                    if ( sd.field == 'pwd' ) {
                        self.V.password.remCls('isValid');
                        self.V.password.addCls('notValid');
                    } else if ( sd.field == 'email' ) {
                        self.V.email.remCls('isValid');
                        self.V.email.addCls('notValid');
                    } else if ( sd.field == 'confirm' ) {
                        SYS.alert(PAGE.ld('Your account is not confirmed yet')+'. '+PAGE.ld('Check your email for verification message')+'.', 'red center')
                    } else if ( sd.field == 'code' ) {
                        
                    }
                } else if ( resp && resp.token ) {
                    var data = CO(resp);
                    delete data.token;
                    
                    glob('token', resp.token );
                    ask2step = data;
                }
                
                if ( ask2step ) {
                    var rewrites = {};
                    SYS.auth2step.get2authParse(ask2step, rewrites, f() {
                        self.F._signin({
                            email : self.V.email.val,
                            pwd   : self.V.password.val
                        }, rewrites, {
                            method:'auth2login'
                        });
                    })
                    
                }
                
            }, rewriteData, params);
        }
        
        self.F.signin = function() {
            if ( !ENGINE.isIframe && VALIDATOR.email(self.V.email) && VALIDATOR.notEmpty(self.V.password) ) {
                self.F._signin({
                    email : self.V.email.val,
                    pwd   : self.V.password.val
                });
            }
            return false;
        }
        
        evt(self.V.email,    'keyup', function(ev) { if ( ev.keyCode == 13 ) { self.F.signin(); } });
        evt(self.V.password, 'keyup', function(ev) { if ( ev.keyCode == 13 ) { self.F.signin(); } });
        clearEvents(self.V.signin).onclick = self.F.signin;
        
        clearEvents(self.V.signup).onclick = function() {
            POP.modal.show('auth-register');
            return false;
        };
        
        clearEvents(self.V.forgot).onclick = f() {
            if ( VALIDATOR.email(self.V.email) ) {
                ENGINE._auth.forgot({
                    email : self.V.email.val
                }, f(){}, f(sd) {});
            }
        }
    }
});

new eView('auth-register', {
    create: function() { return HTML['auth-register'](cr('div')); },
    init: function(self, obj) {
        map(parseLS('title,ssignin,ssignup'), function(key) {
            self.V[key].val = PAGE.ld(self.V[key].val);
        });
        //-self.V.name.attr({placeholder:PAGE.ld(self.V.name.attr('placeholder'))});
        self.V.password.attr({placeholder:PAGE.ld(self.V.password.attr('placeholder'))});
        self.V.pwd2.attr({placeholder:PAGE.ld(self.V.pwd2.attr('placeholder'))});
        
        
        self.F.signup = function() {
            if ( !ENGINE.isIframe && VALIDATOR.email(self.V.email) && VALIDATOR.pwdMatch(self.V.password, self.V.pwd2) ) {
                
//-                var nameMap = self.V.name.val.trim().split(/\s+/g);
//-                var fn = '';
//-                var ln = '';
//-                var tn = '';
//-                
//-                if ( nameMap.length >= 2 ) { 
//-                    ln = nameMap[0];
//-                    fn = nameMap[1];
//-                    tn = nameMap[2] || '';
//-                } else {
//-                    fn = nameMap[0];
//-                }
//-                
                
                glob('refereruid')
                var reqDict = {
                    lang_id   : PAGE.langObj.id,
                    email     : self.V.email.val,
//-                    params    : {
//-                        first_name : fn,
//-                        last_name  : ln,
//-                        third_name : tn
//-                    },
                    pwd       : self.V.password.val
                };
                if ( glob('refereruid') ) {
                    reqDict.referer_id = glob('refereruid');
                }
                
                ENGINE._auth.register(reqDict, null, function(sd) {
                    
                    if ( sd.field == 'email' ) {
                        self.V.messageString.remCls('hidden');
                        self.V.messageString.val = '*'+PAGE.ld('Email dublicate');
                        
                        self.V.email.remCls('isValid');
                        self.V.email.addCls('notValid');
                        
                        
                    }
                    
                });
            }
            return false;
        }
        
        self.V.email.onupdate(f() {
            self.V.messageString.addCls('hidden');
        });
        
        evt(self.V.pwd2, 'keyup', function(ev) { if ( ev.keyCode == 13 ) { self.F.signup(); } });
        clearEvents(self.V.signup).onclick = self.F.signup;
        
        clearEvents(self.V.signin).onclick = function() {
            POP.modal.show('auth-login');
            return false;
        };
    }
});









new eHtml('loginMenu','\
    <p>email</p><input type="text" />\
    <p>pwd</p><input type="password" />\
    <p></p><input type="submit" />',{
    p: 'lemail,lpwd,lsubmit',
    input: 'email,pwd,submit'
});



new eView('loginMenu', {
    create: function() { return HTML.loginMenu(cr('div','loginMenu')); },
    init: function(self) {
        self.V.email.val = glob('email') || '';
        
        self.F.sbm = function() {
            if ( VALIDATOR.email(self.V.email) ) {
                ENGINE._auth.login({
                    email : self.V.email.val,
                    pwd   : self.V.pwd.val
                    
                }, null, function() {
                    self.V.email.remCls('isValid');
                    self.V.email.addCls('notValid');
                });
            }
        }
        
        self.V.email.onkeyup = self.V.pwd.onkeyup = function(ev) {
            if ( ev.keyCode == 13 ) {
                self.F.sbm();
            }
        }
        self.V.submit.onclick = self.F.sbm;
    }
});

ENGINE._auth.askLogin = function() {
    POP.modal.show(VIEW['auth-login']());
}

















