

new eTable2('session', {
    level:%levelModerator,
    fields: parseLS('id,ctime,expiry,ip,ua,owner_id'),
    fieldFunc: {
        'ctime,expiry':TVIEW.time,
        'ua': f(obj, key) { return PARSE.useragent(obj[key]); }
    },
    filter: {
        'id,owner_id'    : TINP.number,
        'ctime,expiry'   : TINP.rangeTime,
        'ip,ua'          : TINP.like
    },
    sorter: parseLS('id'),
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
        return node;
    }
});



