new eProcessor('viewcalc', {
    process: function(dom, db) {
        
        if ( dom.innerHTML == '' ) {
            dom.addCls('calc-container');
            getRawData('/_view/'+PAGE.lang+'/calc/', function(html) {
                dom.innerHTML = html;
                db._process(dom,db);
            });
        } else {
            tm(f(){ db._process(dom,db); });
        }
    },
    _process: function(self, db) {
        
        _jO(self).V = selectorMapping(self, {
            '.mk_input':'in_input,out_input',
            '.mk_top_paysystem':'top_in_ps,top_out_ps',
            '.mk_top_currency':'top_in_cur,top_out_cur',
            '.mk_list_paysystem':'list_in_ps,list_out_ps',
            '.mk_list_currency':'list_in_cur,list_out_cur',
            '.mk_psSpecInp':'in_psi,out_psi',
            '.mk_mailInp' : 'mailInp',
            '.mk_submit':'submit',
            '.txt-red':'txt_in_sum,txt_out_sum'
        });
        self.needEmpty = [];
        
        
        map(parseLS('txt_in_sum,txt_out_sum'), f(k) {
            if ( self.V[k] ) {
                self.V[k+'_red'] = self.V[k].cr('small', 'red right');
                self.needEmpty.push(self.V[k+'_red']);
            }
        })
        
        self.V.uauths = S('.mk_uauth', self);
        
        if ( PAGE.level == 0 ) {
            map(self.V.uauths, f(node) { node.remCls('hidden'); });
        }
        
        
        var detCalc = S('.detailedCalc', self)[0];
        if ( detCalc ) {
            self.V = mergeObjects(self.V, selectorMapping(detCalc, {
                '.sum-input' : 'in_sum,out_sum',
                '.sum-txt'   : 'in_txt,out_txt'
            }));
        }
        
        
        
        
        self.C.conf = self.C.conf || CASH;
        self.C.insertData = {};
        self.ps = {};
        
        self.current = {};
        self.rate = [1,1];
        self.nodes = {
            in: {},
            out: {}
        }
        self.strNodes = {
            'in_name'  : S('.mk_in_name', self),
            'out_name' : S('.mk_out_name', self),
            'rate'     : S('.mk_rateString', self),
            'coffer'   : S('.mk_cofferString', self)
        }
        
        
        
        self.setRestrictions = function(list) {
            self.C.conf = CASH.data._normaliseExchanges(CASH, list);
            db._process(self, db);
        }
        
        
        
        
        

        self.F.tio = function(calcData) {
            self.inSum = calcData.in_sum;
            self.outSum = calcData.out_sum;
            if ( detCalc ) {
                self.V.in_sum.val  = calcData.in_user.toDec();
                self.V.out_sum.val = calcData.out_user.toDec();
            }
            self.F.fetchMinMax();
            self.F.drawAdminTable();
        }
        
        
        self.F.ito = function() {
            var env = getEnv(this);
            var val = env.ito_val || Math.max(0, self.V.in_input.val.fromDec());
            var calcData = calcObj.calcExchange(self.current.exchange, {
                in_sum: val,
                is_admin: self.D.isadmin
            });
            self.calcData = calcData;
            self.V.out_input.val = calcData.out_sum.toDec();
            self.F.tio(calcData);
        }
        
        self.F.oti = function() {
            var env = getEnv(this);
            var val = env.oti_val || Math.max(0, self.V.out_input.val.fromDec());
            var calcData = calcObj.calcExchange(self.current.exchange, {
                out_sum: val,
                is_admin: self.D.isadmin
            });
            self.calcData = calcData;
            self.V.in_input.val = calcData.in_sum.toDec();
            self.F.tio(calcData);
        }
        
        
        
        self.F.prepDom = function() {
            
            EVENT.on('calc.currency.in', f() {
                self.V.in_input._precision = self.current.in_cur.params.precision;
                if ( self.V.in_sum ) {
                    self.V.in_sum._precision = self.current.in_cur.params.precision;
                }
            });
            EVENT.on('calc.currency.out', f() {
                self.V.out_input._precision = self.current.out_cur.params.precision;
                if ( self.V.out_sum ) {
                    self.V.out_sum._precision = self.current.out_cur.params.precision;
                }
            });
            
            
            ADAPTER.calcval.process(self.V.in_input);
            ADAPTER.calcval.process(self.V.out_input);
            
            if ( detCalc ) {
                ADAPTER.calcval.process(clearEvents(self.V.in_sum));
                ADAPTER.calcval.process(clearEvents(self.V.out_sum));
            }
            
            self.V.in_input.onkeyup  = self.F.ito;
            self.V.out_input.onkeyup = self.F.oti;
            self.V.in_input.onblur   = f(ev) {
                self.F.oti();
                self.F.setUrl(ev);
            }
            self.V.out_input.onblur  = f(ev) {
                self.F.ito();
                self.F.setUrl(ev);
            }
        }
        
        
        
        
        
        
        
        //- BASIC SETTERS
        
        self.F.setExchange = function(exchange, is_firstVal) {
            self.C.insertData = {};
            
            
            self.current.exchange = exchange;
            
            self.current.in_cur  = exchange._rel.in_currency;
            self.current.out_cur = exchange._rel.out_currency;
            
            self.current.in_ps  = self.current.in_cur._rel.paysystem;
            self.current.out_ps = self.current.out_cur._rel.paysystem;
            
            EVENT.emit('calc.currency.in' , self.current.in_cur);
            EVENT.emit('calc.currency.out', self.current.out_cur);
            EVENT.emit('calc.paysystem.in' , self.current.in_ps);
            EVENT.emit('calc.paysystem.out', self.current.out_ps);
            
            self.current.in_cur_name = self.current.in_cur.displayname;
            self.current.out_cur_name = self.current.out_cur.displayname;
            
            self.F._setPsVis(self.current.in_ps, 'in');
            self.F._setPsVis(self.current.out_ps, 'out');
            self.F._setCurVis(self.current.in_cur, 'in');
            self.F._setCurVis(self.current.out_cur, 'out');
            
            self.F.calcExch(exchange, is_firstVal);
        }
        
        self.F.drawAdminTable = f() {
            //-----     IS_ADMIN_&_CALCDATA_TABLE ----- //
            if ( self.D.isadmin && self.calcData ) {
                self.in_admin_table  = self.in_admin_table || self.V.in_psi.cr('table');
                self.V.in_psi.attachFirst(self.in_admin_table);
                self.F._drawAdminTable();
            }
        }
        self.C.admintabledecfields = parseLS('rate,rateRev,bonus,bonus_out,partner,partner_out,in_sum,in_user,in_bill,in_cash,out_sum,out_user,out_bill,out_cash,profit,profit2');
        self.F._drawAdminTable = CEF(f() {
            var nd = mergeObjects({
                in_sum:self.inSum,
                out_sum:self.outSum,
                exchange_id:self.current.exchange.id
            },self.C.insertData);
            
            ORM.req('transaction:precalc',nd,function(t, data, orig) {
                self.in_admin_table.innerHTML = '';
                if ( data.pseudo ) {
                    var obj = data.pseudo[0];
                    log(t, data, orig);
                    if ( obj ) {
                        mapO(obj, f(val,k) {
                            if ( def(val) && T(val) != T.O ) {
                                var row = self.in_admin_table.cr('tr');
                                row.cr('td').VAL(k);
                                if ( k.contains('_id') ) {
                                    row.cr('td').VAL(val);
                                } else {
                                    row.cr('td').VAL(val.toDec());
                                }
                                
                            }
                        });
                        
                    }
                }
            });
            
        }, 200);
        
        
        self.F.drawCustomFields = f() {
            if ( self.V.in_psi ) {
                self.V.in_psi.innerHTML  = '';
                self.V.out_psi.innerHTML = '';
                
                self.ps.in  = self.current.in_ps;
                self.ps.out = self.current.out_ps;
                self.checksToPass = [];
                
                self.C.in_psiRule  = (PS[self.current.in_ps.name]  || {} ).in_inputs;
                self.C.out_psiRule = (PS[self.current.out_ps.name] || {} ).out_inputs;
                self.C.psiRule = (PS[self.current.out_ps.name] || {} ).inputs;
                
                
                
                self.current.exchange.params = self.current.exchange.params || {};
                self.C.insertData.u_params   = self.C.insertData.u_params   || { in: {}, out: {} };
                
                
                //-if ( self.current.exchange.params.is_userdata_in  && self.C.in_psiRule && self.C.in_psiRule.insert ) {
                if ( self.current.exchange.params.is_userdata_in  && self.C.psiRule ) {
                    
                    var view = VIEW.uparams(self.current.in_cur);
                    self.C.insertData.u_params.in = view.val;
                    view.onupdate(f(data) {
                        self.C.insertData.u_params.in  = data;
                    });
                    self.checksToPass.push(f(){ return okeys(view.val).length > 0; });
                    self.V.in_psi.attach(view);
                }
                //-if ( self.current.exchange.params.is_userdata_out && self.C.out_psiRule && self.C.out_psiRule.insert ) {
                //-if ( self.C.out_psiRule && self.C.out_psiRule.insert ) {
                if ( self.C.psiRule ) {
                    
                    var view = VIEW.uparams(self.current.out_cur);
                    self.C.insertData.u_params.out = view.val;
                    view.onupdate(f(data) {
                        self.C.insertData.u_params.out  = data;
                    });
                    self.checksToPass.push(f(){ return okeys(view.val).length > 0; });
                    self.V.out_psi.attach(view);
                }
                
            }
        }
        
        self.F.setPs = function(ps, prefix) {
            var tpre = (prefix == 'in') && 'out' || 'in';
            var tpres = tpre+'_ps';
            
            self.current[prefix+'_ps'] = ps;
            EVENT.emit('calc.currency.'+prefix, ps);
            self.F._setPsVis(ps, prefix);
            
            var curCurs = self.C.conf.calc[prefix+'_cur'].filter({paysystem_id:ps.id});
            var curCur;
            
            var avByExch = self.C.conf.curMap[tpre][self.current[tpre+'_cur'].id]||[];
            
            
            map(curCurs, function(cur) {
                if ( avByExch.contains(cur) ) {
                    curCur = cur;
                    return false;
                }
            });
            
            if ( !curCur ) {
                curCur = curCurs.filter({displayname:self.current[prefix+'_cur_name']})[0];
            }
            
            curCur = curCur || curCurs[0];
            self.F.setCur(curCur,prefix);
            
            var avPs = self.C.conf.psMapByCur[prefix][curCur.id];
            //-log('avPs',prefix,avPs);
            
            if ( !avPs.contains(self.current[tpres]) ) {
                self.current[tpres] = avPs[0];
                EVENT.emit('calc.currency.'+tpres, avPs[0]);
                self.F._setPsVis(self.current[tpres], tpre);
            }
            
            
            
        }
         
        self.F.setCur = function(cur, prefix) {
            
            var tpre = (prefix == 'in') && 'out' || 'in';
            var tpres = tpre+'_cur';
            
            self.current[prefix+'_cur'] = cur;
            self.current[prefix+'_cur_name'] = cur.displayname;
            EVENT.emit('calc.currency.'+prefix, cur);
            
            self.F._setCurVis(cur, prefix);
            var avCur = self.C.conf.curMap[prefix][cur.id];
            
            if ( !avCur.contains(self.current[tpres]) ) {
                self.current[tpres] = avCur[0];
                self.current[tpres+'_name'] = avCur[0].displayname;
                EVENT.emit('calc.currency.'+tpre, avCur[0]);
                
                var ps = ORM.O('paysystem_'+avCur[0].paysystem_id);
                self.F.setPs(ps, tpre);
                
                //-self.F._setCurVis(self.current[tpres], tpre);
            }
            
            self.F.calcExch();
            
        }
        
        
        
        
        //- CALC EXCH
        
        self.F.calcExch = function(exc, is_firstVal) {
            self.F.fetchActual();
            
            var exch = exc || self.C.conf.calc.exchanges.filter({
                in_currency_id  : self.current.in_cur.id,
                out_currency_id : self.current.out_cur.id
            })[0];
            
            if ( exch ) {
                self.current.exchange = exch;
                self.rate = optDelim(exch.rate.toDec());
                self.F.fetchStrs();
                self.F.ito();
                self.F.oti();
                self.F.setUrl();
            }
            
            if ( is_firstVal ) {
                self.F.ito();
                self.F.oti();
            } else {
                if ( exch.rate < (1).fromDec() ) {
                    self.F.ito.ENV({
                        ito_val:(1).fromDec()
                    })();
                    self.F.oti();
                } else {
                    self.F.oti.ENV({
                        oti_val:(1).fromDec()
                    })();
                    self.F.ito();
                }
            }
            self.F.setUrl();
            
            
            self.F.drawCustomFields();
            
        }
        
        self._lastUrl = null;
        self.F.setUrl = function() {
            if ( self.D.burl ) {
                var url = SYS.globalUrlModification( [self.D.burl + self.current.in_cur.name, self.current.out_cur.name, self.V.in_input.val.fromDec(), ''].join('/') );
                if ( self._lastUrl != url ) {
                    history.replaceState({
                        selfUrl: url
                    }, document.title, url);
                    self._lastUrl = url;
                }
            }
        }
        
        
        
        
        
        
        //- VISUALS
        
        self.F.fetchStrs = function() {
            
            var str_in_name  = [ORM.getVisName(self.current.in_ps) , self.current.in_cur_name ].join(' ');
            var str_out_name = [ORM.getVisName(self.current.out_ps), self.current.out_cur_name].join(' ');
            var dispRate     = optDelim(self.current.exchange.rate.toDec());
            var strRate      = [dispRate[0].toLen(2),str_in_name,'=',dispRate[1].toLen(2),str_out_name].join(' ');
            var ballanceStr;
            
            if ( PAGE.userData.currencyAcEq.contains(self.current.out_cur) ) {
                ballanceStr = ['\u221e',str_out_name].join(' ');
            } else {
                ballanceStr = [(self.current.out_cur.display_total||0).toDec(2),str_out_name].join(' ');
            }
            
            map(self.strNodes.in_name,  function(node) { node.val = str_in_name });
            map(self.strNodes.out_name, function(node) { node.val = str_out_name });
            map(self.strNodes.rate,     function(node) { node.val = strRate });
            map(self.strNodes.coffer,   function(node) { node.val = ballanceStr });
            
        }
        
        self.F.fetchActual = function() {
            var chList = self.C.conf.curMap.in[self.current.in_cur.id];
            
            
            map(self.nodes.out.cur, function(node) {
                if ( !chList.contains(node._cur) ) {
                    node.addCls('non-actual');
                } else {
                    node.remCls('non-actual');
                }
            });
            
            chList = self.C.conf.curMap.out[self.current.out_cur.id];
            
            
            map(self.nodes.in.cur, function(node) {
                if ( !chList.contains(node._cur) ) {
                    node.addCls('non-actual');
                } else {
                    node.remCls('non-actual');
                }
            });
        }
        
        self.F.fetchMinMax = f() { tm(self.F._fetchMinMax); }
        self.F._fetchMinMax = f() {
            var in_cur = self.current.in_cur;
            var out_cur = self.current.out_cur;
            if ( !in_cur || !out_cur ) { return 0; }
            
            var valid = true;
            
            if ( self.V.txt_in_sum_red ) {
                var min = in_cur.params.in_min_trans||0;
                var max = in_cur.params.in_max_trans||Infinity;
                self.V.txt_in_sum_red.val = '';
                
                if ( PAGE.level && PAGE.userData.currencyAcEq.contains(in_cur) && in_cur._rel.accurrency ) {
                    var acwallet = RNG(PAGE.userData.acwallet).filter({accurrency_id:in_cur._rel.accurrency.id})[0];
                    if ( acwallet ) { max = Math.min(max, acwallet.amount); }
                }
                
                if ( (self.V.in_input.val.fromDec() < min) ) {
                    self.V.txt_in_sum_red.val = [PAGE.ld('Min sum'),min.toDec(in_cur.params.precision)].join(' ');
                    valid = false;
                    self.V.in_input.addCls('notValid');
                } else if ( (self.V.in_input.val.fromDec() > max) ) {
                    self.V.txt_in_sum_red.val = [PAGE.ld('Max sum'),max.toDec(in_cur.params.precision)].join(' ');
                    valid = false;
                    self.V.in_input.addCls('notValid');
                } else {
                    self.V.in_input.remCls('notValid');
                }
            }
            if ( self.V.txt_out_sum_red ) {
                var min = out_cur.params.out_min_trans||0;
                var max = out_cur.params.out_max_trans||Infinity;
                self.V.txt_out_sum_red.val = '';
                
                if ( (self.V.out_input.val.fromDec() < min) ) {
                    self.V.txt_out_sum_red.val = [PAGE.ld('Min sum'),min.toDec(out_cur.params.precision)].join(' ');
                    valid = false;
                    self.V.out_input.addCls('notValid');
                } else if ( (self.V.out_input.val.fromDec() > max) ) {
                    self.V.txt_out_sum_red.val = [PAGE.ld('Max sum'),max.toDec(out_cur.params.precision)].join(' ');
                    valid = false;
                    self.V.out_input.addCls('notValid');
                } else {
                    self.V.out_input.remCls('notValid');
                }
            }
            
            
        }
        
        
        
        self.F._setPsVis = function(ps, prefix, noCur) {
            var key = prefix + '_ps';
            
            self.V['top_'+key].src = [ENGINE.path.static, 'image/ps/', ps.viewparams.imgHover].join('');
            if ( !noCur ) {
                self.F._drawCur(
                    self.C.conf.calc[prefix+'_cur'].filter({paysystem_id:ps.id}),
                    self.V[['list_','_cur'].join(prefix)],
                    prefix,
                function(cur) {
                        self.F.setCur(cur, prefix);
                });
            }
        }
        
        self.F._setCurVis = function(cur, prefix) {
            var key = prefix + '_cur';
            self.V['top_'+key].val = cur.displayname;
        }
        
        
        self.F._drawPsWorker = function(ps, func, row) {
            var node = VIEW['ps-table-item'](ps);
            node.clickOn = function() { func(ps); };
            node.onclick = node.clickOn;
            
            row.attach(node);
        }
        
        self.F._drawCurWorker = function(cur, func, row, prefix) {
            var node = VIEW['cur-table-item'](cur);
            node.clickOn = function() { func(cur); };
            node.onclick = node.clickOn;
            node._cur = cur;
            
            self.nodes[prefix].cur.push(node);
            
            row.attach(node);
        }
        
        self.F._drawPs = function(list, parent, func) {
            parent.innerHTML = '';
            var mult = 3;
            
            list.sort(f(a,b) {
                var v1 = (a.params && a.params.order) || 1000;
                var v2 = (b.params && b.params.order) || 1000;
                return v1 - v2;
            });
            
            var lenProp = list.length / mult;
            var len = parseInt(lenProp);
            if ( len < lenProp ) { len += 1; }
            
            var index = 0;
            for ( var i = 0; i < len; i++) {
                var row = parent.cr('tr');
                
                for ( var j = 0; j < mult && index < list.length; j++, index++ ) {
                    self.F._drawPsWorker(list[index], func, row);
                }
            }
            
        }
        
        self.F._drawCur = function(list, parent, prefix, func) {
            parent.innerHTML = '';
            self.nodes[prefix].cur = [];
            var mult = 2;
            
            list.sort(f(a,b) {
                var v1 = (a.params && a.params.order) || 1000;
                var v2 = (b.params && b.params.order) || 1000;
                return v1 - v2;
            });
            
            var lenProp = list.length / mult;
            var len = parseInt(lenProp);
            if ( len < lenProp ) { len += 1; }
            
            var index = 0;
            for ( var i = 0; i < len; i++) {
                var row = parent.cr('tr');
                
                for ( var j = 0; j < mult && index < list.length; j++, index++ ) {
                    self.F._drawCurWorker(list[index], func, row, prefix);
                }
            }
            
        }
        
        self.F.drawInPs = function() {
            self.F._drawPs(self.C.conf.calc.in_ps, self.V.list_in_ps, function(ps) {
                self.F.setPs(ps, 'in');
            });
        }
        
        self.F.drawOutPs = function() {
            self.F._drawPs(self.C.conf.calc.out_ps, self.V.list_out_ps, function(ps) {
                self.F.setPs(ps, 'out');
            });
        }
        
        
        
        
        
        
        
        
        
        
        
        //- INIT
        
        self.F.prepDom();
        self.V.in_input.val = (self.D.iv || 0).toDec();
        self.F.drawInPs();
        self.F.drawOutPs();
        var firstVal = (self.V.in_input.val > 0);
        
        if ( self.D.exchange ) {
            var exch = ORM.O('exchange_'+self.D.exchange);
            if ( self.C.conf.calc.exchanges.contains(exch) ) {
                self.F.setExchange(exch, firstVal);
            } else {
                self.F.setExchange(self.C.conf.calc.exchanges[0], firstVal);
            }
        } else {
            self.F.setExchange(self.C.conf.calc.exchanges[0], firstVal);
        }
        
        
//-        self.F.ito();
//-        self.F.oti();
        
        
        clearEvents(self.V.submit).onclick = function() {
            if ( self.D.pop == 'true' )  {
                if ( self.D.gurl ) {
                    var url = [self.D.gurl + self.current.in_cur.name, self.current.out_cur.name, self.V.in_input.val.fromDec(), ''].join('/');
                    //-ENGINE.goPage(url);
                    LM.go(url);
                    return false;
                }
            } else {
                var nd = mergeObjects({
                    in_sum:self.inSum,
                    out_sum:self.outSum,
                    exchange_id:self.current.exchange.id
                },self.C.insertData);
                var refid = SYS.gettransactionreferer();
                if ( refid ) {
                    nd.referer_id = refid;
                }
                
                if ( !PAGE.level ) {
                    if ( !VALIDATOR.email(self.V.mailInp) ) {
                        return false;
                    }
                    
                    nd.email = self.V.mailInp.val;
                }
                
                if ( self.checksToPass ) {
                    var passed = map(self.checksToPass, f(fn) {
                        if ( !fn() ) { return false; }
                    });
                    
                    if ( !passed ) {
                        SYS.notify(PAGE.ld('Fill remaining fields'), 'warning center');
                        return false;
                    }
                }
                
                if ( self.needEmpty.length ) {
                    var passed = map(self.needEmpty, f(node) {
                        return node.val.length == 0;
                    });
                    
                    if ( !passed ) {
                        SYS.notify(PAGE.ld('Fill remaining fields'), 'warning center');
                        return false;
                    }
                }
                
                ORM.req('transaction:insert',nd,function(transactions) {
                    var url = ['/', '/transaction/'].join(PAGE.lang);
                    url += '#t='+transactions[0].name;
                    LM.go(url);
                });
            }
            return false;
        }
        
    }
})



















