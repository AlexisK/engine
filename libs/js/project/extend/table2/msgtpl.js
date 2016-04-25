

new eTable2('msgtpl', {
    level:%levelModerator,
    fields: parseLS('id,mtime,type,name'),
    fieldFunc: {
        'mtime'  : TVIEW.time
    },
    filter: {
        'id'        : TINP.number,
        'type,name' : TINP.like,
        'mtime'     : TINP.rangeTime
    },
    sorter: parseLS('id,mtime'),
    
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
        if ( !obj.type ) {
            node.addCls('error');
            info.add('error','no type');
        }
        if ( !obj.langdata || !obj.langdata.subj ) {
            node.addCls('warning');
            info.add('warning','no subject');
        }
        if ( !obj.src ) {
            node.addCls('warning');
            info.add('warning','no content');
        }
        
        return node;
    }
});



