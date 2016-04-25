

new eTable2('exchpage', {
    level:%levelManager,
    fields: parseLS('id,title,exchange_id,displaydate,views,is_important,is_published'),
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
        'exchange_id'   : f(self, f) { return TINP.modelDropdown(self,f,'exchange'); },
        'is_important,is_published'  : TINP.bool
    },
    sorter: parseLS('id'),
    
    rowGen: createPageRow(f(obj, node, info) {
        if ( !obj.is_published ) { info.add('error', 'unpublished');    node.addCls('red'); }
        if ( !obj.displaydate )  { info.add('error', 'no displaydate'); node.addCls('red'); }
        
    })
});



