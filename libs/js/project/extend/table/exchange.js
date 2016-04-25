
eTable.currency = function(cur) {
    var ps = ORM.O('paysystem_'+cur.paysystem_id);
    
    var imgUrl = [ENGINE.path.static, 'image/ps/', ps.viewparams.imgHover].join('');
    
    var node = cr('div','rate');
    node._txt = node.cr('div').VAL(ORM.getVisName(ps));
    var curName = ORM.getVisName(cur);
    node._txt.cr('div', 'c_'+curName.toLowerCase()).VAL(curName);
    node._txt.style.backgroundImage = 'url('+imgUrl+')';
    
    return node;
}




{
    
    function crRateTBlock(obj, key, smk) {
        var cIn  = ORM.O('currency_'+obj[key+'_currency_id']);
        
        var node = eTable.currency(cIn);
        node.addCls('wide');
        node._val = node.cr('input').attr({type:'number'});
        node._val.val = obj.rate[smk].toDec();
        node.attachFirst(node._val);
        
        return node;
    }
    
    new eTable('exchange', {
        cls    : 'exch-table',
        fields : 'id',
        customFields: {
            'Источник,Проц,IN,OUT,Автовыплата,Дата изм.,Авто,Вкл.': function(obj) {
                var rb1 = crRateTBlock(obj, 'in', 'i');
                var rb2 = crRateTBlock(obj, 'out', 'o');
                
                var onupd = function() {
                    ORM.req(obj._oid+':update',{rate:{i:(rb1._val.val).fromDec(),o:(rb2._val.val).fromDec()}});
                }
                rb1._val.onupdate(onupd);
                rb2._val.onupdate(onupd);
                
                
                return [
                    cr.dropdown(parseLS('ЦБ1,ЦБ2,ЦБ3')),
                    cr('input').attr({type:'number',placeholder:'%'}),
                    rb1,
                    rb2,
                    eTable.bool(obj, 'is_auto'),
                    formatDate(obj.mtime, true, true),
                    eTable.bool(obj, 'is_autorepel'),
                    eTable.bool(obj, 'is_active')
                    ];
            }
        },
        clsCols: parseLS(',,cur,cur,,,chb,chb')
    });
}













