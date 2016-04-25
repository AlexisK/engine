

new eLayer('paper', {
    select: CONF.engine.dynamicPopSelectors,
    parent: 'main',
    fetchLang: function(){},
    ontravel: function(self, params) {
        if ( self.dom._currentPop != POP.paper ) {
            POP.paper.show(self.dom, true);
        }
        if ( params && !params.is_fetchPos ) {
            ENGINE.processDom(self.dom);
        }
    },
    hide: function() {
        POP.paper.hide({noOnHide:true});
    }
});

LAYER.paper.dom._onpopclose = function() {
    LAYER.main.go();
}

LAYER.paper.dom.cr('div','content');

