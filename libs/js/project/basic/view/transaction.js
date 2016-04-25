
new eHtml('transaction-table1', '<td><a></a></td><td class="pr_datetime"></td><td class="fHeight"></td><td class="fHeight"></td><td></td><td class="ad_tstatus"></td>', {
    td: 'id,time,amount_in,amount_out,bonus,status',
    a:  'link'
});

new eHtml('transaction-table-amount', '+<span class="ad_moneyDis"></span> <b></b><br>-<span class="ad_moneyDis"></span> <b></b>', {
    span:'out_amount,in_amount',
    b:   'currency_out,currency_in'
});


new eHtml('transaction-table-amount-single', '<img src="http://anycash.darvix.net/static/image/ps/" width="43" height="31"><span></span><span></span><b></b>', {
    span:'ind,amount',
    img: 'ico',
    b:   'currency'
});


new eView('transaction-table1', {
    create: function() { return HTML['transaction-table1'](cr('tr')); },
    init: function(self, obj) {
        if ( obj.name ) {
            self.V.link.href = ['/','/transaction/#t='].join(PAGE.lang) + obj.name;
        } else {
            self.V.link = setTag(self.V.link, 'span');
        }
        self.V.link.val = obj.id;
        if ( obj.expiry ) { self.V.time.val = obj.expiry; }
        if ( obj.bonus ) { self.V.bonus.val = obj.bonus.toDec(2); }
        
        self.V.status.val = obj.status;
        
        //-HTML['transaction-table-amount'](self.V.amount);
        //-self.V.amount.V.in_amount.val    = obj.in_sum.toDec();
        //-self.V.amount.V.out_amount.val   = obj.out_sum.toDec();
        //-self.V.amount.V.currency_in.val  = ORM.getVisName(cur_in);
        //-self.V.amount.V.currency_out.val = ORM.getVisName(cur_out);
        
        if ( obj.in_currency_id ) {
            var cur_in   = ORM.O('currency_'+obj.in_currency_id);
            HTML['transaction-table-amount-single'](self.V.amount_in);
            self.V.amount_in.V.ind.val      = ' -';
            self.V.amount_in.V.ico.src      = self.V.amount_in.V.ico.src + cur_in._rel.paysystem.viewparams.imgHover;
            self.V.amount_in.V.amount.val   = obj.in_sum.toDec(2);
            self.V.amount_in.V.currency.val = ORM.getVisName(cur_in);
        }
        
        if ( obj.out_currency_id ) {
            var cur_out  = ORM.O('currency_'+obj.out_currency_id);
            HTML['transaction-table-amount-single'](self.V.amount_out);
            self.V.amount_out.V.ind.val      = ' +';
            self.V.amount_out.V.ico.src      = self.V.amount_out.V.ico.src + cur_out._rel.paysystem.viewparams.imgHover;
            self.V.amount_out.V.amount.val   = obj.out_sum.toDec(2);
            self.V.amount_out.V.currency.val = ORM.getVisName(cur_out);
            
            self.V.bonus.attach(cr('b').VAL(' '+ORM.getVisName(cur_out)));
        }
        
    }
});













