

new eTable2('transaction', {
    strs: {
        profit          : 'Прибыль',
        bonus           : 'Бонус',
        partner         : 'Партнеру',
        profit2         : 'Итого',
        is_cancelled    : 'Закр.',
        is_fraud        : 'Мош',
        is_manual       : 'Ручн.',
        is_grey         : 'Серая',
        is_expired      : 'Ист.',
        in_currency_id  : 'Вход валюта',
        out_currency_id : 'Исхд валюта',
        in_sum          : 'Отдают',
        out_sum         : 'Получают',
        in_uaccount     : 'Плательщик',
        out_uaccount    : 'Получатель',
        status          : 'Статус',
        ctime           : 'Созд.'
    },
    fields: parseLS('id,name,ctime,in_sum,in_currency_id,out_sum,out_currency_id,in_uaccount,in_batchid,out_uaccount\
                    ,out_batchid,owner_id,referer_id,email,ip,profit,bonus,partner,profit2,is_cancelled,is_fraud,is_manual,is_grey,is_expired,status,tstatus'),
    fieldFunc: {
        'ctime'                                              : TVIEW.time,
        'in_sum,out_sum,profit,bonus,partner,profit2'        : function(obj, key) { return toDec(obj[key]); },
        'in_currency_id,out_currency_id'                     : TVIEW.currency,//-      function(obj, key) { return TVIEW.entity('currency', obj, key); },
        'is_cancelled,is_fraud,is_manual,is_grey,is_expired' : TVIEW.boolReadonly,
        'status'                                             : function(obj, key) { return TVIEW.mapper(CONF.project.tstatus, obj, key); },
        'tstatus'                                            : function(obj, key) { return TVIEW.mapper(CONF.project.ts_tech, obj, key); }
    },
    cls: 'exch-table',
    colCls: {
        'name'                           : 'token',
        'in_currency_id,out_currency_id' : 'cur bl',
        'in_sum,out_sum'                 : 'cur'
    },
    filter: {
        'id,owner_id,referer_id'                                        : TINP.number,
        'ctime'                                                         : TINP.rangeTime,
        'in_sum,out_sum,profit,bonus,partner,profit2'                   : TINP.rangeDec,
        'is_cancelled,is_fraud,is_manual,is_grey,is_expired'            : TINP.bool,
        'in_currency_id,out_currency_id'                                : function(self, f) { return TINP.modelDropdown(self,f,'currency'); },
        'in_uaccount,out_uaccount,in_batchid,out_batchid,name,email,ip' : TINP.like,
        'status'                                                        : function(self, f) { return TINP.dropdown(self,f,CONF.project.tstatus); },
        'tstatus'                                                       : function(self, f) { return TINP.dropdown(self,f,CONF.project.ts_tech); }
    },
    sorter: parseLS('id,ctime,in_sum,out_sum,in_currency_id,out_currency_id,profit,bonus,partner,profit2,is_cancelled,is_fraud,status'),
    rowGen: function(obj) {
        var node = cr('tr','green');
        var info = new ST(node);
        
        var btns = {
            setManual: cr('div','asBtn').VAL(PAGE.ld('setManual')),
            cancel: cr('div','asBtn').VAL(PAGE.ld('cancel')),
            refundUserProfit: cr('div','asBtn').VAL(PAGE.ld('refund user profit')),
            refundSystemProfit: cr('div','asBtn').VAL(PAGE.ld('refund system profit')),
            refundFixedFee: cr('div','asBtn').VAL(PAGE.ld('refund fixed fee')),
            refundAcwallet: cr('div','asBtn').VAL(PAGE.ld('refund Anycash wallet')),
            setCalcResult:  cr('div','asBtn').VAL(PAGE.ld('set calculation result')),
            payout: cr('div','asBtn').VAL(PAGE.ld('payout')),
            recalc: cr('div','asBtn').VAL(PAGE.ld('recalc'))
        };
        
        if ( obj.is_manual ) {
            info.add('warning', 'Transaction is set to be manual.');
            node.addCls('warning');
        } else if ( obj.tstatus <= CONF.project.transactionMethodLimit.setManual[1] && obj.tstatus >= CONF.project.transactionMethodLimit.setManual[0] ) {
            info.add('info', btns.setManual);
            btns.setManual.onclick = f() {
                ORM.req(obj._oid+':setManual', f(){});
            }
        }
        
        if ( obj.is_cancelled ) {
            info.add('error', 'this transaction was cancelled by server.');
            node.addCls('red');
        } else if ( obj.tstatus <= CONF.project.transactionMethodLimit.cancel[1] && obj.tstatus >= CONF.project.transactionMethodLimit.cancel[0] ) {
            info.add('info', btns.cancel);
            btns.cancel.onclick = f() {
                ORM.req(obj._oid+':admCancel', f(){});
            }
        }
        
        
        map(['refundUserProfit','refundSystemProfit','refundFixedFee','refundAcwallet','setCalcResult','payout','recalc'], f(method) {
            
            if ( obj.tstatus <= CONF.project.transactionMethodLimit[method][1] && obj.tstatus >= CONF.project.transactionMethodLimit[method][0] ) {
                info.add('info', btns[method]);
                btns[method].onclick = f() {
                    ORM.req(obj._oid+':'+method, f(){});
                }
            }
            
        });
        
        
        
        
        //-info.add('link', cr('hr'));
        
        var ic = ORM.O('currency_'+obj.in_currency_id);
        var oc = ORM.O('currency_'+obj.out_currency_id);
        
        var billMenuBtn = TSTMenu.table('inbill', { transaction_id: ['=',obj.id] });
        var listsMenuBtn = cr('div','asBtn').VAL('grey/black lists');
        listsMenuBtn.onclick = f() {
            POP.info.showNew(VIEW.transactionDetails(obj));
        }
        
        info.add('link', TSTMenu.table('user', { id: ['=',obj.owner_id] }));
        if ( obj.referer_id ) {
            info.add('link', TSTMenu.table('user', { id: ['=',obj.referer_id] }));
        }
        if ( obj.exchange_id ) { info.add('link', TSTMenu.table('exchange', { id: ['=',obj.exchange_id] })); }
        info.add('link', TSTMenu.table('translog', { transaction_id: ['=',obj.id] }));
        info.add('link', billMenuBtn);
        if ( ic ) { info.add('link', TSTMenu.table('currency', { id: ['=',ic.id] }, 'in currency')); }
        if ( oc ) { info.add('link', TSTMenu.table('currency', { id: ['=',oc.id] }, 'out currency')); }
        info.add('link', listsMenuBtn);
        
        
        if ( PAGE.level >= %levelModerator ) {
            var poutBtn = cr('div','asBtn').VAL(PAGE.ld('manual payout'));
            poutBtn.onclick = f() {
                SYS.input(PAGE.ld('Payout amount'), 'center', f(val) {
                    ORM.req('transaction:manualPayout', {currency_id:obj.out_currency_id, out_sum:val, u_params:obj.u_params})
                }, {
                    init: f(node, inp) {
                        inp.attr('type','input');
                        ADAPTER.dec.process(inp);
                        inp.val = obj.out_sum;
                    },
                    validator: f(node) { return VALIDATOR.notEmpty(node) && T(node.val) == T.N; }
                });
            }
            info.add('link', poutBtn);
        }
        
        
        if ( obj.is_fraud ) {
            info.add('warning', 'perhaps this transaction is fraud. Consider to do something with it\'s owner.');
            node.addCls('red');
        }
        if ( obj.is_grey ) {
            info.add('warning', 'Transaction is in greylist.');
            node.addCls('red');
        }
        if ( obj.is_expired ) {
            info.add('error', 'Transaction expired!');
            node.addCls('red');
        }
        
        //-if ( obj.profit2 < 0 ) {
        //-    info.add('fatal', 'unprofitable transaction!');
        //-    node.addCls('fatal');
        //-} else if ( obj.profit2 == 0 ) {
        //-    info.add('warning', 'unprofitable transaction!');
        //-    node.addCls('warning');
        //-}
        
        
        //-var counterBillsBlock = cr('div');
        //-
        //-info.add('info', counterBillsBlock);
        
        
        //-var infoObj = cr('table');
        //-infoObj.cr('tr').cr('th').attr({colspan:4}).VAL('calcinfo');
        //-
        //-map(['bill','cash','sum','user'], function(key) {
        //-    var key1 =  'in_'+key;
        //-    var key2 = 'out_'+key;
        //-    var row = infoObj.cr('tr');
        //-    row.cr('td').VAL(key1+':');
        //-    row.cr('td').VAL(obj.calc_result[key1].toDec());
        //-    row = infoObj.cr('tr');
        //-    row.cr('td').VAL(key2+':');
        //-    row.cr('td').VAL(obj.calc_result[key2].toDec());
        //-});
        //-
        //-info.add('info', infoObj);
        
        
        info.add('info', PAGE.ld('explain_'+CONF.project.ts_tech[obj.tstatus]));
        
        
        
        info.onshow = f() {
            ORM.req('inbill:select', f(t1,t2,details) {
                //-counterBillsBlock.val = 'bills: '+details.count;
                billMenuBtn.val = PAGE.ld('inbill') + ' (' + details.count + ')';
            }, {
                selector:{
                    transaction_id:['=',obj.id]
                },
                range:[0,0]
            })
        }
        
        
        //-if ( obj.status == 200 ) { return node; }
        //-if ( obj.status == 160 ) {
        //-    node.addCls('red');
        //-    return node;
        //-}
        //-if ( obj.is_fraud ) {
        //-    node.addCls('warning');
        //-    return node;
        //-}
        //-if ( obj.status >= 30 ) {
        //-    node.addCls('green');
        //-}
        return node;
    },
    //-timeRange: 'ctime',
    lineHeight: 38
});



