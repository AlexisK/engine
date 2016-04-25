

ENGINE.prepEditor('paysystem', {
    lvl:%levelModerator,
    fields:    'is_active,is_active_in,is_active_out',
    ldfields:  'displayname',
    schema: {
        viewparams: {
            'css,img,imgHover': 'text'
        },
        params: {
            'order,get_balance_period,limit_coffercount': 'number',
            'is_multicurrecy,is_auto_in,is_auto_out,is_userdata_in,is_userdata_out':'bool'
        }
    },
    hiddenForm: 'name',
    langPrefix: 'langdata'
}, {
    update_form: f(data, obj) {
        var conf = PS[obj.name];
        if ( conf && conf.additionalFields ) {
            data.schema.params = mergeObjects(data.schema.params, conf.additionalFields);
        }
    }
});














