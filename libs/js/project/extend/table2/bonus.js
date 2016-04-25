

new eTable2('bonus', {
    level:%levelModerator,
    fields: parseLS('id,name,langdata.'+PAGE.lang+'.title,points,surplus,is_active'),
    fieldFunc: {
        is_active:TVIEW.bool,
        'points,surplus':TVIEW.dec
    },
    filter: {
        'id'             : TINP.number,
        'name'           : TINP.like,
        'points,surplus' : TINP.rangeDec,
        'is_active'      : TINP.bool
    },
    sorter: parseLS('id,name,points,surplus'),
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
        if ( !obj.is_active ) {
            node.addCls('red');
        }
        
        return node;
    }
});



