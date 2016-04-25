
ENGINE.prepEditor('merchant', {
    fields:  'id,is_active,is_active_in,is_active_out',
    dropdown: {
        paysystem : 'paysystem_id'
    }
}, {
    update_form: f(data, obj) {
        
        if ( !obj._rel ) { return 0; }
        var conf = PS[obj._rel.paysystem.name];
        if ( conf && conf.merchantFields ) {
            data.schema.params = mergeObjects({}, conf.merchantFields);//-data.schema.params
        }
    }
});















