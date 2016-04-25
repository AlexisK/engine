

new eProcessor('userwallet', {
    process: function(self, db) {
        _jO(self);
        self.V.walletsWrap = S('.mk_wallets_wrap', self)[0];
        self.wallets_target  = S('.mk_userwallet_wallets', self)[0];
        //-self.wallets_curlist = S('.mk_userwallet_list_currency', self)[0];
        self.V.wallets_curlist = cr('ul', 'mk_userwallet_list_currency');
        map(PAGE.userData.currencyAcEq, f(cur, i) {
            var node = self.V.wallets_curlist.cr('li');
            node.innerHTML = ORM.lang(cur)||cur.displayname;            
            node._selfCur = cur;
            
            node.onclick = f() {
                db.setTotal(self, db, this._selfCur);
            }
        });
        if ( !self.wallets_target ) { return 0; }
        self.C.inWallet;
        if ( PAGE.userData.acwallet && PAGE.userData.acwallet.length > 0 ) {
            map(PAGE.userData.acwallet, f(wallet) {
                self.wallets_target.attach(VIEW.userwallet(wallet));
                if ( !def(self.C.inWallet) && wallet.amount > 0 ) {
                    self.C.inWallet = wallet;
                }
            });
            if ( !def(self.C.inWallet) ) { self.C.inWallet = PAGE.userData.acwallet[0]; }
            
            var out_cur = PAGE.userData.currencyAcEq.filter({displayname:'USD'})[0];
            
            if ( out_cur ) {
                db.setTotal(self, db, out_cur);
            }
            
            /*
            if ( self.wallets_curlist ) {
                var row;
                map(PAGE.userData.currencyAcEq, f(cur, i) {
                    if ( i % 2 == 0 ) {
                        row = self.wallets_curlist.cr('tr');
                    }
                    var node = VIEW['cur-table-item'](cur);
                    row.attach(node);
                    
                    node._selfCur = cur;
                    
                    node.onclick = f() {
                        db.setTotal(self, db, this._selfCur);
                    }
                })
            }
            */

            
        }
        
    },
    setTotal: f(self, db, out_cur) {
        var total = db.calcTotal(self, db, out_cur);
        var dummyWallet = {
            _rel: {
                accurrency: {
                    name:out_cur.displayname.toLowerCase()
                }
            },
            amount: total,
            displayprefix: '=',
            cur_node: self.V.wallets_curlist
        };
        if ( self.currentTotalBlock ) { detach(self.currentTotalBlock); }
        
        self.currentTotalBlock = VIEW.userwalletTotal(dummyWallet);
        self.V.convertBtn = self.currentTotalBlock.cr('div', 'inp-block').cr('div', 'asBtn');
        self.V.convertBtn.VAL(PAGE.ld('convert'));
        evt(self.V.convertBtn, 'click', f() {
            var inCurName = 'ac_' + self.C.inWallet._rel.accurrency.name,
                outCurName = out_cur.name,
                url = '/' + PAGE.lang + '/exchange/' + inCurName + '/' + outCurName + '/0/';
            LM.go(url);
        });
        self.V.walletsWrap.attach(self.currentTotalBlock);
    },
    calcTotal: f(self, db, out_cur) {
        var result = 0;
        
        map(PAGE.userData.acwallet, f(wallet) {
            
            var ac_in_cur = wallet._rel.accurrency;
            var in_cur = PAGE.userData.currencyAcEq.filter({accurrency_id:ac_in_cur.id})[0];
            
            if ( in_cur == out_cur ) {
                result += wallet.amount;
            } else if ( in_cur ) {
                var exch = RNG(ORM.model.exchange).filter({
                    in_currency_id:in_cur.id,
                    out_currency_id:out_cur.id
                })[0];
                
                if ( exch ) {
                    var calcData = calcObj.calcExchange(exch, {
                        in_sum: wallet.amount
                    });
                    
                    result += calcData.out_sum||0;
                }
            }
            
        });
        
        return result;
    }
});















