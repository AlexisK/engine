
ENGINE.decPrecision = 9;
ENGINE.decMult = Math.pow(10,ENGINE.decPrecision);
ENGINE.decDisplay = 5;
ENGINE._decDiff = Math.pow(10,ENGINE.decPrecision-ENGINE.decDisplay);


function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}


function toDec(val, nums) {
    if ( !def(nums) ) { nums = ENGINE.decDisplay; }
    var isNegative = (val < 0);
    if ( isNegative ) { val *= -1; }
    var decDiff = Math.pow(10,ENGINE.decPrecision-nums);
    var val = Math.floor(val);
    var n = Math.floor(val / ENGINE.decMult);
    
    if ( nums == 0 ) {
        return (isNegative && '-' || '')+n;
    }
    
    var d = val % ENGINE.decMult;
    var str = [(isNegative && '-' || '')+n,Math.abs(Math.floor(d/decDiff)).toLen(nums)].join('.');
    return str;
}

extendPrimitive(T.N, 'toDec', f(nums) { return toDec(this, nums); });
extendPrimitive(T.S, 'toDec', Number.prototype.toDec );


function fromDec(val) {
    cval = parseFloat(val);
    var isNegative = ((cval < 0) && ( (cval *= -1) || true ));
    var val = toFixed(Math.abs(val)).toString();
    var pos = val.indexOf('.');
    var precd = ENGINE.decPrecision;
    if ( pos != -1 ) {
        var tp = val.length - pos - 1;
        precd -= tp;
        val = val.rp('.','');
    }
    val = Math.floor(val);
    if ( isNegative ) { val *= -1; }
    return Math.floor(val * Math.pow(10,precd));
}
extendPrimitive(T.N, 'fromDec', f(){ return fromDec(this); });
extendPrimitive(T.S, 'fromDec', Number.prototype.fromDec );


function GCD(a, b) {
    if ( ! b) { return a; }
    return GCD(b, a % b);
};

function optDelims(a,b) {
    var del = GCD(a,b);
    if ( del % 1 == 0 ) {
        return [a/del, b/del];
    }
    return [a,b];
}

function optDelim(x) {
    if ( !x ) { return [1,Infinity]; }
    x = parseFloat(x);
    if ( x < 1 ) {
        return [1, 1/x];
    }
    return [x, 1];
}






function jN(a,b, noopt) {
    b = b || 1;
    if ( !noopt ) {
        return findNat(a/b);
    }
    var obj = new T.A(a,b);
    
    obj.valueOf = function() {
        return this[0]/this[1];
    }
    
    return obj;
}




function parseJN(val, add) {
    if ( T(val) == T.N ) {
        if ( !def(add) ) { add = 1; }
        return jN(val, add);
    }
    return val;
}



function findNat(fl) {
    for ( var i = 1; i < 1000; i += 1 ) {
        var t = fl * i;
        if ( t % 1 == 0 ) { return jN(t, i, true); }
    }
    return jN(fl, 1, true);
}


