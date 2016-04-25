
var CASH = new eStorage('cash', {
    sharedWith: STORAGE.orm,
    getPSCoffers: function(self, ps) {
        var result = {};
        
        if ( typeof(ps) == 'string' ) { ps = self.O(ps); }
        var result = {};
        
        map(filterObjects(objToArray(self.model.currency), {paysystem_id: ps.id}), function(currency) {
            result[currency.id] = [currency, {}];
        });
        
        mapO(self.model.coffer, function(coffer) {
            if ( result[coffer.currency_id] ) {
                var obj = result[coffer.currency_id];
                obj[1][coffer.id] = coffer;
            }
        });
        
        return result;
    },
    getPSBallance: function(self, ps) {
        var result = {};
        
        if ( typeof(ps) == 'string' ) { ps = self.O(ps); }
        var result = {};
        
        map(filterObjects(objToArray(self.model.currency), {paysystem_id: ps.id}), function(currency) {
            result[currency.id] = [currency, 0];
        });
        
        mapO(self.model.coffer, function(coffer) {
            if ( result[coffer.currency_id] ) {
                var obj = result[coffer.currency_id];
                obj[1] += coffer.amount;
            }
        });
        
        return result;
    },
    
    commisionFields: parseLS('amount,percent,min,max'),
    commisionMap:    parseLS('customer,exchange'),
    commisionExchange:    parseLS('service'),
    
    normaliseForUpdate: function(self, obj) {
        if ( typeof(obj) != 'object' ) { return obj; }
        var result = {};
        
        mapO(obj, function(val, key) {
            if ( !CONF.object.orm.ignoreFields.contains(key) ) {
                result[key] = self.data.normaliseForUpdate(self, val);
            }
        });
        
        return result;
    },
    
    normaliseExchanges: function(self) {
        
        var calcs = self.data._normaliseExchanges(self, RNG(CASH.model.exchange));
        
        self.calc = calcs.calc;
        self.calcMap = calcs.calcMap;
        self.psMap = calcs.psMap;
        self.psMapByCur = calcs.psMapByCur;
        self.curMap = calcs.curMap;
        
    },
    _normaliseExchanges: function(self, rawexch) {
        var exch = rawexch.filter(f(val) {
            return ( val.blockers == 0) && ( (val.lvl||0) <= PAGE.level );
        });
        var calcs = {};
        
        calcs.calc = {
            rawexchanges: rawexch,
            exchanges : RNG(),
            coffers   : RNG(CASH.model.coffer),
            in_cur    : RNG(),
            out_cur   : RNG(),
            in_ps     : RNG(),
            out_ps    : RNG()
        };
        calcs.calcMap = {};
        calcs.psMap = {
            in  : {},
            out : {}
        };
        calcs.psMapByCur = {
            in  : {},
            out : {}
        };
        calcs.curMap = {
            in  : {},
            out : {}
        };
        
        
        map(exch, function(exchange) {
            var cur_in_obj   = exchange._rel.in_currency;
            var cur_out_obj  = exchange._rel.out_currency;
            var ps_in_obj    = cur_in_obj._rel.paysystem;
            var ps_out_obj   = cur_out_obj._rel.paysystem;
            
            
//-            if (     cur_in_obj.is_active &&  cur_in_obj.is_active_in
//-                 && cur_out_obj.is_active && cur_out_obj.is_active_out
//-                 &&   ps_in_obj.is_active &&   ps_in_obj.is_active_in
//-                 &&  ps_out_obj.is_active &&  ps_out_obj.is_active_out ) {
            {
                calcs.calc.exchanges.push(exchange);
                calcs.calc.in_cur.add(cur_in_obj);
                calcs.calc.out_cur.add(cur_out_obj);
                calcs.calc.in_ps.add(ps_in_obj);
                calcs.calc.out_ps.add(ps_out_obj);
                
                calcs.psMap.in [ps_in_obj.id]  = calcs.psMap.in[ps_in_obj.id] || RNG();
                calcs.psMap.in [ps_in_obj.id] .add(ps_out_obj);
                calcs.psMap.out[ps_out_obj.id] = calcs.psMap.out[ps_out_obj.id] || RNG();
                calcs.psMap.out[ps_out_obj.id].add(ps_in_obj);
                
                
                
                calcs.curMap.in [cur_in_obj.id]  = calcs.curMap.in[cur_in_obj.id] || RNG();
                calcs.curMap.in [cur_in_obj.id] .add(cur_out_obj);
                calcs.curMap.out[cur_out_obj.id] = calcs.curMap.out[cur_out_obj.id] || RNG();
                calcs.curMap.out[cur_out_obj.id].add(cur_in_obj);
                
                calcs.psMapByCur.in[cur_in_obj.id] = calcs.psMapByCur.in[cur_in_obj.id] || RNG();
                calcs.psMapByCur.in[cur_in_obj.id].add(ps_out_obj);
                calcs.psMapByCur.out[cur_out_obj.id] = calcs.psMapByCur.out[cur_out_obj.id] || RNG();
                calcs.psMapByCur.out[cur_out_obj.id].add(ps_in_obj);
                
                var step1 = calcs.calcMap[ps_in_obj.id] = calcs.calcMap[ps_in_obj.id] || {};
                var step2 = step1[cur_in_obj.id]       = step1[cur_in_obj.id]       || {};
                var step3 = step2[ps_out_obj.id]       = step2[ps_out_obj.id]       || {};
                var step4 = step3[cur_out_obj.id]      = exchange;
                
            }
            
        });
        
        
        return calcs;
    }
},'getPSCoffers,getPSBallance,normaliseForUpdate,normaliseExchanges');


map(parseLS('transaction,currency,exchange,coffer,paysystem'),function(key) {
    CASH.model[key] = CASH.model[key] || {};
});


CASH.data.commisionMapR = CASH.data.commisionMap.sl('::-1');

























