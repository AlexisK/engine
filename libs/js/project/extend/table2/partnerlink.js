

new eTable2('partnerlink', {
    level:%levelModerator,
    fields: parseLS('id,mtime,title,url,order'),
    fieldFunc: {
        'mtime'  : TVIEW.time
    },
    filter: {
        'id'  : TINP.number,
        'url,title' : TINP.like
    }
});



