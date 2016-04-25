

new eHtml('settings-newwallet','<div class="inp-block">\
    <div class="label left"><img width="43" height="31" class="psIco" /></div>\
    <div class="label right asBtn">OK</div>\
    <div class="inp"></div>\
</div>',{
    img:'ico',
    '.inp-block':'inputBlock',
    '.inp':'inputContainer',
    '.asBtn':'submit'
});


new eView('settings-newwallet', {
    create: f() { return HTML['settings-newwallet'](cr('div')); },
    init: f(self, data) {
        self.V.ico.src = [ENGINE.path.static,'image/ps/',data.paysystem.viewparams.imgHover].join('');
        self.V.input = data.input().attr({
            placeholder: data.label
        });
        self.V.inputContainer.attach(self.V.input);
        
        
        var ddList = data.paysystem._rel.currency;
        var dd = cr.ormdropdown(ddList,'label left', null, {
            method:'getVisName'
        });
        dd.val = ddList[0].id;
        insBefore(dd, self.V.inputContainer);
        
        self.F.oninput = f(){};
        
        self.C.resp = null;
        self.V.input.onupdate(f(val) {
            self.C.resp = data.validator(self.V.input);
        });
        
        self.V.submit.onclick = f() {
            self.C.resp = data.validator(self.V.input);
            if ( self.C.resp && dd.val ) {
                self.F.oninput(self.V.input.val, self.C.resp, dd.val);
            }
        }
    }
});




new eHtml('settings-wallet','<div class="inp-block">\
    <div class="label left"><img width="43" height="31" class="psIco" /></div>\
    <div class="label left"></div>\
    <div class="inp"></div>\
</div>',{
    img:'ico',
    '.inp-block':'inputBlock',
    '.inp':'inputContainer',
    '.label':'t,cur'
});
new eView('settings-wallet', {
    create: f() { return HTML['settings-wallet'](cr('div')); },
    init: f(self, wallet) {
        var cur = wallet._rel.currency;
        
        self.V.ico.src = [ENGINE.path.static,'image/ps/',cur._rel.paysystem.viewparams.imgHover].join('');
        self.V.cur.val = ORM.getVisName(cur);
        self.V.input = cr('input').attr({
            type: 'text',
            disabled: 'true'
        }).VAL(wallet.displayname);
        self.V.inputContainer.attach(self.V.input);
        
    }
});



