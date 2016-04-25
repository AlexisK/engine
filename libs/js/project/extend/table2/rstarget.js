

new eTable2('rstarget', {
    level:%levelAdmin,
    fields: parseLS('id,title,in_accurrency_id,out_accurrency_id,ratesource_id,margin,is_active'),
    fieldFunc: {
        'in_accurrency_id,out_accurrency_id,ratesource_id' : TVIEW.rel,
        'is_active'    : TVIEW.bool,
        'margin'       : TVIEW.dec
    },
    colCls: {
        'is_active' : 'chb'
    },
    filter: {
        'id'        : TINP.number,
        'is_active' : TINP.bool,
        'in_accurrency_id,out_accurrency_id' : f(self, f) { return TINP.modelDropdown(self,f,'accurrency'); },
        'ratesource_id' : f(self, f) { return TINP.modelDropdown(self,f,'ratesource'); },
        'margin'    : TINP.rangeDec
    },
    sorter: parseLS('id'),
    rowGen: function(obj) {
        var node = cr('tr', 'green');
        var info = new ST(node);
        
        return node;
    },
    lineHeight: 18,
    prep: 'accurrency,ratesource'
});



