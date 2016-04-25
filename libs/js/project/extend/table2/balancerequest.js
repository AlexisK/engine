

new eTable2('balancerequest', {
    level:%levelModerator,
    fields: parseLS('id,ctime,paysystem_id,currency_id,amount,email'),
    fieldFunc: {
        'ctime':TVIEW.time,
        'amount':TVIEW.dec,
        'currency_id':TVIEW.currency,
        'paysystem_id': f(obj, key) { return ORM.getVisName(ORM.O('currency_'+obj.currency_id)._rel.paysystem); }
    },
    cls: 'exch-table',
    filter: {
        'id'    : TINP.number,
        'email' : TINP.like,
        'ctime' : TINP.rangeTime,
        'amount' : TINP.rangeDec,
        'currency_id'  : f(self, f) { return TINP.modelDropdown(self,f,'currency'); },
        'paysystem_id' : f(self, f) { return TINP.modelJoinDropdown(self,f,'currency', 'paysystem'); }
    },
    sorter: parseLS('id'),
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
        return node;
    }
});



