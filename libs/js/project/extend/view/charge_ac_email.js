
new eHtml('charge_ac_email','<p>email</p><input type="text" /><p></p><div></div><p></p><input type="number" /><p></p><div class="asBtn"></div>',{
    p: 'label_email,label_accur,label_amount,info_result',
    input: 'input_email,input_amount',
    'div':'ph_accur,submit'
});


new eView('charge_ac_email', {
    create: f() { return HTML.charge_ac_email(cr('div')); },
    init: f(self, email) {
        self.V.label_accur.val  = PAGE.ld('currency');
        self.V.label_amount.val = PAGE.ld('amount to charge');
        self.V.submit.val = PAGE.ld('Submit');
        
        
        var dd = cr.ormdropdown(RNG(ORM.model.accurrency));
        
        self.V.ph_accur.attach(dd);
        
        if ( email ) {
            self.V.input_email.attr({
                disabled: true
            }).val = email;
        }
        
        self.C.valid = false;
        
        ADAPTER.dec.process(self.V.input_amount);
        
        self.F.fetchData = f() {
            self.C.valid = (VALIDATOR.email(self.V.input_email) && self.V.input_amount.val != 0 && dd.val );
            self.V.info_result.val = (( self.V.input_amount.val >= 0 ) && '+' || '' ) + self.V.input_amount.val.toDec() + ' ac';
        }
        
        
        
        self.V.submit.onclick = f() {
            self.F.fetchData();
            if ( self.C.valid ) {
                ORM.req('transaction:charge', {
                    email  : self.V.input_email.val,
                    out_sum : self.V.input_amount.val,
                    accurrency_id: dd.val
                }, f() {
                    SYS.notify(PAGE.ld('Success'), 'center ok');
                });
            }
        }
    }
});
