
new eTable2('timer', {
    level:%levelSuper,
    fields: parseLS('id,displayname,sec'),
    fieldFunc: {
    },
    filter: {
        'id,sec' : TINP.number,
        'displayname' : TINP.like,
    },
    sorter: parseLS('sec')
});
