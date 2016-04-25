
SYS.viewtransactioninterval = null;

new eProcessor('viewtransaction', {
    
    getByName: f(name, func) {
        getRawData(['/_dynaview/',PAGE.lang,'/byname_transaction/',name,'/'].join(''), f(dt) {
            PROTOCOL.api.read(parseObj(dt),null, f(objd){
                var objs = objd.transaction;
                ORM.respFuncParse(objd);
                
                func(objs);
            }, log);
        });
    },
    
    process: f(dom, db) {
        var key = LAYER.pop.url.anchor.t;
        
        if ( key ) {
            
            db._prepWork(dom, db);
            
            
            db.getByName(key, f(nobj) {
                db._process(dom, db, nobj[0]);
            });
        }
        
    },
    _prepWork: f(self, db) {
        _jO(self).V = selectorMapping(self, {
            '.mk_input'  : 'in_input,out_input',
            '.sum-input' : 'in_user,out_user',
            '.inp-block' : 'in_sum,in_total,out_sum,out_total,expiry',
            '.mk_final'  : 'final',
            '.mk_psInput': 'in_psi,out_psi',
            '.mk_footerlink':'footerLinkBlock'
        });
        
        
        self.V.expire  = S('.mk_expire' , self);
        self.V.tstatus = S('.mk_tstatus', self);
        self.V.tokens  = S('.mk_token'  , self);
        self.V.remFrom = S('.mk_remFrom', self);
        self.V.share   = S('.mk_share'  , self);
        
        self.btns = {};
        self.C.insertData = {};
        self.C.billData = {};
        
        self.C.interval_basic = null;
        self.C.interval_expire = null;
        
        self.fetchSum = f(node, val) {
            node.val = val.toDec();
            tm(f() {
                node.val = val.toDec();
            });
            ADAPTER.calcval.process(node);
        }
        
    },
    
    renewCurrent: f(self, db) {
        if ( db.currentObj && getInDocument(self) ) {
            
            db.getByName(db.currentObj.name, f(nobj) {
                db._process(self, db, nobj[0]);
            });
            
        }
    },
    _process: f(self, db, obj) {
        
        db.currentObj = obj;
        
        db.renewCurrent = f() {
            if ( db.currentObj && getInDocument(self) ) {
                    
                db.getByName(db.currentObj.name, f(nobj) {
                    db._process(self, db, nobj[0]);
                });
                
            }
        }
        
        var cur = obj._rel.in_currency;
        var ps  = cur._rel.paysystem;
        
        self.C.ps = ps;
        self.C.status  = obj.tstatus || 0;
        self.C.viewstatus = obj.status || 0;
        
        
        map(self.V.remFrom, function(node) {
            if ( _jO(node).D.from && node.D.from < self.C.status ) {
                node.addCls('hidden');
            } else {
                node.remCls('hidden');
            }
        });
        
        
        self.cur = {
            in  : obj._rel.in_currency,
            out : obj._rel.out_currency
        }
        self.ps = {
            in  : self.cur.in._rel.paysystem,
            out : self.cur.out._rel.paysystem,
        }
        
        self.exchangeHref = ['', PAGE.lang, 'exchange', self.cur.in.name, self.cur.out.name, ''].join('/');
        self.exchangeHrefEnc = encodeURIComponent(SYS.globalUrlModification(ENGINE.path.page+self.exchangeHref));
        
        map(self.V.share, f(node) {
            var href = [node.attr('href'),self.exchangeHrefEnc].join('');
            
            node.attr({
                href   : href,
                target : '_blank'
            });
            
            clearEvents(node).onclick = function() {
                if ( SYS.window.share ) {
                    SYS.window.share.close();
                    delete SYS.window.share;
                }
                
                SYS.window.share = window.open(node.attr('href'), 'share', 'width=600,height=400');
                
                return false;
            }
        })
        
        //-detach(self.V.in_ps_view);
        //-detach(self.V.out_ps_view);
        //-detach(self.V.in_cur_view);
        //-detach(self.V.out_cur_view);
        
        self.V.in_ps_view = self.V.in_ps_view || self.V.in_sum.cr('img');
        self.V.in_ps_view.attr({
            src: '/static/image/ps/'+self.ps.in.viewparams.imgHover,
            alt: self.ps.in.name
        });
        
        self.V.out_ps_view = self.V.out_ps_view || self.V.out_sum.cr('img');
        self.V.out_ps_view.attr({
            src: '/static/image/ps/'+self.ps.out.viewparams.imgHover,
            alt: self.ps.out.name
        });
        
        self.V.in_cur_view  = self.V.in_cur_view || self.V.in_sum.cr('div','cur');
        self.V.in_cur_view.VAL(self.cur.in.displayname);
        self.V.out_cur_view = self.V.out_cur_view || self.V.out_sum.cr('div','cur');
        self.V.out_cur_view.VAL(self.cur.out.displayname);
        
        
        self.fetchSum(self.V.in_input, obj.in_sum);
        self.fetchSum(self.V.out_input, obj.out_sum);
        self.fetchSum(self.V.in_user, obj.calc_result.in_user);
        self.fetchSum(self.V.out_user, obj.calc_result.out_user);
        
        
        db.fetchState(self, db, obj);
        
    },
    
    
    
    
    fetchState: function(self, db, obj) {
        var f = f() {
            db._fetchState(self,db,obj);
        }
        clearInterval(SYS.viewtransactioninterval);
        
        SYS.viewtransactioninterval = tm(f, 10);
        
    },
    
    
    _fetchState: function(self, db, obj) {
        self.now = (new Date()*1);
        self.C.expired = ( obj.expiry <= self.now);
        self.V.final.innerHTML = '';
        self.btns = {};
        
        //-if ( obj.is_cancelled ) { self.C.status = -50; } else
        //-if ( self.C.status < 50 && self.C.expired ) { self.C.status = -60; }
        
        
        map(self.V.tokens, f(node) {
            node.val = obj.name;
        });
        
        self.V.in_psi.innerHTML = '';
        self.V.out_psi.innerHTML = '';
        
        
        //- expiry timer
        //- status value
        //- state buttons
        //- paysystem-specific
        
        
        
        var s1 = f(stat, clock) {
            map(self.V.expire, f(node) { node.innerHTML = clock; });
            
            map(self.V.tstatus, f(node) {
                node.val = self.C.status + ' : ' + CONF.project.tstrstatus[stat];
                node.className = node.className.replace(/[\ \"\']status_[\-\d]+/g, '') + ' status_'+stat;
            });
            
            db.state[stat](self, db, obj);
        }
        var s2 = f(specFunc) {
            specFunc = specFunc || f(){};
            
            map(self.V.expire, f(node) {
                var timer = VIEW.timer({ expiry: obj.expiry});
                node.innerHTML = '';
                node.attach(timer);
            });
            
            map(self.V.tstatus, f(node) {
                node.val = self.C.status + ' : ' + (CONF.project.tstatus[self.C.viewstatus] || CONF.project.tstatus.def);
                node.className = node.className.replace(/[\ \"\']status_[\-\d]+/g, '') + ' status_'+self.C.viewstatus;
            });
            
            if ( db.state[self.C.status] ) { db.state[self.C.status](self, db, obj); }
            
            specFunc();
            
            if ( obj.expiry && obj.expiry > self.now ) {
                var t = Math.max((obj.expiry - self.now), 1000);
                clearInterval(self.C.interval_expire);
                self.C.interval_expire = tm(f() {
                    db.fetchState(self, db, obj);
                }, t);
            }
        }
        
        
        
        
        clearInterval(self.C.interval_basic);
        self.C.interval_basic = tm(f(){
            db.renewCurrent(self, db);
        }, 10000);
        
        
        
        if ( obj.is_cancelled ) {
            s1('cancelled','--:--');
            return 0;
        }
        
        
        
        if ( self.C.status < 50 ) {
            if ( self.C.expired ) {
                s1('expired','00:00');
                return 0;
            }
            s2(f() {
                var spec = PS[self.ps.in.name];
                if ( spec && spec.in_inputs[0] ) { spec.in_inputs[0](self, db, obj); }
                var spec = PS[self.ps.out.name];
                if ( spec && spec.in_inputs[1] ) { spec.out_inputs[0](self, db, obj); }
            });
            return 0;
        }
        if ( self.C.status == 50 ) {
            if ( self.C.expired ) {
                s1('expired','00:00');
                return 0;
            }
            s2(f(){
                var t = cr('div', 'txt small');
                t.val = PAGE.ld('timeout riched transaction on review');
                self.V.final.attachFirst(t);
            });
            return 0;
        }
        
        var spec = PS[self.ps.out.name];
        
        if ( self.C.status == 150 && spec.inputs ) {
            self.C.insertData.u_params     = self.C.insertData.u_params     || { in: {}, out: {} };
            s2(f(){
                var view = VIEW.uparams(self.cur.out);
                self.C.insertData.u_params.out = view.val;
                view.onupdate(f(data) {
                    self.C.insertData.u_params.out  = data;
                });
                self.V.out_psi.attach(view);
            });
        }
        
        //-if ( self.C.status > 50 && spec.out_inputs[self.C.status] ) {
        //-    s2(f(){
        //-        spec.out_inputs[self.C.status](self, db, obj);
        //-    });
        //-    
        //-    return 0;
        //-}
        
        s2();
        return 0;
        
    },
    
    
    externalForm: f() {
        if ( SYS.payWnd ) {
            SYS.payWnd.close();
            delete SYS.payWnd;
        }
        SYS.payWnd = window.open('about:blank','payWnd', $F('width={0},height={1},scrollbars=yes,menubar=no', [EVENT.data.windowSize.x-200, EVENT.data.windowSize.y-60]));
        
        clearInterval(SYS.payWndInt);
        SYS.payWndInt = setInterval(f(){
            if ( !SYS.payWnd || SYS.payWnd.closed ) {
                clearInterval(SYS.payWndInt);
                if( PROCESSOR.viewtransaction.data.renewCurrent ) {
                    PROCESSOR.viewtransaction.data.renewCurrent();
                }
            } 
        }, CONF.project.transactionRenewInterval);
        
        var target = SYS.payWnd.document.body;
        return target;
    },
    
    
    //-template: {
    //-    input: f(self, db, obj, data) {
    //-        //- data: name, ph, func
    //-        data.pre = data.pre || 'in';
    //-        var name = data.name || '';
    //-        var ph   = data.ph || '';
    //-        var func = data.func || log;
    //-        var node = self.V[(data.pre)+'_psi'];
    //-        
    //-        node.cr('div', 'txt sum-txt').VAL(PAGE.ld(name));
    //-        var pb = node.cr('div', 'inp-block').cr('div','inp');
    //-        var inp = pb.cr('input', 'sum-input').attr({
    //-            type:'text',
    //-            placeholder: ph
    //-        });
    //-        inp.val = data.val || '';
    //-        
    //-        inp.onupdate(f(val) {
    //-            func(inp);
    //-        });
    //-        //-inp.onkeyup = f(ev){
    //-        //-    func(inp);
    //-        //-}
    //-        
    //-        //-tm(f(){ func(inp.val, inp); });
    //-        
    //-        tm(f(){func(inp);});
    //-        
    //-        if ( self.checksToPass ) {
    //-            self.checksToPass.push(f(){ return func(inp); });
    //-        }
    //-        
    //-    },
    //-    input_coffer: f(self, db, obj, data) {
    //-        data.pre = data.pre || 'in';
    //-        var psn = self.ps[data.pre].name;
    //-        var globInd = ['user_coffer',data.pre,psn].join('_');
    //-        
    //-        //-log(1, data, self.ps);
    //-        
    //-        db.template.input(self, db, obj, {
    //-            name: 'coffer',
    //-            ph: data.ph,
    //-            pre: data.pre,
    //-            val: (glob(globInd) || ''),
    //-            func: f(inp) {
    //-                var val = inp.val;
    //-                var valc = PS[psn][data.validator||'validator'](inp);
    //-                
    //-                if ( valc ) {
    //-                    
    //-                    glob(globInd, val);
    //-                    
    //-                    self.C.insertData.u_params     = self.C.insertData.u_params     || {};
    //-                    self.C.insertData.u_params.in  = self.C.insertData.u_params.in  || {};
    //-                    self.C.insertData.u_params.out = self.C.insertData.u_params.out || {};
    //-                    
    //-                    (data.func||log)(val);
    //-                    return true;
    //-                }
    //-                return false;
    //-            }
    //-        });
    //-    }
    //-},
    
    
    processBRule: f(self, db, obj, resp){
        (PS[self.C.ps.name] || PS.def).bill(self, db, obj, resp);
    },
    
    newBtn: f(self, cls) {
        var btn = _jO(self.V.final.cr('a', 'noHref fa '+(cls||'')).attr({href:'#'}));
        btn.V.txt = btn.cr('span').cr('p');
        return btn;
    },
    buttonFunc: {
        bill: f(self, db, obj){
            self.btns.bBill = db.newBtn(self, 'green');
            self.btns.bBill.V.txt.val = PAGE.ld('Confirm');
            
            
            
            clearEvents(self.btns.bBill).onclick = function() {
                
                if ( PS[self.C.ps.name] && PS[self.C.ps.name].hasExternal ) {
                    db.externalForm();
                }
                
                var auth2step = false;
                var in_cur = obj._rel.in_currency;
                
                try {
                    auth2step = in_cur && PAGE.userData.currencyAcEq.contains(in_cur) && PAGE.userData.auth2stepCst.transaction.contains('bill');
                } catch(err) {}
                
                var rewrites = {};
                
                var doBill = f() {
                    ORM.req(obj._oname+':bill', function(nobj, fullResp) {
                        db._process(self, db, nobj[0]);
                        self.btns.bBill.addCls('hidden');
                        tm(f(){ db.processBRule(self, db, obj, fullResp); }, 1000);
                    }, rewrites);
                }
                
                
                if ( auth2step ) {
                    SYS.auth2step.get2auth(rewrites, doBill);
                } else {
                    doBill();
                }
                
                return false;
            }
        },
        cancel: f(self, db, obj){
            self.btns.bCancel = db.newBtn(self);
            self.btns.bCancel.V.txt.val = PAGE.ld('Cancel');
            
            clearEvents(self.btns.bCancel).onclick = function() {
                ORM.req(obj._oname+':cancel', function(nobj) {
                    db._process(self, db, nobj[0]);
                });
                
                return false;
            }
        },
        renew: f(self, db, obj){
            self.btns.bRenew = db.newBtn(self, 'posNext');
            self.btns.bRenew.V.txt.val = PAGE.ld('Renew');
            
            clearEvents(self.btns.bRenew).onclick = function() {
                ORM.req(obj._oname+':renew', function(nobj) {
                    db._process(self, db, nobj[0]);
                });
                
                return false;
            }
        },
        askexternal: f(self, db, obj) {
                if ( PS[self.C.ps.name] && PS[self.C.ps.name].externalRetry ) {
                self.btns.askExternal = db.newBtn(self, 'green');
                self.btns.askExternal.V.txt.val = PAGE.ld('askExternal');
                
                clearEvents(self.btns.askExternal).onclick = function() {
                    db.processBRule(self, db, obj);
                    return false;
                }
            }
            
        },
        backtoexchange: f(self, db, obj) {
            self.btns.bBackExchange = db.newBtn(self);
            self.btns.bBackExchange.V.txt.val = PAGE.ld('Make another exchange');
            
            clearEvents(self.btns.bBackExchange).onclick = function() {
                LM.go(self.exchangeHref);
                
                return false;
            }
        }
    },
    
    state: lsMapToDict({
        'cancelled': f(self, db, obj) {
            db.buttonFunc.renew(self, db, obj);
            self.btns.bRenew.remCls('posNext');
        },
        'expired': f(self, db, obj) {
            db.buttonFunc.renew(self, db, obj);
            db.buttonFunc.cancel(self, db, obj);
        },
        '1': f(self, db, obj) {
            db.buttonFunc.renew(self, db, obj);
            db.buttonFunc.cancel(self, db, obj);
            db.buttonFunc.bill(self, db, obj);
        },
        '50': f(self, db, obj) {
            db.buttonFunc.askexternal(self, db, obj);
            db.buttonFunc.cancel(self, db, obj);
        },
        '200': f(self, db, obj) {
            db.buttonFunc.backtoexchange(self, db, obj);
        }
    })
});



















