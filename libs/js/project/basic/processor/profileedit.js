

new eProcessor('profileedit', {
    conf: {
        'email': { code: 0 },
        'phone': { code: 1 },
        'telegram': { code: 2 }
    },
    process: function(self, db) {
        tm(f(){ db._process(self, db); });
    },
    _process: function(self, db) {
        _jO(self);
        
        if ( !PAGE.level ) { LM.go('/'); return 0; }
        
        self.upd = {};
        self.updMethod = self.D.method || 'update';
        var containers = S('.mk_inp_cont', self);
        var inputs  = S('.mk_pe', self);
        var finputs = S('.mk_pf', self);
        var submits = S('.mk_pe_submit', self);
        var customSubmits = S('.mk_custom_submit', self);
        var textConts = S('.mk_text_cont', self);
        var partnersLink = S('.mk_partners_link')[0];
        self.vfields = [];
        self.reqfields = [];
        self.C.procs = {};
        self.C.procsKeys = okeys(db.customProc);
        self.C.customSubmits = {};
        self.C.containers = {};
        self.C.fContainers = {};

        partnersLink.val = ENGINE.path.page.concat('/', PAGE.lang, '/main/#u=', PAGE.user.id);

        map(customSubmits, f(node) {
            _jO(node);
            if ( node.D.pekey ) {
                self.C.customSubmits[node.D.pekey] = node;
            }
        });

        map(containers, f(node) {
            _jO(node);
            var key;
            if ( node.D.pekey ) {
                key = node.D.pekey;
                self.C.containers[key] = node;
            } else if ( node.D.key ) {
                key = node.D.key;
                self.C.fContainers[key] = node;
            }
        });

        map(inputs, f(node) {
            _jO(node);
            if ( node.D.pekey ) {
                if ( self.C.procsKeys.contains(node.D.pekey) ) {
                    self.C.procs[node.D.pekey] = node;
                } else {
                    db.procElem(self, db, node);
                }
            }
            if ( node.D.required == 'true' ) {
                self.reqfields.add(node);
            }
        });

        self.C.selected_files = {}
        map(finputs, f(node) {
            _jO(node);
            var cont = self.C.fContainers[node.D.key];
            if ( node.D.vfield == 'true' ) {
                self.vfields.push(node);
                if ( PAGE.level != %levelUser ) {
                    if ( node.setDisabled ) { node.setDisabled(true); } else { 
                        node.attr({disabled:'true'});
                        if ( def(cont) ) { cont.addCls('disabled'); }
                    }
                }
            }
            if ( node.D.required == 'true' ) {
                self.reqfields.add(node);
            }
            
            node.selfValidator = VALIDATOR.notEmpty;
            node.onchange = f(ev) {
                var file = ev.target.files[0];
                if ( file ) {
                    self.C.selected_files[node.D.key] = file;
                }
            }
        });
        
        mapO(self.C.procs, f(node, key) {
            db.customProc[key](self, db, node);
        })
        
        self.F.upd = f(func,doOnEmpty) {
            func = func || f(){  };
            if ( okeys(self.upd).length > 0 ) {
                if ( self.updMethod == 'updPassport' ) {
                    
                    self.upd.params = mergeObjects(PAGE.user.params, self.upd.params);
                    self.upd.verification_data = mergeObjects(PAGE.user.verification_data, self.upd.verification_data);
                    
                    if ( self.upd.verification_data.birthdate ) { parseInt(self.upd.verification_data.birthdate); }
                    
                } else if ( self.updMethod == 'updSecurity' ) {
                    self.upd.auth2options = mergeObjects(PAGE.user.auth2options, self.upd.auth2options);
                }
                func();
            } else if ( doOnEmpty ) { func(); }
        }
        
        map(submits, f(node) {
            node.onclick = f() {
                self.F.upd(f() {
                    ORM.req('user_'+PAGE.user.id+':'+self.updMethod,self.upd, f(resp) {
                        //-ENGINE._auth.authCancel();
                        //-alert(PAGE.ld('securityReasonsLogout'));
                        //-window.location.href = LAYER.main.url.url;
                        
                        //-log('r',resp);
                        
                        if ( def(resp.exception) ) {
                            if ( resp.field == 'auth2type' || resp.field == 'pwdrestore' ) {
                                SYS.alert([PAGE.ld('No account data for'),resp.value].join(' '), 'red center');
                            }
                        } else {
                            LM.go();
                        }
                    });
                });
            };
        });

        if ( self.D.verifyrequest == 'true' && ( PAGE.level >= %levelManager || PAGE.level == %levelUser ) ) {
            map(textConts, f(textCont) {
                textCont.remCls('hidden');
            });
        }

        if ( PAGE.level == %levelUser ) {
            if ( self.D.verifyrequest == 'true' ) {
                map(submits, f(node) {
                    var newNode = cr('div','submit noHref asBtn').VAL(PAGE.ld('verify data')).attr({'href':'#'});
                    
                    newNode.onclick = f() {
                        
                        self.F.upd(f() {
                            ORM.req('user_'+PAGE.user.id+':'+self.updMethod, self.upd, f() {
                                
                                var reqData = { data: PAGE.user.verification_data };
                                
                                mapO(self.C.selected_files, f(file,k) {
                                    reqData[k] = [file, getFileName(file)];
                                });
                                
                                
                                var isValid = true;
                                map(self.reqfields, f(node) {
                                    if ( node.selfValidator ) {
                                        if ( !node.selfValidator(node) ) { isValid = false; }
                                    }
                                });
                                
                                
                                if ( isValid ) {
                                    
                                    PROTOCOL.form.write('user:verify', reqData, f(t, resp){
                                        ENGINE._auth.checkNewSession(resp, f() {
                                            if ( resp.verifyrequest ) {
                                                LM.go();
                                            }
                                        });
                                    });
                                    
                                }
                                
                                //-
                                //-ORM.req('user_'+PAGE.user.id+':verify',f(t, resp) {
                                //-    if ( resp.session && resp.user ) {
                                //-        ENGINE._auth.authOk({}, resp.user[0], resp.session[0], f() {
                                //-            if ( resp.ticket ) {
                                //-                LM.go(['/',PAGE.lang,'/ticket/',resp.ticket[0].name,'/?ask=profileupload'].join(''));
                                //-            } else { LM.go(); }
                                //-        });
                                //-    } else { LM.go(); }
                                //-    
                                //-});
                            });
                        }, true);//- do on empty
                        
                         return 0;
                    }
                    
                    insAfter(newNode, node);
                });
            }
            
            map(S('.mk_verification_status', self), f(node) {
                node.addCls('red');
                node.val = PAGE.ld('not verified');
            });
        } else {
            
            
            if ( self.D.verifyrequest == 'true' ) {
                if ( PAGE.level >= %levelManager ) {
                    map(submits, detach);
                } else {
                    map(submits, f(node) {
                        if ( PAGE.level == %levelNotConfirmed ) {
                            node.val = PAGE.ld('Unverify');
                        } else {
                            node.val = PAGE.ld('Verification confirmed');
                        }
                        
                        node.addCls('notValid');
                        
                        clearEvents(node).onclick = f() {
                            SYS.confirm(PAGE.ld('Are you sure you want to unverify your account?'),'center', f() {
                                ORM.req('user:unverify', f(t, resp) {
                                    ENGINE._auth.checkNewSession(resp, f() { LM.go(); });
                                });
                            });
                            return false;
                        };
                    });
                }
            }
            
            if ( PAGE.level == %levelNotConfirmed ) {
                map(S('.mk_verification_status', self), f(node) {
                    node.addCls('blue');
                    node.val = PAGE.ld('verification in progress');
                });
            } else {
                map(S('.mk_verification_status', self), f(node) {
                    node.addCls('green');
                    node.val = PAGE.ld('verified');
                });
            }
        }
        
        
    },
    procElem: f(self, db, node) {
        var key = node.D.pekey;
        var validator;
        if ( !node.D.novalidator ) {
            validator = f() { return true; }
        } else {
            validator = (db.validators[key] && VALIDATOR[db.validators[key]])||VALIDATOR[db.validators.def];
        }
        var cont = self.C.containers[key];
        node.selfValidator = validator;
        
        var cval = $AD(PAGE.user, key);
        node.val = cval;
        
        if ( node.D.vfield == 'true' ) {
            self.vfields.push(node);
            if ( PAGE.level != %levelUser ) {
                if ( node.setDisabled ) { node.setDisabled(true); } else { 
                    node.attr({disabled:'true'});
                    if ( def(cont) ) { cont.addCls('disabled'); }
                }
            }
        }
        
        node.onupdate(f(val) {
            if ( validator(node) ) {
                
                $AD(self.upd, key, {
                    autocreate: {},
                    setVal: node.val
                });
            }
        });
        
        if ( cval ) { node.C._emitUpdated(); }
    },
    customProc: lsMapToDict({
        'pwd1,pwd2': f(self, db, node) {
            node.onupdate(f(val) {
                if ( VALIDATOR.pwdMatch(node, self.C.procs.pwd2) ) {
                    self.upd.pwd = val;
                } else {
                    delete self.upd.pwd;
                }
            });
        },
        'phone,telegram': f(self, db, node) {
            var key = node.D.pekey,
                code = db.conf[key].code,
                method = 'addContact',
                validator = (db.validators[key] && VALIDATOR[db.validators[key]])||VALIDATOR[db.validators.def],
                adapter = db.adapters[key] && ADAPTER[db.adapters[key]];
                data = {},
                node.confirmCont = self.C.containers['confirm.'+key];


            adapter.process(node);
            node.val = $AD(PAGE.user, key);

            node.onupdate(f(val) {
                log(node.confirmCont);
                if ( validator(node) ) {
                    data['type'] = code;
                    data['account'] = node.val;
                }
            });

            evt(self.C.customSubmits[key], 'click', f() {
                ORM.req('user:'+method, data, f(resp) {
                    node.confirmCont.remCls('hidden');
                    node.confirmCont._data = data;
                });
            });
        },
        'confirm.phone,confirm.telegram': f(self, db, node) {
            var key = node.D.pekey,
                method = 'confirmContact',
                validator = VALIDATOR.notEmpty,
                cont = self.C.containers[key],
                data;

            cont.addCls('hidden');

            node.onupdate(f(val) {
                if ( validator(node) ) {
                    data = mergeObjects(cont._data, { code: node.val });
                }
            });

            evt(self.C.customSubmits[key], 'click', f() {
                ORM.req('user:'+method, data, f(resp) {
                    var notif = cr('span');
                    notif.VAL('TBD');
                    SYS.notify(notif);
                    ENGINE._auth.checkNewSession(resp, f() {
                        LM.go();
                    });
                });
            });
        }
    }),
    validators: lsMapToDict({
        'def':'notEmpty',
        'email':'email',
        'phone,telegram':'phone'
    }),
    adapters: lsMapToDict({
        'phone,telegram':'phone'
    })
});















