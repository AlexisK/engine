
prepEditor2('article','insert,update,delete',{
    inherit: '_page',
    level: %levelManager,
    delete_level:%levelModerator,
    schema: {
        'is_important':'bool',
        'category_id': {
            _type: 'dropdown',
            model: 'category',
            _flag: 'required'
        }
    },
    group: {
        g_settings: {
            fields:'is_important,category_id'
        }
    },
    defaultObject: {
        displaydate: new Date()*1
    }
});




























