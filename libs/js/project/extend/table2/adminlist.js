

new eTable2('adminlist', {
    level:%levelModerator,
    strs: {
    },
    fields: parseLS('id,type,data,is_black,ctime'),
    fieldFunc: {
        'ctime'    : TVIEW.time,
        'is_black' : TVIEW.bool
    },
    filter: {
        'id'        : TINP.number,
        'ctime'     : TINP.rangeTime,
        'is_black'  : TINP.bool,
        'type,data' : TINP.like
    },
    sorter: parseLS('id,ctime'),
    rowGen: function(obj) {
        var node = cr('tr');
        
        if ( obj.type.replace(/\s+/g,'').length == 0 || obj.data.replace(/\s+/g,'').length == 0 ) {
            node.addCls('fatal');
            return node;
        }
        
        if ( obj.is_black ) { node.addCls('warning'); } else { node.addCls('blue'); }
        
        return node;
    },
    //-timeRange: 'ctime',
    lineHeight: 38
});



