
prepEditor2('coffer', 'insert,view,delete', {
    level:%levelAdmin,
    cls: 'small noLang',
    schema:{
        'account':'text',
        'merchant_id':{
            _type:'dropdown',
            model: 'merchant'
        },
        'currency_id': {
            _type:'dropdown',
            model: 'currency'
        },
        'is_active':'bool'
    },
    objschema: f(obj, data) {
        if ( !def(obj._rel) || !obj._rel.paysystem ) { return 0; }
        if ( conf && conf.cofferFields ) {
            data.schema.params = mergeObjects(data.schema.params, conf.cofferFields);
        }
    }
});



