
prepEditor2('bonus', 'insert,update,delete', {
    level: %levelModerator,
    cls: 'small',
    langPrefix: 'langdata',
    schema:{
        'name':'text',
        'points,surplus':'dec',
        'is_active':'bool'
    },
    lschema: {
        'title,description':'text'
    }
});



