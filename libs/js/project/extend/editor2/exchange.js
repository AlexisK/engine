
prepEditor2('exchange', 'view,update', {
    cls: 'noLang',
    level:%levelModerator,
    schema:{
        'dir_ratecorrection,rev_ratecorrection':'dec',
        'is_active,is_auto':'bool',
        'in_currency_id,out_currency_id': {
            _type:'dropdown',
            model: 'currency'
        },
        'dir_ratesource_id,rev_ratesource_id': {
            _type:'dropdown',
            model: 'ratesource'
        },
        'lvl': {
            _type:'dropdown',
            data: {
                0:   'Гость',
                10:  'Незарегистр.',
                20:  'Пользователь',
                100: 'Редактор'
            }
        },
        'rate,raterev': {
            _type:'dec',
            precision: 9
        },
        'sur_fee': {
            'add,mult,min,max':'dec',
            't': 'fee_type',
            'm': 'ceil_method',
            'precision': 'm_precision'
        },
        params: {
            'is_userdata_in':'bool',
            'order': 'number'
        }
    },
    group: {
        g_settings: {
            title: 'settings',
            fields: 'lvl,in_currency_id,out_currency_id,params.order,is_active,is_auto,params.is_userdata_in'
        },
        g_ratesource: {
            title: 'ratesource',
            fields: 'dir_ratesource_id,dir_ratecorrection,rev_ratesource_id,rev_ratecorrection'
        },
        g_rate: 'rate',
        g_raterev: 'raterev',
        g_sur_fee: 'sur_fee'
    },
    order: 'g_settings,g_ratesource,g_rate,g_raterev,g_sur_fee'
});



