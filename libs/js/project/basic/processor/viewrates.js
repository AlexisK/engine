new eProcessor('viewrates', {
    process: function(self, db) {
        _jO(self);
        
        tm(db._process(self,db));
    },
    _process: function(self, db) {
        _jO(self);
        
        map(S('.mk_rate_view'), f(node) {
            var exch = ORM.O('exchange_'+node.attr('data-id'));
            if ( exch ) {
                var view = VIEW['exchange-rateline'](exch);
                insBefore(view, node);
            }
            node.detach();
        });
        
        
    }
})


