
ENGINE.prepEditor('coffer', {
    fields:  'account,is_active',
    dropdown: {
        merchant : 'merchant_id',
        currency  : 'currency_id'
    }
}, {
    update_form: f(data, obj) {
        if ( !def(obj._rel) || !obj._rel.paysystem ) { return 0; }
        var conf = PS[obj._rel.paysystem.name];
        if ( conf && conf.cofferFields ) {
            data.schema.params = mergeObjects({}, conf.cofferFields);//-data.schema.params
        }
    }
});















