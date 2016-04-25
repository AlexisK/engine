
new eAdapter('calcval', {
    process: function(self, dom, precision) {
        var fld = 'textContent';
        if ( def(dom.value) ) {
            fld = 'value';
        }
        
        dom.__selfVal = 0;
        
        $P(dom, 'val',
        function() {
            return this.__selfVal = parseNum(this[fld]);
        },
        function(data) {
            this.__selfVal = parseNum(data);
            
            this.value = this.__selfVal.fromDec().toDec(dom._precision)+'..................................';
            return this.__selfVal;
        });
        
        dom.val = dom.val / dom._precision;
        dom.onupdate(function() { this.val = this.val; });
        
        evt(dom, 'focus', function() {
            if ( this.__selfVal == 0) {
                this.value = '';
            } else {
                this.value = this.__selfVal;
            }
        });
        
        evt(dom, 'blur', function() {
            this.value = this.__selfVal.fromDec().toDec(dom._precision)+'..................................';
        });
        
    }
});









