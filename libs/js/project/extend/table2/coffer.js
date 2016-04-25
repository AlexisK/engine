

new eTable2('coffer', {
    level:%levelAdmin,
    fields: parseLS('id,name,currency_id,amount,is_active'),
    fieldFunc: {
        'amount'      : function(obj, key) { return toDec(obj[key]); },
        'currency_id' : TVIEW.currency,
        'is_active'   : TVIEW.bool
    },
    cls: 'exch-table',
    colCls: {
        'currency_id' : 'cur bl',
        'amount'      : 'cur'
    },
    filter: {
        'id'          : TINP.number,
        'amount'      : TINP.rangeDec,
        'is_active'   : TINP.bool,
        'currency_id' : function(self, f) { return TINP.modelDropdown(self,f,'currency'); },
        'name'        : TINP.like
    },
    sorter: parseLS('id,name,created_at,currency_id,amount,is_active'),
    rowGen: function(obj) {
        var node = cr('tr', 'green');
        var info = new ST(node);
        info.title = ORM.getVisName(obj);
        
        info.add('link', TSTMenu.table('currency', { id: ['=',obj.currency_id] }));
        
        if ( !obj.is_active ) { info.add('error', 'inactive'); node.addCls('red'); }
        if ( !obj.amount || obj.amount < (1000).fromDec() ) {
            info.add('warning', 'running out');
            node.addCls('warning');
        }
        
        return node;
    },
    prep: 'paysystem',
    lineHeight: 38
});



