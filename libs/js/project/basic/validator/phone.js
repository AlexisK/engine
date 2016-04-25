
new eValidator('phone', {
    check: f(val, node) {
        var pstr = node.val;
        if ( (pstr.indexOf('38') == 0 ) && pstr.length == 12) {
            return true;
        }
        return false;
    },
    wrap: f(self, node) {
        $P(node, 'validval', f() {
            var val = nodeval(this, true);
            var pstr = val.replace(/\D+/g,'');
            if ( pstr[0] == '8' ) {
                pstr = '3'+pstr;
            } else if ( pstr[0] != '3' ) {
                pstr = '38'+pstr;
            }
            return pstr;
        });
    }
});
