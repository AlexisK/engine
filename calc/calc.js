// in_sum   - номинальная сумма оплаты
// in_bill  - сумма счета для оплаты
// in_user  - сумма фактической оплаты клиентом
// in_cash  - сумма фактического дохода
// out_sum  - номинальная сумма выплаты
// out_bill - сумма счета для выплаты
// out_user - сумма фактической выплаты клиенту
// out_cash - сумма фактического расхода

// Комиссия:
// add  - аддитивная сумма комиссии
// mult - мультипликативный коэффицент комиссии (процент)
// min  - минимальный размер комиссии
// max  - максимальный размер комиссии
// t    - тип комиссии, а именно:
//      'customer'  - комиссия для клиента
//      'exchange'  - комиссия для обменника
//      'exch2cust' - комиссия обменника, переносимая на клиента (а ля приват24)
//      'cust2exch' - комиссия пользователя, переносимая на обменник (на практике не используется)

// Пример комиссии:
// комиссия составлят 2%+10 у.е., но не менее 20 у.е. и не более 50 у.е.
// fee = {
//         add: 10,
//         mult: 0.02,
//         min: 20,
//         max: 50,
//         t: 'customer'
// }

var r = {
    in_fee: {
        add: 5,
        mult: 0.02,
        min: 0,
        max: 10,
        t: 'customer'
    },
    out_fee : {
        add: 0,
        mult: 0.02,
        min: 0,
        max: 0,
        t: 'customer'
    },
    rate: [1, 22],
    rateRev: [21, 1],
    in_sum: 22000
}

function def(val) { return typeof(val) != 'undefined' && val != null; }

var calcObj = {};

calcObj.feeCalc = function(sum, fee, rev) {
    var extra = 0;
    if ( def(fee.mult) ) { extra = sum * fee.mult; }
    if ( def(fee.add) ) { extra += fee.add; }
    extra = calcObj._feeMinMax(extra, fee);
    if ( def(rev) ) { extra *= -1; }
    return sum + extra;
}

calcObj._feeMinMax = function(extra, fee) {
    if ( def(fee.min) && extra < fee.min ) { extra = fee.min; }
    else if ( def(fee.max) && fee.max && extra > fee.max ) { extra = fee.max; }
    return extra;
}

calcObj.feeDecalc = function(sum, fee, rev) {
    var extra = 0;
    var sumSrc = sum;
    if ( def(rev) ) {
        if ( def(fee.add) ) { extra = fee.add; sum += fee.add; }
        if ( def(fee.mult) ) { extra = sum/(1-fee.mult) - sum; }
        extra = calcObj._feeMinMax(extra, fee);
    } else {
        if ( def(fee.add) ) { extra = -fee.add; sum -= fee.add; }
        if ( def(fee.mult) ) { extra -= sum - sum/(1+fee.mult); }
        extra = -calcObj._feeMinMax(-extra, fee);
    }
    return sumSrc + extra;
}


calcObj.calc = function(r) {
    if ( def(r.in_sum) && r.in_sum ) { r.out_sum = r.in_sum * r.rate[0] / r.rate[1]; }
    else { r.in_sum = r.out_sum * r.rate[1] / r.rate[0]; }
    
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
            r.out_bill = calcObj.feeDecalc(r.out_sum, r.out_fee);
            r.out_cash = r.out_sum;
            r.out_user = r.out_bill;
        },
        cust2exch: function() {
            r.out_bill = calcObj.feeDecalc(r.out_sum, r.out_fee, 1);
            r.out_cash = r.out_bill;
            r.out_user = r.out_sum;
        },     
    };
    todo[r.out_fee.t]();
    
    var tmp = r.out_cash * r.rateRev[1] / r.rateRev[0];
    r.profit = r.in_cash - r.out_cash;
    r.profit2 = r.profit * r.rateRev[0] / r.rateRev[1];
}

