new eAdapter('phone', {
    process: function(self, dom) {
    	dom.initVal = null;

        $P(dom, 'val', f() {
        	var userInput = this.value;
        	var formatted;
        	if ( userInput.indexOf('+') != -1 ) {
        		formatted = userInput.split('+')[1];
        	} else {
        		formatted = userInput
        	}
        	return formatted;
        }, f(data) {
        	this.initVal = data;
            this.value = '';
            if ( data ) { this.value = '+' + data; }
        	return this.value;
        });
    }
});
