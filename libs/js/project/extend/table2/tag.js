

new eTable2('tag', {
	level:%levelModerator,
	strs: {
        is_important: 'Важн'
    },
    fields: parseLS('id,urlpart,title,order,views'),
    filter: {
        'id,order'      : TINP.number,
        'title,urlpart' : TINP.like,
        'views'         : TINP.rangeNumber,
    },
    sorter: parseLS('id,rank,is_important'),
    rowGen: function(obj) {
        var node = cr('tr');
        
        if ( obj.is_important ) { node.addCls('green'); }
        if ( obj.langdata && obj.langdata[PAGE.lang] && RNG(obj.langdata[PAGE.lang]).length > 0 ) {
            node.addCls('warning');
        }
        
        return node;
    }
});



