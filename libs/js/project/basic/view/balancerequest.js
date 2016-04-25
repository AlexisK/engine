
new eHtml('balancerequest', '<h3></h3>', {
    h3:'title'
});


new eView('balancerequest', {
    create: f() { return HTML.balancerequest(cr('div','jCalc')); },
    init: f(self, user) {
        user = user || PAGE.user || {};
        
        self.V.title.val = PAGE.ld('Balance request');
        
        self.V.blk_currency = VIEW.input_ormdd(RNG(ORM.model.currency));
        self.attach(self.V.blk_currency);
        self.V.blk_currency.label  = PAGE.ld('currency');
        
        self.V.inp_amount   = VIEW.input_text(); self.attach(self.V.inp_amount);
        self.V.inp_email    = VIEW.input_text(); self.attach(self.V.inp_email);
        self.V.inp_amount.label    = PAGE.ld('amount');
        self.V.inp_email.label     = PAGE.ld('email');
        
        ADAPTER.dec.process(self.V.inp_amount.V.input);
        
        if ( user.email ) {
            self.V.inp_email.val = user.email;
            self.V.inp_email.V.input.attr({ disabled: true });
        }
        
        self.cr('br');
        
        self.V.submit = self.cr('input','asBtn').attr({
            type: 'button'
        }).VAL(PAGE.ld('Submit'));
        
        self.V.submit.onclick = f() {
            var val = parseInt(self.V.inp_amount.val);
            if ( VALIDATOR.email(self.V.inp_email.V.input) && val > 0 && self.V.blk_currency.val ) {
                ORM.req('balancerequest:insert',{
                    email  : self.V.inp_email.val,
                    amount : self.V.inp_amount.val,
                    currency_id: self.V.blk_currency.val
                },f(){
                    SYS.notify(PAGE.ld('Success'), 'center ok');
                    POP.modal.hide();
                });
            }
        }
        
    }
});

