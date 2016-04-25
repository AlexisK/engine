
prepEditor2('merchant', 'insert,update,delete', {
    level:%levelAdmin,
    cls: 'small noLang',
    schema:{
        'is_active,is_active_in,is_active_out':'bool',
        'title':'text',
        'paysystem_id':{
            _type:'dropdown',
            model:'paysystem'
        }
    },
    group: {
        g_params:'paysystem specific'
    },
    order:'title,paysystem_id,is_active,is_active_in,is_active_out,g_params',
    objschema: f(obj, data) {
        if ( !obj._rel ) { return 0; }
        var conf = PS[obj._rel.paysystem.name];
        if ( conf && conf.merchantFields ) {
            data.schema.params = mergeObjects({}, conf.merchantFields);
        }
    }
});



