new eProcessor('viewinnercalc', {
    process: function(self, db) {
        _jO(self);
        
        self.V = selectorMapping(self, {});
        
        self.V.btns = S('.mk_btn', self);
        
        map(['in','convert','out'], function(key, i) {
            var btn = self.V.btns[i];
            self.V['btn_'+key] = btn;
            btn._selfKey = key;
            clearEvents(btn.parentNode);
            btn.onclick = f() {
                db.choseTab(self, db, this._selfKey);
            }
        });
        
        tm(f() {
            db.choseTab(self, db, 'in');
        });
        
        self.target = S(PROCESSOR.viewcalc.data.selector, self)[0];
        
    },
    choseTab: f(self, db, tab) {
        map(self.V.btns, function(node) { node.remCls('active'); });
        self.V['btn_'+tab].addCls('active');
        
        (db.tabRule[tab] || db.tabRule.def)(db, self.target);
    },
    
    filterPs: f(list, key, val){
        var result = [];
        
        map(list, f(exch) {
            var cur = ORM.rel(exch, key+'_currency');
            var ps  = ORM.rel(cur, 'paysystem');
            if ( ps == val ) { result.push(exch); }
        });
        
        return result;
    },
    
    tabRule: {
        def: f(db, node) {
            node.setRestrictions(RNG(CASH.model.exchange));
        },
        in: f(db, node) {
            node.setRestrictions(  db.filterPs(RNG(CASH.model.exchange), 'out', ORM.O('paysystem_ac'))  );
        },
        convert: f(db, node) {
            var list = db.filterPs(RNG(CASH.model.exchange), 'out', ORM.O('paysystem_ac'));
            list = db.filterPs(list, 'in', ORM.O('paysystem_ac'));
            
            node.setRestrictions(  list  );
        },
        out: f(db, node) {
            node.setRestrictions(  db.filterPs(RNG(CASH.model.exchange), 'in', ORM.O('paysystem_ac'))  );
        }
    }
});



















