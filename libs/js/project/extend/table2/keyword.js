

new eTable2('keyword', {
    fields: parseLS('id,name'),
    filter: {
        'id'   : TINP.number,
        'name' : TINP.like
    },
    sorter: parseLS('id')
});



