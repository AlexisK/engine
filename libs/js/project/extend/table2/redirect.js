

new eTable2('redirect', {
    strs: {
        is_permanent: 'постоянный'
    },
    fields: parseLS('id,name,url,is_permanent'),
    fieldFunc: {
        'is_permanent' : TVIEW.bool
    },
    filter: {
        'id'   : TINP.number,
        'name,url' : TINP.like,
        'is_permanent' : TINP.bool
    },
    sorter: parseLS('id,is_permanent'),
    rowGen: function(obj) {
        var node = cr('tr');
        
        if ( obj.is_permanent ) { node.addCls('green'); }
        
        return node;
    },
});



