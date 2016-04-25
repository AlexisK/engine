

new eTable2('ratesource', {
    level:%levelAdmin,
    fields: parseLS('id,name,lastfetch,is_active'),
    fieldFunc: {
        'lastfetch' : TVIEW.time,
        'is_active' : TVIEW.bool
    },
    filter: {
        'id'        : TINP.number,
        'name'      : TINP.like,
        'lastfetch' : TINP.rangeTime,
        'is_active' : TINP.bool
    },
    sorter: parseLS('id'),
    rowGen: function(obj) {
        var node = cr('tr', 'green');
        var info = new ST(node);
        
        if ( obj.is_active ) {
            var btn = cr('div','asBtn').VAL(PAGE.ld('fetch rates'));
            btn.onclick = f() { ORM.req(obj._oid+':fetchrates', SYS.success); }
            info.add('link', btn);
        }
        
        return node;
    },
    lineHeight: 18
});



