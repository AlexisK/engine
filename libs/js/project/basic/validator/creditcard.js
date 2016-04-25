
function validateCreditCard(str) {
    var validSymb = (/^[\d]*$/g).test(str);
    if ( !validSymb ) { return false; }
    
    var noCard = str.replace(/\D/g, "");
    noCard = noCard.split("").map(Number);
    if ( noCard.length < 13 || noCard.length > 19 ) { return false; }
    
    for ( var i = noCard.length - 2; i >= 0; i -= 2 ) {
        noCard[i] = noCard[i] * 2;
        if ( noCard[i] > 9 ) noCard[i] -= 9;
    }
    
    var result = noCard.reduce(function(a, b) { return a + b; });
    
    return ((result % 10) == 0);
}


new eValidator('creditcard',function(self, inp){
    
    function match() {
        return self.runSingle(inp, validateCreditCard);
    }
    inp.onkeyup = match;
    return match();
}, true);


UPARAMS.store('creditcard', {
    ph: 'XXXX XXXX XXXX XXXX',
    title: 'Credit Card',
    validator: VALIDATOR.creditcard
});


