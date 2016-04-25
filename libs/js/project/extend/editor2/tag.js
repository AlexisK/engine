
prepEditor2('tag','update',{
    level:%levelAdmin,
    langPrefix: 'langdata',
    schema: {
        'name':'text',
        'rank':'number'
    },
    lschema: {
        'title,keywords':'text',
        'description':'textarea'
    },
    group: {
        g_base: {
            title:'basic',
            fields: 'name,rank'
        },
        g_seo : {
            title:'custom seo',
            fields: 'title,keywords,description'
        }
    },
    order: 'g_base,g_seo'
});
