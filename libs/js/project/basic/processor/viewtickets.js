new eProcessor('viewtickets', {
    process: function(self, db) {
        _jO(self);
        if ( !PAGE.level ) { return 0; }
        
        
        map(S('.mk_tickets_list', self), f(node) {
            _jO(node);
            
            var selector = mergeObjects({
                range: [parseInt(node.D.page||0), 18]
            }, (PAGE.level >= %levelSupport) && db.selectors.support || db.selectors.user);
            
            ORM.req('ticket:select', f(list) {
                
                map(list, f(obj) {
                    node.attach(VIEW.ticketitem(obj));
                });
                
            }, selector);
        });
        
        map(S('.mk_tickets_addnew', self), f(node) {
            node.attach(VIEW.ticketadditem(self));
        });
        
        
    },
    selectors: {
        user: {
            order: [['status',true]]
        },
        support: {
            selector: {
                status:['in',[CONF.project.ticketstatusSpec.new,CONF.project.ticketstatusSpec.working]]
            },
            order: [['status',false]]
        }
    }
})


