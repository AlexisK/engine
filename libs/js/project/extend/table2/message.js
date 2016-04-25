

new eTable2('message', {
    level:%levelSuper,
    fields: parseLS('id,ctime,mtime,text,ticket_id,owner_id'),
    fieldFunc: {
        'ctime,mtime' : TVIEW.time
    },
    filter: {
        'id'            : TINP.number,
        'ctime,mtime'   : TINP.rangeTime
    },
    sorter: parseLS('id,ctime,mtime,ticket_id,owner_id'),
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
        return node;
    },
    prep: 'ticket'
});



