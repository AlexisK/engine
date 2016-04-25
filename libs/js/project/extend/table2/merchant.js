

new eTable2('merchant', {
    level:%levelAdmin,
    fields: parseLS('id,title,paysystem_id,is_active'),
    fieldFunc: {
        'paysystem_id' : TVIEW.rel,
        'is_active'    : TVIEW.bool
    },
    colCls: {
        'is_active' : 'chb'
    },
    filter: {
        'id'           : TINP.number,
        'paysystem_id' : f(self, f) { return TINP.modelDropdown(self,f,'paysystem'); },
        'is_active'    : TINP.bool,
        'title'        : TINP.like
    },
    sorter: parseLS('id,is_active'),
    rowGen: function(obj) {
        var node = cr('tr','green');
        var info = new ST(node);
        
        if ( !obj.is_active ) { info.add('error', 'inactive'); node.addCls('red'); }
        if ( !obj.is_active_in ) { info.add('error', 'inactive in'); node.addCls('red'); }
        if ( !obj.is_active_out ) { info.add('error', 'inactive out'); node.addCls('red'); }
        
        
        var inbillStatBtn = cr('div','asBtn').VAL(PAGE.ld('inbill statistics'));
        inbillStatBtn.onclick = f() {
            ORM.req('coffer:select',f(list) {
                if ( list.length == 0 ) {
                    SYS.notify(PAGE.ld('No coffers for this merchant!'), 'red center');
                } else {
                    var rlist = [];
                    map(list, f(o) { rlist.push(o.id); });
                    
                    var view = VIEW.coffer_inbill_statistics({
                        title: PAGE.ld('Statistic for merchant')+' '+obj.id,
                        selector: {
                            coffer_id:['in',rlist]
                        }
                    });
                    
                    POP.window.show(view);
                }
            }, { selector: {merchant_id:['=',obj.id]}});
        }
        
        info.add('info', inbillStatBtn);
        
        
        var getHistoryBtn = cr('div','asBtn').VAL(PAGE.ld('get history'));
        getHistoryBtn.onclick = f() {
            var table = cr('table','translog');
            POP.drag.showNew(table);
            ORM.req(obj._oid+':getHistory',f(list, t, rdata) {
                var fields = rdata.fields[0]; fields.splice(0,1);
                
                var row = table.cr('tr');
                
                map(fields, f(f) { row.cr('td').VAL(f); })
                
                map(list, f(item) {
                    var row = table.cr('tr');
                    map(fields, f(f) { row.cr('td').VAL(item[f]); })
                });
                
            });
        }
        info.add('info', getHistoryBtn);
        
        
        var showPayoutBtn = cr('div','asBtn').VAL(PAGE.ld('payout on this merchant'));
        showPayoutBtn.onclick = f() {
            var view = VIEW.merchant_payout_form(obj);
            POP.modal.show(view);
        }
        info.add('info', showPayoutBtn);
        
        return node;
    },
    lineHeight: 17
});



