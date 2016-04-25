
new eHtml('exchange-calc', '<div class="calc-container viewcalc" \
data-gurl="" \
data-isadmin="true">\
</div>', {
    '.viewcalc':'viewcalc'
});









new eView('exchange-calc', {
    create: function() { return HTML['exchange-calc'](cr('div')); },
    init: function(self, obj) {
        
        var inited = false;
        
        self.show = function() {
            if ( !inited ) {
                getRawData([ENGINE.page,'_view',PAGE.lang,'calc2'].join('/'), f(html) {
                    self.V.viewcalc.innerHTML = html;
                    self.V.viewcalc.remCls('viewcalc');
                    self.V.viewcalc.addCls('pr_viewcalc');
                    ENGINE.processDom(self);
                });
                inited = true;
            }
            POP.window.show(self, true);
        }
    }
});






































