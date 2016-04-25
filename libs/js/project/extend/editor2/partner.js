
prepEditor2('partner','insert,update,delete',{
    level:%levelModerator,
    langPrefix: 'langdata',
    schema: {
        'name':'text',
        'points,surplus,max_profit_surplus':'dec',
        'is_active':'bool'
    },
    lschema: {
        title:'text',
        description:'textarea'
    },
    group: {
        g_base: {
            title: 'basic',
            fields: 'name,title,description,is_active'
        },
        g_points: {
            title: 'points',
            fields: 'points,surplus,max_profit_surplus'
        }
    },
    order: 'g_base,g_points',
    objschema: f(obj, data) {
        
    }
});
