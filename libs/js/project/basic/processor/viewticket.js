new eProcessor('viewticket', {
    process: function(self, db) {
        _jO(self);
        if ( !PAGE.level ) { return 0; }
        
        var ref = self.D.ref;
        
        if ( !ref ) { return 0;}
        self._ref = ref = 'ticket_'+ref;
        self._fileitems = S('.mk_fileitem', self);
        
        map(S('.mk_ticket_addmsgblock',self), f(node) {
            var taddmsgblock = VIEW.ticketaddmsg(self);
            
            node.attach(taddmsgblock);
        });
        
        if ( PAGE.level >= %levelSupport ) {
            var ddData = {};
            
            map(CONF.project.ticketstatusSpec.supportCan, f(lvl) {
                ddData[lvl] = CONF.project.ticketstatus[lvl];
            });
            
            ORM.prep(ref, f(obj) {
                map(S('.mk_ticket_supblock',self), f(node) {
                    if ( obj.status == CONF.project.ticketstatusSpec.new ) {
                        node.cr('div','asBtn').VAL(PAGE.ld('take ticket')).onclick = f() {
                            ORM.req(obj._oid+':take',f() {
                                LM.go(LAYER.pop.url.url);
                            });
                        }
                    } else {
                        var dd = cr.dropdown(ddData);
                        dd.val = obj.status;
                        
                        dd.onupdate(f(lvl) {
                            ORM.req(obj._oid+':setStatus',{status:lvl},f() {
                                LM.go(LAYER.pop.url.url);
                            });
                        });
                        
                        
                        node.attach(dd);
                    }
                });
                
                
                
            });
            
        }
    }
})


