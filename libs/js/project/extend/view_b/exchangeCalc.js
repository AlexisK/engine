new eHtml('exchange-calc-fee', '<div></div>\
<div><p>add</p><input type="number" /></div>\
<div><p>mult</p><input type="number" /></div>\
<div><p>min</p><input type="number" /></div>\
<div><p>max</p><input type="number" /></div>\
<div><p>type</p><div class="dd"></div></div>', {
    input:'add,mult,min,max',
    '.dd':'type',
    div: 'title'
});


new eView('exchange-calc-fee', {
    create: function() { return HTML['exchange-calc-fee'](cr('div','calc-fee')); },
    init: function(self, obj) {
        var data = mergeObjects({
            add  : 0,
            mult : 0,
            min  : 0,
            max  : 0,
            t: 'customer'
        },obj);
        
        self.V.t = cr.dropdown(calcObj.fee_types);
        self.V.type.attach(self.V.t);
        
        self.F.update = function() {};
        
        self.F.fetchDataIn = function() {
            self.V.t.val    = data.t;
            //-self.V.mult.val = parseFloat(data.mult);
            delete data.t;
            //-delete data.mult;
            
            mapO(data, function(val, key) {
                self.V[key].val = val.toDec();
            });
            return data;
        };
        self.F.fetchDataOut = function() {
            var obj = CO(data);
            delete obj.t;
            //-delete obj.mult;
            mapO(obj, function(val, key) {
                data[key] = self.V[key].val.fromDec();
            });
            data.t    = self.V.t.val;
            //-data.mult = parseFloat(self.V.mult.val);
            return data;
        };
        
        $P(self, 'val', function() {
            return self.F.fetchDataOut();
        }, function(newData) {
            data = mergeObjects(data, newData);
            return self.F.fetchDataIn();
        });
        
        self.F.fetchDataIn();
        
        mapO(data, function(val, key) {
            self.V[key].onupdate(function() {
                self.F.update(self.F.fetchDataOut());
            });
        });
        
    }
});






new eHtml('exchange-calc', '<div class="fee-block" style="height:270px;">\
    <div class="rates-block">\
        <div class="rate-block"><p>rate</p><input type="number" /><input type="number" /></div>\
        <div class="rate-block"><p>rateRev</p><input type="number" /><input type="number" /></div>\
        <div class="rate-block"><p>&nbsp;&nbsp;bonus / partner</p><input type="number" /><input type="number" /></div>\
    </div>\
</div>\
<div class="input-block"><p>calculation</p><input type="number" /><input type="number" /></div>\
<div class="result-block"><p>result</p></div>', {
    '.fee-block'    : 'fee',
    '.rate_block'   : 'rate,rateRev',
    '.result-block' : 'result',
    '.input-block'  : 'marker',
    input           : 'r1,r2,rR2,rR1,bonus,partner,input,output'
});









new eView('exchange-calc', {
    create: function() { return HTML['exchange-calc'](cr('div','exchange-calc')); },
    init: function(self, obj) {
        var resultfields = calcObj.resultfields;
        var resultMap = calcObj.resultMap;
        data = mergeObjects(calcObj.defObj, obj);
        
        self.V.in_fee      = VIEW['exchange-calc-fee'](data.in_fee);     self.V.in_fee.V.title.val     = 'in_fee';
        self.V.in_out_fee  = VIEW['exchange-calc-fee'](data.in_out_fee); self.V.in_out_fee.V.title.val = 'in_out_fee';
        self.V.out_fee     = VIEW['exchange-calc-fee'](data.out_fee);    self.V.out_fee.V.title.val    = 'out_fee';
        self.V.out_in_fee  = VIEW['exchange-calc-fee'](data.out_fee);    self.V.out_in_fee.V.title.val = 'out_in_fee';
        
        self.V.fee.attachFirst(self.V.in_out_fee);
        self.V.fee.attachFirst(self.V.in_fee);
        self.V.fee.attach(self.V.out_in_fee);
        self.V.fee.attach(self.V.out_fee);
        
        var rateRepr = optDelim(data.rate);
        var rateRevRepr = optDelim(data.rateRev);
        
        self.V.r1.val = rateRepr[0];
        self.V.r2.val = rateRepr[1];
        
        self.V.rR1.val = rateRevRepr[0];
        self.V.rR2.val = rateRevRepr[1];
        
        self.V.bonus.val = data.bonus || 0;
        self.V.partner.val = data.partner || 0;
        
        
        self.C.byRules = {};
        map(resultMap, function(rules) {
            var newBlock = cr('div', 'input-block');
            newBlock.cr('p').VAL(rules[0]);
            self.C.byRules[rules[0]] = [newBlock.cr('input').attr('disabled','disabled'),newBlock.cr('input').attr('disabled','disabled')];
            self.V.marker.insAfter(newBlock);
        });
        
        
        self.F.calc = function() {
            var newData        = {};
            newData.in_fee     = self.V.in_fee.val;
            newData.in_out_fee = self.V.in_out_fee.val;
            newData.out_fee    = self.V.out_fee.val;
            newData.out_in_fee = self.V.out_in_fee.val;
            newData.rate       = ((self.V.r1.val / self.V.r2.val).fromDec());
            newData.rateRev    = ((self.V.rR1.val / self.V.rR2.val).fromDec());
            newData.bonus      = (self.V.bonus.val.fromDec());
            newData.partner    = (self.V.partner.val.fromDec());
            
            //-var gcd = GCD(newData.rate[0], newData.rate[1]);
            //-if ( gcd % 1 == 0 ) {
            //-    newData.rate[0] /= gcd;
            //-    newData.rate[1] /= gcd;
            //-}
            //-gcd = GCD(newData.rateRev[0], newData.rateRev[1]);
            //-if ( gcd % 1 == 0 ) {
            //-    newData.rateRev[0] /= gcd;
            //-    newData.rateRev[1] /= gcd;
            //-}
            
            return newData;
        }
        
        self.F.display = function(res) {
            map(resultfields, function(field) {
                self.V.res[field].val = res[field];
                self.V.res[field].className = (res[field] >= 0) && 'positive' || 'negative';
            });
            mapO(resultMap, function(rules) {
                var nodes = self.C.byRules[rules[0]];
                nodes[0].val = (res[rules[1]].toDec());
                nodes[0].className = (res[rules[1]] >= 0) && 'positive' || 'negative';
                nodes[1].val = (res[rules[2]].toDec());
                nodes[1].className = (res[rules[2]] >= 0) && 'positive' || 'negative';
            });
        }
        
        self.F.calcIn = function() {
            var newData = self.F.calc();
            newData.in_sum = self.V.input.val.fromDec();
            calcObj.calc(newData);
            self.V.output.val = (newData.out_sum.toDec());
            self.F.display(newData);
        }
        
        self.F.calcOut = function() {
            var newData = self.F.calc();
            newData.out_sum = self.V.output.val.fromDec();
            calcObj.calc(newData);
            self.V.input.val = (newData.in_sum.toDec());
            self.F.display(newData);
        }
        
        self.V.input.onkeyup = self.F.calcIn;
        self.V.output.onkeyup = self.F.calcOut;
        self.V.r1.onkeyup = self.F.calcIn;
        self.V.r2.onkeyup = self.F.calcIn;
        self.V.rR1.onkeyup = self.F.calcIn;
        self.V.rR2.onkeyup = self.F.calcIn;
        self.V.bonus.onkeyup = self.F.calcIn;
        self.V.partner.onkeyup = self.F.calcIn;
        self.V.in_fee.F.update = self.F.calcIn;
        self.V.in_out_fee.F.update = self.F.calcIn;
        self.V.out_fee.F.update = self.F.calcIn;
        self.V.out_in_fee.F.update = self.F.calcIn;
        
        self.V.res = {};
        map(resultfields, function(field) {
            var newNode = self.V.result.cr('div');
            newNode.cr('p').VAL(field);
            self.V.res[field] = newNode.cr('div');
        });
        
        
        self.show = function() {
            POP.window.show(self, true);
        }
    }
});






































