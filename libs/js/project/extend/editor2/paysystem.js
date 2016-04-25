
prepEditor2('paysystem','view,update',{
    level: %levelModerator,
    langPrefix: 'langdata',
    lschema: {
        'displayname':'text'
    },
    schema: {
        'is_active,is_active_in,is_active_out':'bool',
        params: {
            'order,get_balance_period,limit_coffercount': 'number',
            'is_multicurrecy,is_auto_in,is_auto_out,is_userdata_in,is_userdata_out':'bool'
        },
        viewparams: {
            'css,img,imgHover': 'text'
        }
    },
    objschema: f(obj, data) {
        var conf = PS[obj.name];
        if ( conf && conf.additionalFields ) {
            data.schema.params = mergeObjects(data.schema.params, conf.additionalFields);
        }
    }
});




























