

new eTable2('currency', {
    level:%levelSupport,
    fields: parseLS('id,displayname,paysystem_id,accurrency_id,display_mult,display_offset,display_total,is_active'),
    fieldFunc: {
        'paysystem_id'  : function(obj, key) { return TVIEW.currency(obj, 'id'); },
        'accurrency_id' : TVIEW.rel,
        'display_mult,display_offset,display_total' : TVIEW.dec,
        'is_active'     : TVIEW.bool
    },
    cls: 'exch-table',
    colCls: {
        'is_active' : 'chb'
    },
    filter: {
        'id'            : TINP.number,
        'is_active'     : TINP.bool,
        'paysystem_id'  : function(self, f) { return TINP.modelDropdown(self,f,'paysystem'); },
        'accurrency_id' : function(self, f) { return TINP.modelDropdown(self,f,'accurrency'); },
        'displayname'   : TINP.like,
        'display_mult,display_offset,display_total' : TINP.rangeDec
    },
    sorter: parseLS('id,paysystem_id,is_active'),
    rowGen: function(obj) {
        var node = cr('tr', 'green');
        var info = new ST(node);
        info.title = ORM.getVisName(obj);
        
        var selfPs = ORM.rel(obj, 'paysystem');
        if ( !obj.is_active ) { info.add('error', 'inactive'); node.addCls('red'); }
        if ( !obj.displayname || obj.displayname.rp(/\s+/g).length == 0 ) {
            info.add('error', 'no displayname');
            node.addCls('error');
        }
        
        var cofs = RNG(ORM.model.coffer).filter({
            currency_id:obj.id,
            is_active: true
        });
        
        info.add('link', TSTMenu.table('paysystem', { id: ['=',obj.paysystem_id] }));
        info.add('link', TSTMenu.table('coffer',    { currency_id: ['=',obj.id] }));
        
        
        if ( !selfPs.is_active ) {
            info.add('warning', 'paysystem inactive');
            node.addCls('warning');
        }
        
        if ( cofs.length == 0 ) {
            info.add('warning', 'no active coffers found');
            node.addCls('warning');
        }
        
        return node;
    },
    lineHeight: 38
});



