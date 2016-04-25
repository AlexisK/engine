
new eHtml('merchant_payout_form','<h1></h1><div></div><input type="number" /><input type="text"/><input type="submit"/>',{
    h1:'title',
    div:'ddBlock',
    input:'input,uparams,submit'
});



new eView('merchant_payout_form', {
    create: f() {
        var block = HTML.merchant_payout_form(cr('div'));
        ADAPTER.dec.process(block.V.input);
        return block;
    },
    init: f(self, merchant) {
        
        try {
            var ps = merchant._rel.paysystem;
            var currencies = ps._rel.currency;
            if ( !currencies || currencies.length == 0 ) { return 0; }
        } catch(err) { return 0; }
        
        self.V.title.VAL(PAGE.ld('Payout')+' '+ORM.getVisName(ps));
        
        self.V.dd = cr.ormdropdown(merchant._rel.paysystem._rel.currency);
        self.V.ddBlock.attach(self.V.dd);
        
        
        
        self.V.submit.onclick = f() {
            var cur_id = self.V.dd.val;
            if ( !cur_id ) { SYS.notify(PAGE.ld('select currency!'),'red center'); return 0; }
            var val = self.V.input.val;
            if ( !val || val < 0 ) { log(val); SYS.notify(PAGE.ld('incorrect value!'),'red center'); return 0; }
            if ( !PS[ps.name] || !PS[ps.name].validator(self.V.uparams) ) { SYS.notify(PAGE.ld('incorrect account!'),'red center'); return 0; }
            var u_params = { account: self.V.uparams.val }
            ORM.req('transaction:manualPayout', {currency_id: cur_id, out_sum:val, merchant_id:merchant.id, u_params:u_params}, f() {
                SYS.notify(PAGE.ld('done'),'ok center');
            });
        }
        
    }
});
