

ENGINE.prepEditor('exchange', {
    lvl: %levelModerator,
    fields:    'dir_ratecorrection,rev_ratecorrection,is_active,is_auto',
    dropdown: {
        currency: 'in_currency_id,out_currency_id',
        ratesource: 'dir_ratesource_id,rev_ratesource_id'
    },
    schema: {
        'rate,raterev': 'dec',
        'sur_fee': {
            'add,mult,min,max':'dec',
            't': 'fee_type',
            'm': 'ceil_method',
            'precision': 'm_precision'
        },
        params: {
            //-'is_userdata_in,is_userdata_out':'bool',
            'is_userdata_in':'bool',
            'order': 'number'
        }
    },
    cdropdown: {
        lvl: {
            0:   'Гость',
            10:  'Незарегистр.',
            20:  'Пользователь',
            100: 'Редактор'
        }
    }
});














