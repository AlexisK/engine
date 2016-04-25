
new eAdapter('datetime', {
    process: function(self, dom) {
        dom.__selfVal = null;
        $P(dom, 'val', f(){
            return new Date(dom.__selfVal);
        }, f(data) {
            dom.__selfVal = data;
            dom.textContent = formatDate(data, true, true, true);
        });
    }
});









