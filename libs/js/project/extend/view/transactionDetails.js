
new eHtml('transactionDetails','<div></div><table></table>',{
    div:'title',
    table:'cont'
});


new eView('transactionDetails', {
    create: f() { return HTML.transactionDetails(cr('div','transactionDetails')); },
    init: f(self, obj) {
        self.V.title.val = obj.id;
        
        self.C.fieldMap = {
            email:    'email',
            ip:       'ip',
            uaccount: 'in_uaccount,out_uaccount'
        }
        
        self.V.lines = {};
        mapDLS(self.C.fieldMap, f(field, type) {
                if ( obj[field] ) {
                var newLine = cr('tr');
                newLine.nkey = newLine.cr('td').VAL(field);
                newLine.nval = newLine.cr('td').VAL(obj[field]);
                newLine.nsw  = newLine.cr('td');
                
                var swch = newLine.swch = cr.switcher({
                    del  : 'ok',
                    grey : 'grey',
                    black: 'black'
                });
                
                swch.onupdate(f(val) {
                    var match = RNG(ORM.model.adminlist).filter({
                        type:type,
                        data:obj[field]
                    })[0];
                    if ( val == 'grey' ) {
                        if ( match ) {
                            ORM.req(match._oid+':update',{is_black:false},self.F.fetchData);
                        } else {
                            ORM.req('adminlist:insert',{type:type,data:obj[field],is_black:false},self.F.fetchData);
                        }
                    } else if ( val == 'black' ) {
                        if ( match ) {
                            ORM.req(match._oid+':update',{is_black:true},self.F.fetchData);
                        } else {
                            ORM.req('adminlist:insert',{type:type,data:obj[field],is_black:true},self.F.fetchData);
                        }
                    } else {
                        if ( match ) {
                            ORM.req(match._oid+':delete',f() {
                                delete ORM.model.adminlist[match._oid];
                                delete ORM.model.adminlist[match._oname];
                                self.F.fetchData();
                            });
                        } else {
                            self.F.fetchData()
                        }
                    }
                    if ( self.V.lines.email ) { self.V.lines.email.swch.val = 'del'; }
                    if ( self.V.lines.ip ) { self.V.lines.ip.swch.val = 'del'; }
                    if ( self.V.lines.in_uaccount ) { self.V.lines.in_uaccount.swch.val = 'del'; }
                    if ( self.V.lines.out_uaccount ) { self.V.lines.out_uaccount.swch.val = 'del'; }
                    
                })
                
                swch.states.del.addCls('green');
                swch.states.black.addCls('black');
                newLine.nsw.attach(swch);
                
                
                self.V.cont.attach(newLine);
                self.V.lines[field] = newLine;
            }
        });
        
        self.F.fetchData = f() {
            ORM.req('adminlist:select',f(list) {
                var matchEmail = RNG(list).filter({data:obj.email})[0];
                if ( matchEmail ) {
                    if ( matchEmail.is_black ) {
                        self.V.lines.email.swch.val = 'black';
                    } else {
                        self.V.lines.email.swch.val = 'grey';
                    }
                }
                var matchIp = RNG(list).filter({data:obj.ip})[0];
                if ( matchIp ) {
                    if ( matchIp.is_black ) {
                        self.V.lines.ip.swch.val = 'black';
                    } else {
                        self.V.lines.ip.swch.val = 'grey';
                    }
                }
                var matchUac1 = RNG(list).filter({data:obj.in_uaccount})[0];
                var matchUac2 = RNG(list).filter({data:obj.out_uaccount})[0];
                if ( matchUac1 ) {
                    if ( matchUac1.is_black ) {
                        self.V.lines.in_uaccount.swch.val = 'black';
                    } else {
                        self.V.lines.in_uaccount.swch.val = 'grey';
                    }
                }
                if ( matchUac2 ) {
                    if ( matchUac2.is_black ) {
                        self.V.lines.out_uaccount.swch.val = 'black';
                    } else {
                        self.V.lines.out_uaccount.swch.val = 'grey';
                    }
                }
                
            },{
                selector:{
                    type:['in', ['email','uaccount','ip']]
                }
            });
        }
        
        self.F.fetchData();
    }
});
