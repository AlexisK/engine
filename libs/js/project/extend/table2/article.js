

new eTable2('article', {
    level:%levelManager,
    strs: {
        is_important: 'Важн',
        is_published: 'Публ'
    },
    fields: parseLS('id,urlpart,title,category_id,displaydate,views,is_important,is_published'),
    fieldFunc: {
        'displaydate'  : TVIEW.time,
        'category_id'  : TVIEW.rel,
        'is_important,is_published' : TVIEW.bool,
        'urlpart'      : TVIEW.link
    },
    colCls: {
        'is_important,is_published' : 'chb'
    },
    filter: {
        'id'            : TINP.number,
        'title,urlpart' : TINP.like,
        'views'         : TINP.rangeNumber,
        'displaydate'   : TINP.rangeTime,
        'category_id'   : f(self, f) { return TINP.modelDropdown(self,f,'category'); },
        'is_important,is_published'  : TINP.bool
    },
    sorter: parseLS('id,category_id,displaydate,views'),
    
    rowGen: createPageRow(f(obj, node, info) {
        if ( !obj.is_published ) { info.add('error', 'unpublished');    node.addCls('red'); }
        if ( !obj.displaydate )  { info.add('error', 'no displaydate'); node.addCls('red'); }
        
    }),
    prep: 'category'
});



