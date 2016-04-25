

new eTable2('exchange', {
    level: %levelModerator,
    fields: parseLS('id,in_currency_id,out_currency_id,rate,blockers,is_auto,is_active'),
    fieldFunc: {
        'in_currency_id,out_currency_id'    : TVIEW.rate,//-      function(obj, key) { return TVIEW.entity('currency', obj, key); },
        'rate'              : f(obj,key){ return(obj[key]||0).toDec(ENGINE.decPrecision); },
        'is_auto,is_active' : TVIEW.bool
    },
    cls: 'exch-table',
    colCls: {
        'in_currency_id,out_currency_id' : 'cur bl',
        'raterev.i,raterev.o'            : 'cur',
        'rate.i,rate.o'                  : 'cur'
    },
    filter: {
        'id'                             : TINP.number,
        'is_auto,is_active'              : TINP.bool,
        'blockers'                       : TINP.rangeNumber,
        'rate'                           : TINP.rangeDec,
        'in_currency_id,out_currency_id' : function(self, f) { return TINP.modelDropdown(self,f,'currency'); }
    },
    sorter: parseLS('id,in_currency_id,out_currency_id,is_auto,is_active'),
    rowGen: function(obj) {
        var node = cr('tr','green');
        var info = new ST(node);
        
        if ( !obj.is_active ) { info.add('error', 'inactive'); node.addCls('red'); }
        if ( obj.blockers )   { info.add('error', 'blocked');  node.addCls('red'); }
        
        //-var prop = ( obj.rate.i / obj.rate.o - obj.raterev.o / obj.raterev.i ).fromDec().toDec();
        //-info.add('info', 'proportion '+prop);
        //-if ( prop < 0 ) {
        //-    info.add('error', 'proportion');
        //-    node.addCls('red');
        //-}
        
        
        var ic = ORM.O('currency_'+obj.in_currency_id);
        var oc = ORM.O('currency_'+obj.out_currency_id);
        info.title = [ORM.getVisName(ic), ORM.getVisName(oc)].join(' ');
        
        info.add('link', TSTMenu.table('currency', { id: ['=',ic.id] }, 'in currency'));
        info.add('link', TSTMenu.table('currency', { id: ['=',oc.id] }, 'out currency'));
        
        if ( !ic.is_active ) {
            info.add('warning', 'in currency inactive');
            node.addCls('warning');
        }
        if ( !oc.is_active ) {
            info.add('warning', 'out currency inactive');
            node.addCls('warning');
        }
        
        
        info.onshow = f() {
            if ( obj.ratesource_id ) {
                ORM.req(['ratesource_',obj.ratesource_id,':select'].join(''), f(list) {
                    
                    var rs = list[0];
                    if ( rs && rs.is_active ) {
                        var btn = cr('div','asBtn').VAL(PAGE.ld('ratesource: fetch rates'));
                        btn.onclick = f() { ORM.req(rs._oid+':fetchrates', SYS.success); }
                        info.add('link', btn);
                    }
                    
                })
            }
        }
        
        
        return node;
    },
    lineHeight: 38
});



