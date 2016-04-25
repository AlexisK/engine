new eParse('money', {
    parse: function(sum) {
        var cents = parseInt(sum * CONF.project.moneyPrecision) % CONF.project.moneyPrecision;
        var result = [];
        
        sum = parseInt(sum);
        
        for ( var val = sum; val > 0; val = parseInt(val/CONF.project.moneyFormatBy) ) {
            result.push((val%CONF.project.moneyFormatBy).toLen(3));
        }
        result = result.sl('::-1');
        result[0] = parseInt(result[0])||0;
        
        return [result.join(' '), cents.toLen()].join(', ');
    }
});

new eParse('decMoney', {
    parse: function(num, curr, maxLength) {
        num = num || 0;
        var precision = 2;
        if ( T(curr) != T.O ) { curr = ORM.O('currency_'+curr); }
        
        if ( curr ) {
            if ( curr.params && def(curr.params.precision) ) {
                precision = curr.params.precision;
            }
        }
        
        var decMap = num.toDec(precision).split('.');
        var splitIn = decMap[0].length % 3;
        decMap[0] = [decMap[0].slice(0, splitIn), decMap[0].slice(splitIn)];
        decMap[0][1] = decMap[0][1].replace(/(.{3})/g, " $1");
        decMap[0] = decMap[0].join('');
        
        var clength = decMap[0].length+decMap[1].length
        if ( maxLength && clength > maxLength) {
            var diff = clength - maxLength;
            if ( diff >= decMap[1].length ) {
                decMap.splice(1,1);
            } else {
                decMap[1] = decMap[1].slice(0, -diff);
            }
        }
        
        var result = decMap.join('.').trim();
        
        
        
        if ( curr ) {
            result = [result, ORM.getVisName(curr).toUpperCase()].join(' ');
        }
        
        return result;
    }
});


