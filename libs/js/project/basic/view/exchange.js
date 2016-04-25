
new eHtml('exchange-pop', '<h1>обмен валюты</h1><h2>\
	Обмен <span></span> <span></span><br />\
	счет  <span></span><br />\
	<span></span><br />\
	На <span></span> <span></span><br />\
	счет <span></span><br />\
	конвертация с комиссией <span></span><br />\
	с бонусом 0%\
</h2>\
<div class="modal-buttons">\
	<a href="#" class="noHref">\
		<div class="all-news big-button">подтвердить</div>\
	</a>\
</div>\
<div class="modal-buttons smalltext">\
	<div>Заявку нужно подтвердить, иначе она будет отозвана через <span></span></div>\
</div>\
<div class="progress">\
	<div class="active"></div>\
	<div class="active"></div>\
	<div></div>\
</div>', {
    span: 'sum_in,cur_in,fins0,fins1,sum_out,cur_out,fins2,comm,timerBlock',
    a: 'submit'
});


new eView('exchange-pop', {
    create: function() { return HTML['exchange-pop'](cr('div')); },
    init: function(self, obj) {
        
        mapO(obj.fset, function(fset, find) {
           self.V['fins'+find].val = fset.join(' '); 
        });
        
        self.V.sum_in.val  = PARSE.money(obj.transaction.in_amount);
        self.V.cur_in.val  = [ORM.getVisName(obj.ps_in),  ORM.getVisName(obj.cur_in)].join(' ');
        self.V.sum_out.val = PARSE.money(obj.transaction.out_amount);
        self.V.cur_out.val = [ORM.getVisName(obj.ps_out), ORM.getVisName(obj.cur_out)].join(' ');
        
        self.V.comm.val = '0%';
        
        self.F.doBill = function() {
            
            var conn = new SUBPROGRAM.payment();
            conn.setPs(obj.ps_in.name);
            conn.prep();
                
            ORM.req(obj.transaction._oname+':bill', function(resp) {
                obj.transaction = resp[0];
                conn.send(obj.transaction, function(obj) {
                    POP.modal.show(VIEW['exchange-pop2'](obj));
                });
            });
        }
        
        clearEvents(self.V.submit).onclick = function() {
            self.F.doBill();
            return false;
        }
        
        self.V.timerBlock.attach(VIEW.timer({
            expiry: obj.transaction.expiry-1000,
            red: 60000,
            onexpire: function() {
                self.V.submit.detach();
                self.V.timerBlock.val = 'Заявка отозвана';
            }
        }));
    }
});






new eHtml('exchange-pop1', '<h1>обмен валюты</h1><h2>\
	<span></span> <span></span> == <span></span> <span></span> \
	конвертация с комиссией <span></span>\
	с бонусом 0%\
</h2>\
<h2>Счет Privat24:</h2>\
<fieldset class="credit-card-input">\
	<input type="text" pattern="[0-9]*" size="4" maxlength="4" placeholder="XXXX">\
	<input type="text" pattern="[0-9]*" size="4" maxlength="4" placeholder="XXXX">\
	<input type="text" pattern="[0-9]*" size="4" maxlength="4" placeholder="XXXX">\
	<input type="text" pattern="[0-9]*" size="4" maxlength="4" placeholder="XXXX">\
</fieldset>\
\
<fieldset>\
	<input type="text" placeholder="Имя" class="name">\
	<input type="text" placeholder="Фамилия" class="last-name">\
</fieldset>\
\
<h2>Any.cash ID:</h2>\
<fieldset class="credit-card-input">\
	<input type="text" pattern="[0-9]*" size="4" maxlength="4" placeholder="XXXX">\
	<input type="text" pattern="[0-9]*" size="4" maxlength="4" placeholder="XXXX">\
	<input type="text" pattern="[0-9]*" size="4" maxlength="4" placeholder="XXXX">\
	<input type="text" pattern="[0-9]*" size="4" maxlength="4" placeholder="XXXX">\
</fieldset>\
<div class="conditions-checkbox checked">Я принимаю <a href="#" class="blue">условия</a></div>\
<div class="modal-buttons">\
	<a href="#"><div class="all-news small-button">назад</div></a>\
	<a href="#"><div class="all-news small-button">далее</div></a>\
</div>\
<div class="progress">\
	<div class="active"></div>\
	<div></div>\
	<div></div>\
</div>', {
    span: 'sum_in,cur_in,sum_out,cur_out,comm',
    a: 'agree,prev,next'
});


new eView('exchange-pop1', {
    create: function() { return HTML['exchange-pop1'](cr('div')); },
    init: function(self, obj) {
        
        
        
        self.V.sum_in.val  = PARSE.money(obj.amount);
        self.V.cur_in.val  = [ORM.getVisName(obj.ps_in),  ORM.getVisName(obj.cur_in)].join(' ');
        self.V.sum_out.val = PARSE.money(obj.out_amount)
        self.V.cur_out.val = [ORM.getVisName(obj.ps_out), ORM.getVisName(obj.cur_out)].join(' ');
        
        tm(function() {
            obj.fset = {};
            map(S('a', self), clearEvents);
            self.V.next.onclick = function() {
                
                map(S('fieldset', self), function(fset, find) {
                    obj.fset[find] = [];
                    map(S('input', fset), function(node) {
                        obj.fset[find].push(node.val||'0000');
                    });
                });
                
                var reqData = {
                    //-coffer_in:   obj.coffer_in,
                    //-coffer_out:  obj.coffer_out,
                    exchange_id: obj.exchange.id,
                    in_amount:   obj.amount,
                    out_amount:  obj.out_amount
                };
                
                ORM.req('transaction:insert', reqData, function(resp) {
                    obj.transaction = resp[0];
                    
                    POP.modal.show(VIEW['exchange-pop'](obj));
                });
                
                return false;
                
            }
        }, 10);
        
    }
});





new eHtml('exchange-pop2', '<h1>Транзакция</h1><h2></h2>\
<div class="modal-buttons">\
	<a href="#" class="noHref">\
		<div class="all-news big-button">закрыть</div>\
	</a>\
</div>\
<div class="progress">\
	<div class="active"></div>\
	<div class="active"></div>\
	<div class="active"></div>\
</div>', {
    a: 'close',
    h2: 'status'
});


new eView('exchange-pop2', {
    create: function() { return HTML['exchange-pop2'](cr('div')); },
    init: function(self, obj) {
        
        if ( obj.status >= 20 && obj.status <= 30 ) {
            self.V.status.val = 'Перевод прошел успешно - ожидайте начисления средств.';
        } else {
            self.V.status.val = 'Не удалось осуществить перевод';
        }
        
        clearEvents(self.V.close).onclick = function() {
            POP.modal.hide();
            return false;
        }
        
    }
});



new eHtml('exchange-pop-detailed','<h1></h1><div class="vc"></div>',{
    h1: 'title',
    '.vc': 'viewcalc'
});


new eView('exchange-pop-detailed', {
    create: function() { return HTML['exchange-pop-detailed'](cr('div')); },
    init: function(self, obj) {
        self.V.title.val = PAGE.ld('exchange');
        self.V.viewcalc.attach(obj.form);
    }
});







new eHtml('exchange-rateline-subitem', '<img width="43" height="31" /><div class="sum"></div><div class="desc"></div>', {
    img: 'logo',
    div: 'sum,desc'
});

new eView('exchange-rateline-subitem', {
    create: f(){ return HTML['exchange-rateline-subitem'](cr('div', 'pos')); },
    init: f(self, obj) {
        var imgUrl = [ENGINE.path.static, 'image/ps/', obj._rel.paysystem.viewparams.imgHover].join('');
        self.V.logo.src = imgUrl;
        self.V.desc.val = [ORM.getVisName(obj._rel.paysystem),ORM.getVisName(obj)].join(' ');
    }
});


new eView('exchange-rateline', {
    create: f(){ return _jO(cr('div', 'exchange_rateline')); },
    init: f(self, obj) {
        self.V.pos1 = VIEW['exchange-rateline-subitem'](obj._rel.in_currency);
        self.V.pos2 = VIEW['exchange-rateline-subitem'](obj._rel.out_currency);
        
        var rate = optDelim(obj.rate.toDec());
        
        self.V.pos1.V.sum.val = rate[0];
        self.V.pos2.V.sum.val = rate[1];
        
        ADAPTER.dec.process(self.V.pos1.V.sum);
        ADAPTER.dec.process(self.V.pos2.V.sum);
        
        self.attach(self.V.pos1);
        self.attach(self.V.pos2);
        
        SVG.arrRight.bg(self, {fill:'#666'});
    }
});







