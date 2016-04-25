
prepEditor2('rstarget','insert,update,delete',{
    level:%levelAdmin,
    cls: 'small noLang',
    schema: {
        'title':'text',
        'margin':'dec',
        'is_active':'bool',
        'in_accurrency_id,out_accurrency_id':{
            _type:'dropdown',
            model:'accurrency'
        },
        'ratesource_id': {
            _type:'dropdown',
            model:'ratesource'
        }
    },
    group: {
        g_base: {
            title: 'basic',
            fields: 'title,margin,is_active'
        },
        g_settings: {
            title: 'settings',
            fields: 'in_accurrency_id,out_accurrency_id,ratesource_id'
        }
    },
    order: 'g_base,g_settings'
});
