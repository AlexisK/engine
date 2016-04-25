
new eAdapter('money', {
    process: function(self, dom, precision) {
        dom._precision = precision || dom.D.precision || CONF.project.moneyPrecision;
        dom._toLen = (dom._precision).toString().length - 1;
        var fld = 'textContent';
        if ( def(dom.value) ) {
            fld = 'value';
        }
        
        dom.__selfVal = 0;
        
        $P(dom, 'val',
        function() {
            this.__selfVal = parseNum(this[fld])*this._precision;
            return this.__selfVal;
        },
        function(data) {
            this.__selfVal = parseNum(data);
            this[fld] = [parseInt(this.__selfVal / this._precision), Math.abs(parseInt(this.__selfVal % this._precision)).toLen(this._toLen)].join(',')
            return this.__selfVal;
        });
        
        dom.val = dom.val / dom._precision;
        dom.onupdate(function() { this.val = this.val; });
    },
    selector: '.ad_money'
});









