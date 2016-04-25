
new eHtml('history_basic', '\
<div class="time"></div>\
\
<div class="opener">\
    <div class="opener_button" onclick="this.parentNode.swCls(\'active\');"></div>\
    <div class="cols">\
        <div>\
            <strong></strong><br/>\
            <div class="v1"></div>\
        </div>\
        <div>\
            <strong class="block-hide"></strong>\
            <nobr></nobr>\
        </div>\
        <div>\
            <strong class="block-hide"></strong>\
            <nobr></nobr>\
        </div>\
        <div>\
            <strong class="block-hide"></strong>\
            <nobr></nobr>\
        </div>\
        <div><img width="20px" height="20px" src=""/></div>\
        <div><a href="#"><span class="str_id inline-hide">ID </span><span class="val_id"></span></a></div>\
    </div>\
    <div class="cols details">\
        <div class="val_details"></div>\
        <div class="val_details">\
            //-<span>Баланс по счету </span><br class="mob-hide"/>\
            //-<nobr>28100.00 UAH</nobr>\
        </div>\
        <div class="val_details"></div>\
        <div class="val_details"></div>\
        <div><small class="val_status"></small></div>\
        <div></div>\
    </div>\
</div>\
', {
    '.time':'time',
    '.opener_button':'opener_button',
    'a'      : 'link',
    'img'    : 'img_status',
    'strong' : 'str1,str2,str3,str4',
    '.v1'    : 'val1',
    'nobr'   : 'val2,val3,val4',
    '.val_details':'det1,det2,det3,det4',
    '.val_id': 'val_id',
    '.val_status': 'val_status',
    '.str_id': 'str_id'
});

new eView('history_basic', {
    create: f() { return HTML.history_basic(cr('div','row row-content')); },
    init: f(self, obj) {
        self.V.opener_button.val = PAGE.ld('Детали');
        
    }
});




new eView('history_transaction', {
    create: f() { return VIEW.history_basic(); },
    init: f(self, obj) {
        
        self.V.str1.val = PAGE.ld('Exchange');
        self.V.str2.val = PAGE.ld('Debited');
        self.V.str3.val = PAGE.ld('Credited');
        self.V.str4.val = PAGE.ld('Bonus');
        
        self.stack = {
            repr_exch : ['',' - ',''],
            in_cur  : obj._rel.in_currency,
            out_cur : obj._rel.out_currency,
        }
        if ( self.stack.in_cur  ) {
            self.stack.in_ps  = self.stack.in_cur._rel.paysystem;
            self.stack.repr_exch[0] = ORM.getFullName(self.stack.in_cur);
        }
        if ( self.stack.out_cur ) {
            self.stack.out_ps = self.stack.out_cur._rel.paysystem;
            self.stack.repr_exch[2] = ORM.getFullName(self.stack.out_cur);
        }
        self.stack.repr_exch = self.stack.repr_exch;
        
        var ctime = new Date(obj.ctime);
        
        self.V.time.val = [(ctime.getHours()||'--').toLen(),(ctime.getMinutes()||'--').toLen()].join(':');
        
        
        
        self.V.val1.cr('nobr').VAL(self.stack.repr_exch[0]);
        self.V.val1.cr('span').VAL(self.stack.repr_exch[1]);
        self.V.val1.cr('nobr').VAL(self.stack.repr_exch[2]);
        
        self.V.val2.val = PARSE.decMoney(obj.in_sum, self.stack.in_cur, 8);
        self.V.val3.val = PARSE.decMoney(obj.out_sum, self.stack.out_cur, 8);
        self.V.val4.val = PARSE.decMoney(obj.bonus, self.stack.out_cur, 5);
        
        self.V.val_status.val = CONF.project.tstatus[obj.status] || obj.status;
        
        
        if ( obj.status >= 200 ) {
            self.V.img_status.src = ENGINE.path.static + 'image/history_table/ok.png';
        } else if ( obj.status > 50) {
            self.V.img_status.src = ENGINE.path.static + 'image/history_table/inprogress.png';
        } else {
            self.V.img_status.src = ENGINE.path.static + 'image/history_table/fail.png';
        }
        
        self.V.val_id.val = obj.id.toString().slice(-6);
        var url = ['/',PAGE.lang,'/transaction/#t=',obj.name].join('');
        self.V.link.href = url;
        clearEvents(self.V.link).onclick = f(ev) {
            ev.preventDefault();
            LM.go(url);
            return false;
        }
        //-evt(self.V.link, 'click', f(ev){ ev.preventDefault(); LM.go(url); });
        
        map(['in_uaccount','in_batchid','out_uaccount','out_batchid'], f(key) {
            if ( obj[key] ) {
                self.V.det1.cr('div').VAL(PAGE.ld(key)  + ': ' +obj[key]);
            }
        });
        
    }
});
new eView('history_acbill', {
    create: f() { return VIEW.history_basic(); },
    init: f(self, obj) {
        obj.details = obj.details || {};
        
        self.V.str1.val = PAGE.ld(obj.type);
        self.V.str2.val = PAGE.ld('Debited');
        self.V.str3.val = PAGE.ld('Credited');
        self.V.str4.val = PAGE.ld('Balance');
        
        var ctime = new Date(obj.mtime);
        
        self.V.time.val = [(ctime.getHours()||'--').toLen(),(ctime.getMinutes()||'--').toLen()].join(':');
        
        var curr = null;
        if ( obj._rel.acwallet ) {
            curr = obj._rel.acwallet._rel.accurrency
        }
        
        if ( obj.amount < 0 ) {
            self.V.val2.val = PARSE.decMoney(-obj.amount, curr, 8);
            self.V.val3.val = '-';
        } else {
            self.V.val2.val = '-';
            self.V.val3.val = PARSE.decMoney(obj.amount, curr, 8);
        }
        self.V.val4.val = PARSE.decMoney(obj.balance, curr, 5);
        
        if ( obj.amount > 0 ) {
            self.V.img_status.src = ENGINE.path.static + 'image/history_table/ok.png';
        } else {
            self.V.img_status.src = ENGINE.path.static + 'image/history_table/fail.png';
        }
        
        if ( obj.transaction_id ) {
            self.V.val_id.val = obj.transaction_id.toString().slice(-6);
            if ( obj.details.transaction ) {
                if ( obj.details.transaction.name ) {
                    var url = ['/',PAGE.lang,'/transaction/#t=',obj.details.transaction.name].join('');
                    self.V.link.href = url;
                    evt(self.V.link, 'click', f(ev) { LM.go(url); });
                } else {
                    self.V.str_id.detach();
                    self.V.link.setView('div');
                    self.V.link.V.viewNode.attachFirst(self.V.str_id);
                }
            } else {
                self.V.link.addCls('hidden');
            }
        } else {
            self.V.link.addCls('hidden');
        }
        
        if ( obj.details.transaction ) {
            self.stack = {
                in_cur  : ORM.O('currency_'+obj.details.transaction.in_currency_id),
                out_cur : ORM.O('currency_'+obj.details.transaction.out_currency_id),
                trans   : CO(obj.details.transaction)
            }
            //-self.V.det2.cr('span').val = [PAGE.ld('Transaction'),PAGE.ld('Debited'),''].join(' ');
            //-self.V.det2.cr('br','mob-hide');
            //-self.V.det2.cr('nobr').val = PARSE.decMoney(obj.details.transaction.in_sum,  self.stack.in_cur);
            //-self.V.det3.cr('span').val = [PAGE.ld('Transaction'),PAGE.ld('Credited'),''].join(' ');
            //-self.V.det3.cr('br','mob-hide');
            //-self.V.det3.cr('nobr').val = PARSE.decMoney(obj.details.transaction.out_sum, self.stack.out_cur);
            
            self.V.det1.cr('div').VAL(PAGE.ld('Transaction'));
            self.V.det1.cr('div').VAL([PAGE.ld('hist_in') ,': ',self.stack.trans.in_sum.toDec() ,' ',ORM.getFullName(self.stack.in_cur)].join(''));
            self.V.det1.cr('div').VAL([PAGE.ld('hist_out'),': ',self.stack.trans.out_sum.toDec(),' ',ORM.getFullName(self.stack.out_cur)].join(''));
            
            delete self.stack.trans.in_sum;
            delete self.stack.trans.in_currency_id;
            delete self.stack.trans.out_sum;
            delete self.stack.trans.out_currency_id;
            
            mapO(self.stack.trans, f(val, key) {
                if ( T(val) == T.S || T(val) == T.N ) {
                    self.V.det1.cr('div').VAL([PAGE.ld(key),': ',val].join(''));
                }
            });
        }
        
        var details = CO(obj.details);
        delete details.transaction;
        mapO(details, f(val, key) {
            if ( T(val) == T.S || T(val) == T.N ) {
                self.V.det1.cr('div').VAL([PAGE.ld(key),': ',val].join(''));
            }
        });
        
    }
});






