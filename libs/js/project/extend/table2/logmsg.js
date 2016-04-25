

new eTable2('logmsg', {
    level:%levelAdmin,
    fields: parseLS('id,name,title,lvl'),
    fieldFunc: {},
    filter: {
        'id,lvl'     : TINP.number,
        'name,title' : TINP.like
    },
    sorter: parseLS('id,lvl'),
    rowGen: function(obj) {
        var block = cr('tr');
        var info = new ST(block);
        
        return block;
    }
});



