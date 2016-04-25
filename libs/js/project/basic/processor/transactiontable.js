
new eProcessor('transactiontables', {
    itemsPerPage: 30,
    process: function(self, db) {
        _jO(self).C.nodes = [];
        
        
        self.V.tab       = S('.table-tab'       , self);
        self.V.cont      = S('.table-container' , self);
        self.V.table     = S('.table-history'   , self);
        self.V.paginator = S('.mk_paginator'    , self)[0];
        self.V.typemarks = S('.mk_typemark'     , self);
        self.V.exportButtons = S('.mk_exportbtn', self);
        
        self.curTab     = 0;
        self.curList    = [];
        self.selector   = f(){};
        self.table      = _jO(self.V.table[0]);
        self.curPage    = 0;
        self.totalPages = 1;
        
        
        self.F.reqBy = f(func) {
            func = func || f(){};
            
            self.selector(self, db, f(list, t, data) {
                self.curList = list;
                self.totalPages = Math.ceil(data.count/db.itemsPerPage);
                self.F.buildPaginator();
                func(list);
            });
            self.F.fetchExportButtons();
            
        }
        
        self.F.fetchExportButtons = f() {
            if ( self.exportUrlpart ) {
                map(self.V.exportButtons, f(n) {
                    n.remCls('hidden');
                    n.href = ['/_view/ru/transaction_export/',self.exportUrlpart,'/'].join('');
                });
            } else {
                map(self.V.exportButtons, f(n) { n.addCls('hidden'); });
            }
        }
        
        self.F.showTab = f(ind) {
            map(self.V.tab,  f(node) { node.remCls('active-tab'); });
            map(self.V.cont, f(node) { node.addCls('hide'); });
            self.V.tab[ind].addCls('active-tab');
            self.V.cont[ind].remCls('hide');
            
            var table = self.table = _jO(self.V.table[ind]);
            var key = table.D.selector;
            
            self.selector = (db.selectRules[table.attr('data-selector')]||db.selectRules.def);
            
            self.curPage = 0;
            self.F.reqBy(self.F.buildTable);
            
            if ( self.V.paginator ) {
                insAfter(self.V.paginator, table);
            }
            
            map(self.V.typemarks, f(typemark) { typemark.val = typemark._startVal; });
           
            self.curTab = ind;
        }
        
        
        self.F.buildTable = f() {
            self.table.lines = self.table.lines || [];
            var td = []; map(self.table.lines, f(v) { td.push(v); });
            
            map(self.curList, f(dt) { self.F.buildLine(dt); })
            map(td, detach);
            
        }
        
        self.F.buildLine = f(obj) {
            var view = VIEW['transaction-table1'](obj);
            self.table.attach(view);
            self.table.lines.push(view);
        }
        
        self.F.buildPaginator = f() {
            if ( !self.V.paginator ) { return 0; }
            self.V.paginator.innerHTML = '';
            
            if ( self.totalPages > 1 ) {
                var btns = [];
                RNG(self.totalPages).each(f(ind) {
                    var nBtn = self.V.paginator.cr('div','asBtn').VAL(ind+1);
                    nBtn._selfInd = ind;
                    nBtn.onclick = f() {
                        self.curPage = this._selfInd;
                        self.F.reqBy(self.F.rebuild);
                    }
                    btns.push(nBtn);
                });
                
                btns[self.curPage].addCls('active');
            }
        }
        
        
        
        
        map(self.V.typemarks, f(typemark) { typemark._startVal = typemark.val; });
        
        map(self.V.tab, function(tab, i) {
            tab._selfKey = i;
            clearEvents(tab).onclick = function() {
                self.F.showTab(this._selfKey);
            }
        });
        
        
        
        
        map(S('.mk_filteronclick', self), f(btn) {
            clearEvents(btn).onclick = function() {
                map(self.V.typemarks, f(typemark) { typemark.val = btn.textContent; });
                self.selector = (db.selectRules[btn.attr('data-selector')]||db.selectRules.def);
                self.F.reqBy(self.F.buildTable);
            }
        });
        
        
        
        self.F.rebuild = f() {
            self.F.buildTable();
        }
        self.F.showTab(self.curTab);
        
        
        //-ORM.onModel('transaction', CEF(self.F.rebuild));
        
        ENGINE._clear.push(function() {
            ORM.remOnModel(self.F.rebuild);
        });
    },
    
    selectRules: lsMapToDict({
        'def,exchange': f(self, db, func) {
            
            self.exportUrlpart = ['all',glob('token')].join('/');
            
            ORM.req('transaction:select', func, {
                selector: { owner_id:['=',PAGE.user.id]},
                rng: [self.curPage*db.itemsPerPage, db.itemsPerPage]
            });
            
        },
        'interest': f(self, db, func) {
            
            self.exportUrlpart = ['interest',glob('token')].join('/');
            
            ORM.req('transaction:select', func, {
                selector: { owner_id:['=',PAGE.user.id], tstatus:['=',CONF.project.transactionInterest]},
                rng: [self.curPage*db.itemsPerPage, db.itemsPerPage]
            });
            
        },
        'fill': f(self, db, func) {
            var lst = RNG(ORM.model.exchange).filter(f(exch) {
                return PAGE.userData.currencyAcEq.contains(exch._rel.out_currency);
            });
            
            self.exportUrlpart = ['byexchangelist',glob('token'), lst.join('_')].join('/');
            
            ORM.req('transaction:select', func, {
                selector: {
                    exchange_id:['in',lst.map(f(obj) { return obj.id; })],
                    owner_id:['=',PAGE.user.id]
                },
                rng: [self.curPage, db.itemsPerPage]
            });
            
        },
        'transfer': f(self, db, func) {
            var lst = RNG(ORM.model.exchange).filter(f(exch) {
                return PAGE.userData.currencyAcEq.contains(exch._rel.in_currency);
            });
            
            self.exportUrlpart = ['byexchangelist',glob('token'), lst.join('_')].join('/');
            
            ORM.req('transaction:select', func, {
                selector: {
                    exchange_id:['in',lst.map(f(obj) { return obj.id; })],
                    owner_id:['=',PAGE.user.id]
                },
                rng: [self.curPage, db.itemsPerPage]
            });
            
        },
        'convert': f(self, db, func) {
            var lst = RNG(ORM.model.exchange).filter(f(exch) {
                return PAGE.userData.currencyAcEq.contains(exch._rel.in_currency) && PAGE.userData.currencyAcEq.contains(exch._rel.out_currency);
            });
            
            self.exportUrlpart = ['byexchangelist',glob('token'), lst.join('_')].join('/');
            
            ORM.req('transaction:select', func, {
                selector: {
                    exchange_id:['in',lst.map(f(obj) { return obj.id; })],
                    owner_id:['=',PAGE.user.id]
                },
                rng: [self.curPage, db.itemsPerPage]
            });
            
        },
        'bonuses':f(self, db, func) {
            var min = ENGINE.decMult/100;
            
            self.exportUrlpart = ['bonus',glob('token'), min].join('/');
            
            ORM.req('transaction:select', func, {
                selector: {
                    bonus:['>=',min],
                    owner_id:['=',PAGE.user.id]
                },
                rng: [self.curPage, db.itemsPerPage]
            });
        },
        'referer':f(self, db, func) {
            
            self.exportUrlpart = ['referer',glob('token')].join('/');
            
            getRawData(['/_view/ru/transaction_by_referrer/',glob('token'),'/',self.curPage,'/'].join(''), f(data) {
                
                PROTOCOL.api.read(data, null, f(obj, raw) {
                    func(RNG(obj.transaction), obj, raw);
                });
            });
        }
    })
});






















