
prepEditor2('currency', 'view,update', {
    level:%levelModerator,
    cls: 'noLang',
    schema:{
        'displayname':'text',
        'is_active,is_active_in,is_active_out':'bool',
        'max_per_coffer,max_total,display_mult,display_offset':'dec',
        'paysystem_id':{
            _type: 'dropdown',
            model: 'paysystem'
        },
        'accurrency_id':{
            _type: 'dropdown',
            model: 'accurrency'
        },
        'in_fee,out_fee,refund_fee': {
            'add,mult,min,max':'dec',
            't': 'fee_type',
            'm': 'ceil_method'
        },
        viewparams: { 'css,suffix':'text' },
        params: {
            'order': 'number',
            'in_min_trans,in_max_trans,out_min_trans,out_max_trans':'dec',
            'precision': 'm_precision',
//-            'limit_perday,limit_permonth,limit_per30': 'number',
            'is_userdata_in,is_userdata_out':'bool',
            'export_fullname,export_shortname,export_code,export_custom':'text'
        }
    },
    group: {
        g_settings: {
            title: 'settings',
            fields: 'displayname,paysystem_id,accurrency_id,is_active,is_active_in,is_active_out,params.order,params.is_userdata_in,params.is_userdata_out,viewparams'
        },
        g_export: {
            title: 'export',
            fields: 'params.export_fullname,params.export_shortname,params.export_code,params.export_custom'
        },
        g_limits: {
            title: 'limits',
            fields: 'params.precision,max_per_coffer,max_total,display_mult,display_offset,params'
        },
        g_in_fee: {
            title: 'in_fee',
            fields: 'in_fee'
        },
        g_out_fee: {
            title: 'out_fee',
            fields: 'out_fee'
        },
        g_refund_fee: {
            title: 'refund_fee',
            fields: 'refund_fee'
        }
    },
    order: 'g_settings,g_export,g_limits,g_in_fee,g_out_fee,g_refund_fee'
});



