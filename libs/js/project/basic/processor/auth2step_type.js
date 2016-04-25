

new eProcessor('auth2step_type', {
    process: function(self, db) {
        dispatchOnUpdate(self);
        
        self.V.switchers = [];
        self.C.switchers = {};
        self.activeSwitcher = null;
        
        map(S('.jSwitcher', self), f(node) {
            var key = node.attr('data-key');
            if ( key ) {
                self.V.switchers.push(node);
                self.C.switchers[key] = node;
                node.onclick = f() {
                    db.setSwitcher(self, db, key);
                    self.C._emitUpdated(self.activeSwitcher);
                }
            } else {
                node.detach();
            }
        });
        
        if ( self.V.switchers.length > 0 ) {
            db.setSwitcher(self, db, okeys(self.C.switchers)[0]);
        }
        
        $P(self, 'val', f() {
            return self.activeSwitcher;
        }, f(key) {
            if ( def(self.C.switchers[key]) ) {
                db.setSwitcher(self, db, key);
                return key;
            } else {
                db.setSwitcher(self, db);
                return null;
            }
        });
        
    },
    setSwitcher: function(self, db, key) {
        if ( self.activeSwitcher ) {
            self.C.switchers[self.activeSwitcher].remCls('active');
        }
        if ( key ) {
            self.activeSwitcher = key;
            self.C.switchers[self.activeSwitcher].addCls('active');
            (db.keyRules[key] || db.keyRules.def)(self, db);
        } else {
            self.activeSwitcher = null;
            db.keyRules.def(self, db);
        }
    },
    keyRules: {
        'def':f(self, db) {
            if ( self.view ) { self.view.detach(); }
        },
        'google': f(self, db) {
            var node = S('.mk_gauth_block', self)[0];
            
            if ( node ) {
                
                if ( !def(self.view) ) {
                    self.view = VIEW.googleauth();
                    
                    var infoBlock = S('.mk_gauth_info', self)[0];
                    if ( infoBlock ) {
                        self.view.V.infoph.attach(infoBlock);
                        infoBlock.remCls('hidden');
                    }
                    
                    var updGAList = f() {
                        self.view.V.body.val = '';
                        ORM.req('googleauth:select', f(list) {
                            map(list, f(obj) {
                                self.view.V.body.attach(VIEW.googleauth_item(obj));
                            });
                        }, {
                            selector: {
                                owner_id: ['=',PAGE.user.id],
                                isconfirmed: ['=', true]
                            }
                        });
                        
                    }
                    
                    EVENT.on('updateGoogleAuthList', updGAList);
                    updGAList();
                }
                
                node.attach(self.view);
            }
            
        }
    }
});















