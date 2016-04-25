

new eTable2('ratespage', {
    level:%levelManager,
    fields: parseLS('id,title,displaydate,views,is_important,is_published'),
    fieldFunc: {
        'displaydate'  : TVIEW.time,
        'exchange_id'  : TVIEW.rel,
        'is_published' : TVIEW.bool,
        'urlpart'      : TVIEW.link
    },
    colCls: {
        'is_published' : 'chb'
    },
    filter: {
        'id'            : TINP.number,
        'title,urlpart' : TINP.like,
        'views'         : TINP.rangeNumber,
        'displaydate'   : TINP.rangeTime,
        'is_important,is_published'  : TINP.bool
    },
    sorter: parseLS('id'),
    
    rowGen: createPageRow(f(obj, node, info) {
        if ( !obj.is_published ) { info.add('error', 'unpublished');    node.addCls('red'); }
        if ( !obj.displaydate )  { info.add('error', 'no displaydate'); node.addCls('red'); }
    })
});



