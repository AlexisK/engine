

new eTable2('ticket', {
    fields: parseLS('id,url,ctime,mtime,subject,status,owner_id'),
    fieldFunc: {
        'ctime,mtime' : TVIEW.time,
        'status'      : f(obj, key) { return TVIEW.mapper(CONF.project.ticketstatus, obj, key); },
        'url'         : f(obj, key) {
            var url = ['/',PAGE.lang,'/ticket/',obj.name,'/'].join('');
            return cr('a').attr({
                href: url
            }).VAL(url);
        }
    },
    filter: {
        'id,owner_id'   : TINP.number,
        'subject'       : TINP.like,
        'ctime,mtime'   : TINP.rangeTime,
        'status'        : f(self, f) { return TINP.dropdown(self,f,CONF.project.ticketstatus); }
    },
    sorter: parseLS('id,ctime,mtime,status'),
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
        
        if ( obj.status == CONF.project.ticketstatusSpec.max ) {
            node.addCls('green');
        }
        if ( obj.status == CONF.project.ticketstatusSpec.new ) {
            node.addCls('warning');
        }
        if ( CONF.project.ticketstatusColor[obj.status] == 'bad' ) {
            node.addCls('red');
        }
        
        
        return node;
    }
});




