

new eLayer('main', {
    dom: document,
    select: CONF.engine.dynamicPageSelectors,
    ontravel: function(l, params) {
        
        ENGINE.apiPageWork();
        
        if ( params && !params.is_fetchPos ) {
            ENGINE.clear();
            SCENARIO.page.run();
        }
        
        EVENT.emit('goPage');
    }
});


