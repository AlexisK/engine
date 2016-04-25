
TVIEW.money = f(obj, key) {
    var node = cr('div','mn');
    node.val = parseInt(obj[key]).toDec();
    return node;
}

TVIEW.currency = function(obj, key) {
    var cur = ORM.O('currency_'+obj[key]);
    if ( !cur ) { return cr('span'); }
    var ps = ORM.O('paysystem_'+cur.paysystem_id);
    if ( !ps ) { return cr('span').VAL(cur.displayname); }
    
    var node = cr('div','rate');
    node._txt = node.cr('div');
    node._txt.cr('nobr').VAL(ORM.getVisName(ps));
    var curName = ORM.getVisName(cur);
    node._txt.cr('div', 'c_'+curName.toLowerCase()).VAL(curName);
    
    
    if ( ps.viewparams.imgHover ) {
        var imgUrl = [ENGINE.path.static, 'image/ps/', ps.viewparams.imgHover].join('');
        node._txt.style.backgroundImage = 'url('+imgUrl+')';
    }
    
    return node;
}

TVIEW.rate = function(obj, key) {
    var smk = (key[0] == 'o') && 1 || 0;
    
    var node = TVIEW.currency(obj, key);
    node.addCls('wide');
    
    if ( obj.rate ) {
        node._val = node.cr('input').attr({type:'number'});
        var rateV = optDelim(obj.rate.toDec(ENGINE.decPrecision));
        node._val.val = rateV[smk];
        node.attachFirst(node._val);
        
        node._val.onupdate(function(nv) {
            var rateVUpd = optDelim(obj.rate.toDec(ENGINE.decPrecision));
            rateVUpd[smk] = parseFloat(nv);
            var reqD = {rate: (rateVUpd[0]/rateVUpd[1]).fromDec()};
            ORM.req(obj._oid+':update', reqD, function() {
                SYS.notify('updated','ok');
            });
        });
        
    }
    
    
    node._noST = true;
    
    return node;
}

TVIEW.deposit = function(obj, key) {
    var node = cr('div', 'deposit');
    
    node._val = node.cr('input').attr({type:'number'});
    node._val.val = (obj[key] * CONF.project.payoutPerYear).toDec();

    node._val.onupdate(function(nv) {
        nv = nv.fromDec() / CONF.project.payoutPerYear;
        var reqD = { deposit: Math.round(nv) };

        ORM.req(obj._oid+':update', reqD, function() {
            SYS.notify('updated','ok');
        });
    });

    node._noST = true;

    return node;
}







