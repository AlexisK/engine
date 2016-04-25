
new eHtml('write_user_form', '<div><p></p><strong class="hidden"></strong><div class="ddownblock"></div></div>\
<div><p></p><input class="w-100" type="text" /></div>\
<div><p></p><input class="w-100" type="text" /></div>\
<div><p></p><textarea class="w-100"></textarea></div>\
<div><input type="submit" /></div>', {
    'p':'l_targ,l_subj,l_thme,l_text',
    'strong':'i_email',
    'input':'i_subj,i_thme,submit',
    'textarea':'i_text',
    '.ddownblock':'ddownblock'
});

SYS.userWriteToChain = [30,100,150,170,200,250];
SYS.userWriteToMap = {};
map(SYS.userWriteToChain, f(n) { g_lvl[n] && ( n <= PAGE.level ) && (SYS.userWriteToMap[n] = PAGE.ld(g_lvl[n])); });


new eView('write_user_form', {
    create: f() { return HTML.write_user_form(cr('div')); },
    init: f(self, selector) {
        self.V.l_targ.val = PAGE.ld('Write to:');
        self.V.l_subj.val = PAGE.ld('subject');
        self.V.l_thme.val = PAGE.ld('theme');
        self.V.l_text.val = PAGE.ld('html content');
        self.V.submit.val = PAGE.ld('send');
        
        self.ondone = f(){};
        
        
        self.V.i_text.style.minHeight = '300px';
        
        
        self._selector = selector||{};
        
        $P(self, 'selector', f() { return self._selector; }, f(nsel) {
            self._selector = nsel;
            self.F.fetchSelector();
        });
        
        self.F.fetchSelector = f() {
            var ok = okeys(self._selector);
            if ( ok.length == 1 && ok[0] == 'id' ) {
                self.V.i_email.val = ORM.O('user_'+self._selector.id[1]).email;
                self.V.i_email.remCls('hidden');
                if ( self.dd ) { self.dd.detach(); }
            } else {
                self.V.i_email.addCls('hidden');
                self.dd = self.dd || cr.dropdown(SYS.userWriteToMap);
                self.V.ddownblock.attach(self.dd);
                
                self.dd.onupdate(f(lvl) {
                    self._selector = { lvl: ['=', lvl]};
                });
            }
        }
        
        self.F.fetchSelector();
        
        self.V.submit.onclick = f() {
            if ( VALIDATOR.notEmpty(self.V.i_subj) && okeys(self.selector).length > 0 ) {
                
                var t = cr('div');
                t.innerHTML = self.V.i_text.val;
                
                ORM.req('user:sendmsg',{
                    subject : self.V.i_subj.val,
                    content : t.innerHTML,
                    theme   : self.V.i_thme.val
                },f(){
                    SYS.notify(PAGE.ld('sent'),'ok center');
                    self.ondone();
                },{selector: self.selector });
            }
        }
    }
});
