

ENGINE.prepEditor('currency', {
    level:%levelSuper,
    fields:    'displayname,is_active,is_active_in,is_active_out,max_per_coffer,max_total,display_mult,display_offset',
    dropdown: {
        paysystem  : 'paysystem_id',
        accurrency : 'accurrency_id'
    },
    schema: {
        'in_fee,out_fee,refund_fee': {
            'add,mult,min,max':'dec',
            't': 'fee_type',
            'm': 'ceil_method',
            'precision': 'm_precision'
        },
        viewparams: { 'css,suffix':'text' },
        params: {
            'order': 'number',
            'limit_perday,limit_permonth,limit_per30': 'number',
            'is_userdata_in,is_userdata_out':'bool',
            'export_fullname,export_shortname,export_code,export_custom':'text'
        }
    },
    hiddenForm: 'name'
});














