

new eTable2('wallet', {
    level:%levelModerator,
    fields: parseLS('id,mtime,displayname,owner_id,currency_id'),
    fieldFunc: {
        'is_active'   : TVIEW.bool,
        'mtime'       : TVIEW.time,
        'currency_id' : TVIEW.currency
    },
    cls: 'exch-table',
    filter: {
        'id,owner_id' : TINP.number,
        'displayname' : TINP.like,
        'mtime'       : TINP.rangeTime,
        'currency_id' : f(self, f) { return TINP.modelDropdown(self,f,'currency'); }
    },
    sorter: parseLS('id'),
    rowGen: function(obj) {
        var node = cr('tr', 'green');
        var info = new ST(node);
        
        
        info.add('link', TSTMenu.table('user', { id: ['=',obj.owner_id] }));
        info.add('link', TSTMenu.table('currency', { id: ['=',obj.currency_id] }));
        
        return node;
    },
    lineHeight: 38
});




