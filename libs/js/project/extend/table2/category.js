

new eTable2('category', {
    level:%levelModerator,
    fields: parseLS('id,urlpart,title,order,views'),
    filter: {
        'id,order'      : TINP.number,
        'title,urlpart' : TINP.like,
        'views'         : TINP.rangeNumber,
    },
    rowGen: createPageRow(),
    sorter: parseLS('id,order,views')
});



