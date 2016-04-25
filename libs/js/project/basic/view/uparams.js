

new eView('uparams', {
    create: f() { return _jO(cr('div')); },
    init: f(self, currency) {
        var conf = PS[currency._rel.paysystem.name];
        
        dispatchOnUpdate(self);
        
        if ( !conf ) { return 0; }
        
        var upd = {};
        var elems = {};
        
        self.F.addKey = f(key, field) {
            var params = UPARAMS.cont[key];
            
            var walletList = RNG(PAGE.userData.wallet||[]).filter({
                currency_id: currency.id
            });
            var optsList = [];
            map(walletList, f(wallet) {
                optsList.push(wallet.displayname);
            });
            
            
            var view = VIEW.input_ddtext(optsList);
            self.attach(view);
            view.label = [PAGE.ld(params.title),' (',params.ph,')'].join('');
            
            view.V.input.onupdate(f(val){
                if ( params.validator(view.V.input) ) {
                    upd[field] = val;
                    //-log(currency, val);
                    glob(['user_coffer',field,currency.name].join('_'), val);
                } else {
                    delete upd[field];
                }
                self.C._emitUpdated();
            });
            
            elems[field] = view;
            
            var saved = glob(['user_coffer',field,currency.name].join('_'));
            if ( saved ) { view.val = saved; }
            
        }
        mapO(conf.inputs, self.F.addKey);
        
        $P(self, 'val', f() {
            return upd;
        }, f(data) {
            mapO(data, f(val, k) {
                if ( def(val) && elems[k] ) {
                    elems[k].val = val;
                }
            });
        });
        
    }
});

