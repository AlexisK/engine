

new eTable2('pstatic,newsitem,instruction,faq', {
    fields: parseLS('id,urlpart,title,views,is_important,is_published'),
    fieldFunc: {
        'is_important,is_published' : TVIEW.bool,
        'urlpart' : TVIEW.link
    },
    filter: {
        'id'            : TINP.number,
        'title,urlpart' : TINP.like,
        'views'         : TINP.rangeNumber,
        'is_important,is_published'  : TINP.bool
    },
    sorter: parseLS('id,views'),
    rowGen: createPageRow()
});



