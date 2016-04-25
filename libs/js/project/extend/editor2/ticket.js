
prepEditor2('ticket','insert,update,delete',{
    level:%levelAdmin,
    cls: 'noLang',
    schema: {
        'subject':'text',
        'status': {
            _type:'dropdown',
            data: CONF.project.ticketstatus
        }
    },
    order: 'subject,status'
});
