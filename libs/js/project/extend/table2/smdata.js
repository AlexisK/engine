

new eTable2('smdata', {
    fields: parseLS('id,name,min,max,freq'),
    fieldFunc: {
        'is_important' : TVIEW.bool
    },
    filter: {
        'id'   : TINP.number,
        'name' : TINP.like,
        'min,max,freq' : TINP.rangeNumber
    },
    sorter: parseLS('id,min,max,freq'),
});



