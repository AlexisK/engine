
prepEditor2('redirect','insert,update,delete',{
    level:%levelAdmin,
    cls: 'small noLang',
    schema: {
        'name,url':'text',
        'is_permanent':'bool'
    },
    order: 'name,url,is_permanent'
});
