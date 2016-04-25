
prepEditor2('ratesource','insert,update,delete',{
    cls: 'small noLang',
    schema: {
        'name':'text',
//-        'timer_id':{
//-            _type:'dropdown',
//-            model:'timer'
//-        },
        params: {
            'get_rates_period':'number'
        }
    },
    group: {
        g_params:'params'
    },
    order: 'name,timer_id,g_params'
});
