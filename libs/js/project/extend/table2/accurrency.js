

new eTable2('accurrency', {
    level: %levelAdmin,
    fields: parseLS('id,name,mtime,deposit'),
    fieldFunc: {
        'deposit'   : TVIEW.deposit
    },
    filter: {
        'id'        : TINP.number,
        'name'      : TINP.like,
        'mtime'     : TINP.rangeTime,
        'deposit'   : TINP.rangeDec
    },
    sorter: parseLS('id,name'),
    rowGen: function(obj) {
        var node = cr('tr');
        return node;
    }
});


