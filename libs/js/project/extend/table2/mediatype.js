

new eTable2('mediatype', {
    level:%levelSuper,
    fields: parseLS('id,name'),
    filter: {
        'id'   : TINP.number,
        'name' : TINP.like
    },
    sorter: parseLS('id')
});



