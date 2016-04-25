new eProcessor('viewcoffers', {
    process: function(dom, db) {
        _jO(dom);
        
        dom.V.coffers = S('.mk_coffers', dom)[0];
        
        if ( def(dom.V.coffers) ) {
            mapO(CASH.model.paysystem, function(ps) {
                var node = VIEW.cofferView(ps);
                dom.V.coffers.attach(node);
                
            });
        }
        
    }
})


