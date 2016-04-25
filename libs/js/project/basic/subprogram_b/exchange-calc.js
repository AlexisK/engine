







var calcObj = {};
calcObj.resultfields = parseLS('in_sum,in_bill,in_user,in_cash,out_sum,out_bill,out_user,out_cash,profit,profit2,bonus_out,partner_out');

calcObj.resultMap = [
        ['profit',      'profit', 'profit2' ],
        ['for anycash', 'in_cash','out_cash'],
        ['for user',    'in_user','out_user'],
        ['bill',        'in_bill','out_bill']
    ];

calcObj.fee_types = {
        customer  : 'На кленте',
        exchange  : 'На обменнике',
        cust2exch : 'На кленте, перенос на обмен',
        exch2cust : 'На обменнике, перенос на клиента(privat24)'
    };

calcObj.defObj = {
        def_fee: {
            add: 0,
            mult: 0,
            min: 0,
            max: 0,
            t: 'customer'
        },
        in_fee: {
            add: 0,
            mult: 0,
            min: 0,
            max: 0,
            t: 'exch2cust'
        },
        in_out_fee : {
            add: 0,
            mult: 0,
            min: 0,
            max: 0,
            t: 'customer'
        },
        out_fee : {
            add: 0,
            mult: 0,
            min: 0,
            max: 0,
            t: 'exchange'
        },
        out_in_fee : {
            add: 0,
            mult: 0,
            min: 0,
            max: 0,
            t: 'customer'
        },
        rate: (1).fromDec(),
        rateRev: (1).fromDec(),
        in_sum: 0
    };



calcObj.feeCalc = function(sum, fee, rev) {
    var extra = 0;
    if ( def(fee.mult) ) { extra = Math.floor(sum / ENGINE.decMult * fee.mult); }
    if ( def(fee.add) ) { extra += fee.add; }
    extra = calcObj._feeMinMax(extra, fee);
    if ( def(rev) ) { extra *= -1; }
    return sum + extra;
}

calcObj._feeMinMax = function(extra, fee) {
    if ( def(fee.min) && fee.min && extra < fee.min ) { extra = fee.min; }
    else if ( def(fee.max) && fee.max && extra > fee.max ) { extra = fee.max; }
    return extra;
}

calcObj._prepareFee = function(fee) {
    def_fee = calcObj.defObj.def_fee;
    if ( !def(fee) ) { return CO(def_fee); }
    
    map(okeys(def_fee), function(k) {
        if ( !def(fee[k]) || fee[k] == '' ) { fee[k] = def_fee[k]; }
    })
    return fee;
}

calcObj.feeDecalc = function(sum, fee, rev) {
    var extra = 0;
    var sumSrc = sum;
    if ( def(rev) ) {
        if ( def(fee.add) ) { extra = fee.add; sum += fee.add; }
        if ( def(fee.mult) ) { extra = Math.floor(sum/(ENGINE.decMult-fee.mult)*ENGINE.decMult) - sumSrc; }
        extra = calcObj._feeMinMax(extra, fee);
    } else {
        if ( def(fee.add) ) { extra = -fee.add; sum -= fee.add; }
        if ( def(fee.mult) ) { extra -= sumSrc - Math.floor(sum/(ENGINE.decMult+fee.mult)*ENGINE.decMult); }
        extra = -calcObj._feeMinMax(-extra, fee);
    }
    return sumSrc + extra;
}

calcObj.calc = function(r) {
    //-console.log('req',r);
    if ( def(r.in_sum) && r.in_sum ) { r.out_sum = Math.floor(r.in_sum / r.rate * ENGINE.decMult); }
    else { r.in_sum = Math.floor(r.out_sum / ENGINE.decMult * r.rate); }
    r.in_fee = calcObj._prepareFee(r.in_fee);
    r.out_fee = calcObj._prepareFee(r.out_fee);
    
    var todo = {
        customer: function() {
            r.in_bill = r.in_sum;
            r.in_cash = r.in_sum;
            r.in_user = calcObj.feeCalc(r.in_sum, r.in_fee);
        },
        exchange: function() {
            r.in_bill = r.in_sum;
            r.in_cash = calcObj.feeCalc(r.in_sum, r.in_fee, 1);
            r.in_user = r.in_sum;            
        },
        exch2cust: function() {
            r.in_bill = calcObj.feeCalc(r.in_sum, r.in_fee);
            r.in_cash = calcObj.feeCalc(r.in_bill, r.in_fee, 1);
            r.in_user = r.in_bill;
        },
        cust2exch: function() {
            r.in_bill = calcObj.feeDecalc(r.in_sum, r.in_fee);
            r.in_cash = r.in_bill;
            r.in_user = r.in_sum;
        }
    };
    todo[r.in_fee.t]();
    
    var todo = {
        customer: function() {
            r.out_bill = r.out_sum;
            r.out_cash = r.out_sum;
            r.out_user = calcObj.feeCalc(r.out_sum, r.out_fee, 1);
        },
        exchange: function() {
            r.out_bill = r.out_sum;
            r.out_cash = calcObj.feeCalc(r.out_sum, r.out_fee);
            r.out_user = r.out_sum;
        },
        exch2cust: function() {
            r.out_bill = calcObj.feeCalc(r.out_sum, r.out_fee, 1);
            r.out_cash = calcObj.feeCalc(r.out_bill, r.out_fee);
            r.out_user = r.out_bill;
        },
        cust2exch: function() {
            r.out_bill = calcObj.feeDecalc(r.out_sum, r.out_fee, 1);
            r.out_cash = r.out_bill;
            r.out_user = r.out_sum;
        },     
    };
    todo[r.out_fee.t]();
    
    r.bonus_out = Math.floor(r.out_sum / ENGINE.decMult * r.bonus);
    calcObj.profit(r);
    //-console.log('resp',r);
}


calcObj.profit = function(r) {
    r.partner_out = Math.floor(r.out_sum / ENGINE.decMult * r.partner);
    
    var tmp = r.in_sum;
    if ( r.in_out_fee.t == 'exchange' ) {
        tmp = calcObj.feeCalc(tmp, r.in_out_fee);   
    } else if ( r.in_out_fee.t == 'cust2exch' ) {
        tmp = calcObj.feeDecalc(tmp, r.in_out_fee, 1);
    } else if ( r.in_out_fee.t == 'exch2cust' ) {
        tmp = calcObj.feeCalc(tmp, r.in_out_fee);
        tmp = calcObj.feeCalc(tmp, r.in_out_fee, 1);
    }
    //-console.log(tmp);
    tmp = Math.floor(tmp * ENGINE.decMult / r.rateRev );
    //-console.log(tmp);
    
    if ( r.out_in_fee.t == 'exchange' ) {
        tmp = calcObj.feeCalc(tmp, r.out_in_fee);
    } else if ( r.out_in_fee.t == 'cust2exch' ) {
        var tmp2 = calcObj.feeDecalc(tmp, r.out_in_fee);
        tmp = tmp + (tmp - tmp2);
    } else if ( r.out_in_fee.t == 'exch2cust' ) {
        var tmp2 = calcObj.feeCalc(tmp, r.out_in_fee);
        tmp2 = calcObj.feeCalc(tmp, r.out_in_fee, 1);
        tmp = tmp + (tmp2 - tmp);
    }
    //-console.log(tmp);
    
    r.profit2 = Math.floor((r.out_sum - r.out_cash + r.out_sum - tmp) / 2) - r.bonus_out;
    
    tmp = Math.floor(r.profit2 / 2);
    if ( r.partner_out > tmp ) {
        if ( tmp < 0 ) { r.partner_out = 0; }
        else { r.partner_out = tmp; }
    }
    r.profit2 -= r.partner_out;
    r.profit = r.profit2 / r.rateRev * ENGINE.decMult;
}





