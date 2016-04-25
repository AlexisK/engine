

new eTable2('acwallet', {
    level:%levelAdmin,
    fields: parseLS('id,owner_id,accurrency_id,amount,deposit_amount,deposit_surplus'),
    fieldFunc: {
        'amount,deposit_amount,deposit_surplus': TVIEW.dec,
        'is_active'   : TVIEW.bool,
        'accurrency_id' : TVIEW.rel
    },
    filter: {
        'id,owner_id' : TINP.number,
        'amount,deposit_amount,deposit_surplus' : TINP.rangeDec,
        'is_active'   : TINP.bool,
        'accurrency_id' : f(self, f) { return TINP.modelDropdown(self,f,'accurrency'); }
    },
    sorter: parseLS('id'),
    rowGen: function(obj) {
        var node = cr('tr', 'green');
        var info = new ST(node);
        info.title = ORM.getVisName(obj);
        
        info.add('link', TSTMenu.table('accurrency', { id: ['=',obj.accurrency_id] }));
        info.add('link', TSTMenu.table('user', { id: ['=',obj.owner_id] }));
        
        if ( !obj.amount || obj.amount < (1000).fromDec() ) {
            info.add('warning', 'running out');
            node.addCls('warning');
        }
        
        return node;
    },
    prep: 'accurrency',
    lineHeight: 38
});




