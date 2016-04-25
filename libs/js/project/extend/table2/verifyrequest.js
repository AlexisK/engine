
new eTable2('verifyrequest', {
    level:%levelSupport,
    fields: parseLS('id,ctime,mtime,owner_id,responsible_id,msg,is_accepted'),
    fieldFunc: {
        'ctime,mtime' : TVIEW.time,
        'is_accepted' : TVIEW.boolReadonly
    },
    filter: {
        'id,owner_id,responsible_id' : TINP.number,
        'msg'                       : TINP.line,
        'ctime,mtime'               : TINP.rangeTime,
        'is_accepted'           : TINP.bool4
    },
    sorter: parseLS('id'),
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
        if ( obj.is_accepted == true ) {
            node.addCls('green');
        } else if ( obj.is_accepted == false ) {
            node.addCls('red');
        }
        
        return node;
    },
    lineHeight: 17
});
