
new ePop('paper', 'paper-layer', {
    createDom: function(self) {
        self.block = cr('div', 'fullscreen');
        self.V.wrap = self.block.cr('div', self.pcls );
        self.V.cont = self.V.wrap.cr('div', 'paper-cont' );
        self.V.closeBtn = self.V.wrap.cr('div', 'close');
        self.C.contElem = cr('div');
        
        self.data.initDom(self);
    },
    initDom: function(self) {
        var tlink = self.V.closeBtn.cr('a','noHref').attr({href:'#'});
        SVG.close(tlink);
        
        
        clearEvents(tlink).onclick = function() {
            self.hide();
            return false;
        }
    }
});

