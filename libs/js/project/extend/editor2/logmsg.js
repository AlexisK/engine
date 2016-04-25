
SYS.logmsgTypes = {
    def:{ notify_admin: 'bool' }
}

prepEditor2('logmsg', 'update', {
    level:%levelAdmin,
    cls: 'small noLang',
    schema:{
        'title':'text',
        'lvl':'number'
    },
    order: 'title,lvl,params',
    objschema: f(obj, data) {
        
        if ( !obj.name ) { return 0; }
        var prefix = obj.name.split('_')[0];
        
        data.schema.params = SYS.logmsgTypes[prefix] || SYS.logmsgTypes.def;
    }
});



