

function translogIOFill(node, objD) {
    mapO(objD, f(obj, key) {
        var newLine = node.cr('tr');
        var keyNode = newLine.cr('td').VAL(key);
        
        if ( T(obj) == T.S || T(obj) == T.N ) {
            newLine.cr('td').VAL(obj);
        } else {
            var valNode = newLine.cr('td').cr('table','translog');
            translogIOFill(valNode, obj);
        }
        
    });
}

new eTable2('inbill', {
    strs: {
        ctime           : 'Созд.'
    },
    fields: parseLS('id,ctime,transaction_id,currency,coffer_id,in_bill,in_cash,is_fraud,status'),
    fieldFunc: {
        'ctime'                    : TVIEW.time,
        'coffer_id'                : TVIEW.rel,
        'in_bill,in_cash'          : TVIEW.money,
        'is_fraud'                 : TVIEW.bool,
        'currency'                 : f(obj, key) { return TVIEW.currency(obj._rel.coffer, 'currency_id'); },
        'status'                   : function(obj, key) { return TVIEW.mapper(CONF.project.inbillStatus, obj, key); }
    },
    cls: 'exch-table',
    filter: {
        'id,transaction_id' : TINP.number,
        'ctime'             : TINP.rangeTime,
        'coffer_id'         : f(self, f) { return TINP.modelDropdown(self,f,'coffer'); },
        'is_fraud'          : TINP.bool,
        'in_bill,in_cash'   : TINP.rangeDec,
        'currency'          : f(self, f) { return TINP.modelJoinDropdown(self,f,'coffer','currency'); },
        'status'            : f(self, f) { return TINP.dropdown(self,f,CONF.project.inbillStatus); }
    },
    sorter: parseLS('id,ctime,status'),
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
        
        if ( obj.tstatus >= 200 ) {
            node.addCls('green');
        }
        
        var infoObj = cr('table', 'translog');
        translogIOFill(infoObj, obj.params);
        var infoBtn = cr('div','asBtn').VAL(PAGE.ld('params'));
        infoBtn.onclick = f() {
            POP.drag.showNew(infoObj);
        }
        var infoObj2 = cr('table', 'translog');
        translogIOFill(infoObj2, obj.result);
        var infoBtn2 = cr('div','asBtn').VAL(PAGE.ld('result'));
        infoBtn2.onclick = f() {
            POP.drag.showNew(infoObj2);
        }
        
        info.add('link', infoBtn);
        info.add('link', infoBtn2);
        
        return node;
    },
    lineHeight: 17
});



