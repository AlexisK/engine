
prepEditor2('ratespage','insert,update,delete',{
    inherit: '_page',
    level: %levelManager,
    delete_level:%levelModerator,
    schema: {
        'in_paysystem_id,out_paysystem_id': {
            _type: 'dropdown',
            model: 'paysystem',
            _flag: 'required'
        }
    },
    group: {
        g_settings: {
            fields:'in_paysystem_id,out_paysystem_id'
        }
    },
    defaultObject: {
        displaydate: new Date()*1
    }
});




























