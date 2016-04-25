new eProcessor('goTop_mob', {
    process: function(self, db) {
        _jO(self);
        var button = self.cr('div', 'goTopMob'),
            icon = button.cr('div', 'btn-icon'),
            textCont = button.cr('div', 'btn-text'),
            text = PAGE.ld('GOTOP'),
            target = S('.fullscreen')[0];

        textCont.VAL(text);
        SVG.blueArrUp(icon);

        button.onclick = function() {
            target.scrollTop = 0;  
        }
    }
});






