
prepEditor2('exchpage','insert,update,delete',{
    inherit: '_page',
    level: %levelManager,
    delete_level:%levelModerator,
    schema: {
        'exchange_id': {
            _type: 'dropdown',
            model: 'exchange',
            _flag: 'required'
        }
    },
    group: {
        g_settings: {
            fields:'exchange_id'
        }
    },
    defaultObject: {
        displaydate: new Date()*1
    }
});




























