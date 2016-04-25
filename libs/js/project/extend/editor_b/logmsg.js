
SYS.logmsgTypes = {
    def:{ notify_admin: 'bool' }
}

ENGINE.prepEditor('logmsg', {
    lvl: %levelAdmin,
    fields:  'title,lvl'
}, {
    update_form: f(data, obj) {
        if ( !obj.name ) { return 0; }
        var prefix = obj.name.split('_')[0];
        
        data.schema.params = SYS.logmsgTypes[prefix] || SYS.logmsgTypes.def;
        
    }
});















