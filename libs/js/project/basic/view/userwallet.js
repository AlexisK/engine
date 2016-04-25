
new eHtml('userwallet',
    //-'<div class="flag-holder">\
    //-    <img src="/static/image/cur/" width="24" height="24" alt="uah">\
    //-</div>\
    '<span>+100 500,00 UAH</span>', {
        //-img: 'ico',
        span:'amount'
    });

new eView('userwallet', {
    create: f() { return HTML.userwallet(cr('div','col-3')); },
    init: f(self, wallet) {
        var name = wallet._rel.accurrency.name;
        var sign = ' ';
        //-self.V.ico.src = [self.V.ico.src, name, '.png'].join('');
        if ( wallet.amount < 0 ) {
            sign = '';
        }
        self.V.amount.val = [ sign, wallet.amount.toDec(2), ' ', name.toUpperCase() ].join('');
        
    }
});

new eView('userwalletTotal', {
    create: f() { return HTML.userwallet(cr('div','total')); },
    init: f(self, wallet) {
        self.V.cont = self.cr('div', 'total-cont');
        var name = wallet._rel.accurrency.name.toUpperCase();
        var curListNode = wallet.cur_node;
        self.V.amount.val = [ wallet.displayprefix, ' ', wallet.amount.toDec(2), ' ' ].join('');
        tm(f() {
            self.V.dropDownTrig = self.V.cont.cr('div', 'pr_dropdown cab-settings-trigger');
            self.V.dropDownTrig.attr('data-closeonclick', 'true');
            self.V.dropDownTrig.attr('data-target', 'balance-dropdown');
            self.V.dropDownTrig.VAL(name);

            self.V.dropDown = self.V.cont.cr('div', 'sys-drop-down closed');
            self.V.dropDown.attr('id', 'target_balance-dropdown');
            self.V.dropDown.cr('div', 'sys-drop-down-list').attach(curListNode);
            PROCESSOR.dropdown.process(self.V.dropDownTrig);
        }, 100)     
    }
});
