
new eProcessor('depositCalc', {
    process: function(self, db) {
        _jO(self);
        
        db.calc = S('.deposit-table', self)[0];
        
        db.sumContainer = _jO(S('.sum-container', db.calc)[0]);
        db.currencyContainer = _jO(S('.currency-container', db.calc)[0]);
        db.durationContainer = _jO(S('.duration-container', db.calc)[0]);
        db.percentageContainer = S('.percentage-container', db.calc)[0];
        db.btnContainer = S('.btn-container', db.calc)[0];
        db.resultContainer = S('.result-container', self)[0];
        db.diagramDataList = [];
        db.active = {};
        
        if ( !db.currencyContainer || !db.durationContainer || !db.resultContainer ) {
        	return 0;
        }
        
        self.F._prepAccurrency = function() {
            function prepSum(cont) {
                var key = cont.D['modelname'],
                    defaultSum = CONF.project.depositDefaultSum.fromDec().toDec(2).replace('.', ',');
                db.active[key] = CONF.project.depositDefaultSum;
                cont.V.inputElem = S('.mk_sum_input', cont)[0];
                cont.V.inputElem.attr('placeholder', defaultSum);
                evt(cont.V.inputElem, 'change', f() { 
                    EVENT.emit('deposit_update', { 'value': cont.V.inputElem.val, 'name': key });
                });
            }

            function prepCur(cont) {
                var modelName = cont.D['modelname'],
                    ddCont = S('.mk_accur_dd', cont)[0],
                    nodeList = [],
                    dataList, i, row;
                if ( !ORM.model[modelName] ) { return 0; }
                dataList = parseLS(ORM.model[modelName]);
                dataList.sort(f(a, b) {
                    return a.order - b.order;
                });
                map(dataList, f(obj) {
                    var node = cr('div');
                    node.VAL(obj.name);
                    nodeList.push(node);
                });
                cont.V.dropDown = cr.dropdown(nodeList, modelName.concat('-dropdown'), ddCont, { 
                    noUpdateOnVal: true
                });
                db.active[modelName] = dataList[0];
                cont.V.dropDown.onupdate(f(i) {
                    var value = dataList[i];
                    var node = S('.mk_deposit_percent', db.percentageContainer)[0]
                    node.val = Math.round((CONF.project.payoutPerYear * value.deposit).toDec()) + '%';
                    EVENT.emit('deposit_update', {'value': value, 'name': modelName});
                });
                cont.V.dropDown._ddnodeList[0].clickOn();
            }
            
            prepSum(db.sumContainer);
            prepCur(db.currencyContainer);
        }
        
        self.F._prepDuration = function() {
            var modelName = db.durationContainer.D['modelname'],
                dropdownDefault;
            
            db.active[modelName] = {};
            db.durationContainer.V.slider = S('.duration-slider', db.durationContainer)[0];
            db.durationContainer.V.numInput = S('.duration-number', db.durationContainer)[0];

            db.active[modelName] = db.durationContainer.V.slider.val;

            db.durationContainer.V.numInput.val = db.durationContainer.V.slider.val;

            evt(db.durationContainer.V.slider, 'change', f() {
                var sliderValue = db.durationContainer.V.slider.val
                db.durationContainer.V.numInput.val = sliderValue;
                EVENT.emit('deposit_update', {
                    'name': modelName,
                    'value': sliderValue,
                });
            });
            evt(db.durationContainer.V.numInput, 'change', f() {
                var numValue;
                if ( db.durationContainer.V.numInput.val < 0 ) {
                    db.durationContainer.V.numInput.val = db.durationContainer.V.numInput.val * -1;
                }
                numValue = PARSE.number(db.durationContainer.V.numInput.val);
                if ( numValue > 365 ) {
                    numValue = 365;
                    db.durationContainer.V.numInput.val = numValue;
                } else if ( numValue < 1 ) {
                    numValue = 1;
                    db.durationContainer.V.numInput.val = numValue;
                }
                db.durationContainer.V.slider.val = numValue;
                EVENT.emit('deposit_update', {
                    'name': modelName,
                    'value': numValue,
                });
            });
        }
        
        self.F._formatResult = function(depositSum, resultObj) {
            var formatDict = {};
            formatDict.periodicValues = {};
            formatDict.totalSum = resultObj.result.toDec(2).replace('.', ',') + ' ' + db.active.accurrency.name;
            return formatDict
        }
        
        self.F._calculate = function(depositSum, duration) {
            var resDict = {};
            var sum = depositSum;

            for ( var i = 0; i < duration; i += 1 ) {
                var dailyBonus = sum * (db.active.accurrency.deposit / 100).toDec();
                sum += dailyBonus;
            }
            resDict.result = sum;
            resDict.bonus = sum - depositSum;
            return self.F._formatResult(depositSum, resDict);
        }
        
        self.F.calculate = function() {
            if ( !def(db.active.duration) || !def(db.active.depositSum) || !def(db.active.accurrency) ) {
                return 0;
            }
        	var depositSum = parseNum(db.active.depositSum);
                duration = db.active.duration;
            db.sumContainer.V.inputElem.val = depositSum.fromDec().toDec(2).replace('.', ',');
        	if ( !isNaN(depositSum) ) {
                depositSum = depositSum.fromDec();
                var result = self.F._calculate(depositSum, duration); 
                db.resultContainer.V.resultCont.val = result.totalSum;
                db.diagramDataList = [];
                mapO(CONF.project.durationDiagram, f(duration, key) {
                    var res = self.F._calculate(depositSum, duration);
                    db.diagramDataList.push(res);
                });
                db.fetchSvg(self, db);
        	}
        }
        
        self.F.prepCalc = function() {
            db.resultContainer.V = selectorMapping(db.resultContainer, {
                '.deposit-result': 'resultCont'
            });
            self.F._prepAccurrency();
            self.F._prepDuration();
        }
        
        self.F.setEvents = function() {
            var btn = S('.asBtn', db.btnContainer)[0];
            evt(btn, 'click', self.F.calculate);
            EVENT.on('deposit_update', f(data) {
                db.active[data.name] = data.value;
            }, true);
        }
        
        self.F.setEvents();
        self.F.prepCalc();
        self.F.calculate();
        db.fetchSvg(self, db);
    },
    fetchSvg: function(self, db) {}
});




