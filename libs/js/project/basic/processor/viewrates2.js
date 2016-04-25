new eProcessor('viewrates2', {
    process: function(self, db) {
        _jO(self);
        
        //-tm(db._process(self,db));
        db._process(self,db);
    },
    _process: function(self, db) {

        self.C.exchanges = [];
        self.C.rowDataDict = {};
        //-self.C.rowDataList = [];
        self.C.maxLevel = 20;
        self.C.inPS;
        self.C.outPS;
        self.C.inCur;
        self.C.outCur;
        self.C.activeExchange;
        self.C.acCurList = []

        mapO(ORM.model['accurrency'], f(acCurObj) {
            self.C.acCurList.push(acCurObj);
        });
        self.C.acCurList.sort(f(a,b) {
            return a.order - b.order;
        });


        self.V = selectorMapping(self, {
            '.mk_submit':'submit',
            '.mk_availability_small':'str_availability_small',
            '.mk_top_paysystem':'top_in_ps,top_out_ps',
            '.mk_list_paysystem':'list_in_ps,list_out_ps',
            '.available-exchanges':'table_cont',
            '.sys-current-logo':'in_ps_title,out_ps_title'
        });
        self.V.fetchNodes = S('.mk_fetchstrings');

        self.F._fetchUrlData = CEF(function(url) {
            if ( self.V.fetchNodes.length ) {
                getRawData(url, f(html) {
                    var cont = cr('div');
                    cont.innerHTML = html;
                    var nodes = S('.mk_fetchstrings', cont);
                    map(self.V.fetchNodes, f(node, index) {
                        var fetchedNode = nodes[index];
                        if ( fetchedNode ) {
                            node.innerHTML = fetchedNode.innerHTML;
                        }
                    })
                });
            }
        }, 200);

        self.F._setUrl = function() {
            var url = PAGE.url + self.C.inPS.name + '/' + self.C.outPS.name + '/';
            history.replaceState({
                selfUrl: url
            }, document.title, url);
            self.F._fetchUrlData(url);
        }

        self.F._setExchangeLink = function(inCurName, outCurName) {
            var url = ENGINE.path.page + '/' + PAGE.lang + '/exchange/';
            var str = PAGE.ld('calcExchangeNow');
            self.V.submit.remCls('exchange-blocked');

            //- if currencies are specified in arguments, form the url using their names
            if ( def(inCurName) && def(outCurName) ) {
                url = url.concat(inCurName, '/', outCurName,  '/');
                return url;
            //- form the url for the first exchange
            } else if ( Object.keys(self.C.rowDataDict).length ) {
                var sortFunc = f(a,b) { return a._rel.accurrency.order - b._rel.accurrency.order; };
                var defaultInCur = self.C.inPS._rel.currency.sort(sortFunc)[0];
                var defaultOutCur = self.C.outPS._rel.currency.sort(sortFunc)[0];
                url = url.concat(defaultInCur.name, '/', defaultOutCur.name, '/');
            //- default exchange url
            } else {
                self.V.submit.addCls('exchange-blocked');
                str = PAGE.ld('calcExchangeBlocked');
            }

            self.V.str_availability_small.VAL(str);
            clearEvents(self.V.submit).addEventListener('click', function() {
                LM.go(url);
            });
        }

        self.F.setPS = function(ps, prefix) {
            self.C.rowDataDict = {};
            //-self.C.rowDataList = [];

            self.C[prefix+'PS'] = ps;
            self.F._setUrl();
            //- insert selected paysystem's logo
            var key = prefix + '_ps';
            self.V['top_'+key].src = [ENGINE.path.static, 'image/ps/', ps.viewparams.imgHover].join('');
            //- insert selected paysystem's name 
            self.V['top_title_'+key].VAL(ORM.getVisName(ps));
            //- get exchanges, filter them and store in self.C.exchanges
            var exchanges = CASH.calc.exchanges.filter(f(obj) { 
                if ( obj.lvl <= self.C.maxLevel && obj.blockers == 0 ) { 
                    return true;
                }
                return false;
            });
            self.F._prepExchanges(exchanges);
            self.F._prepRowData();

            self.F._setExchangeLink();

            VIEW['ratesTable'](self);
        }
        self.F.drawInPs = function() {
            self.F._drawPs(CASH.calc.in_ps, self.V.list_in_ps, function(ps) {
                self.F.setPS(ps, 'in');
            });
        }
        self.F.drawOutPs = function() {
            self.F._drawPs(CASH.calc.out_ps, self.V.list_out_ps, function(ps) {
                self.F.setPS(ps, 'out');
            });
        }
        self.F._drawPs = function(list, parent, func) {
            parent.innerHTML = '';
            var mult = 3;
            
            list.sort(f(a,b) {
                var v1 = (a.params && a.params.order) || 1000;
                var v2 = (b.params && b.params.order) || 1000;
                return v1 - v2;
            });
            
            var lenProp = list.length / mult;
            var len = parseInt(lenProp);
            if ( len < lenProp ) { len += 1; }
            
            var index = 0;
            for ( var i = 0; i < len; i++) {
                var row = parent.cr('tr');
                
                for ( var j = 0; j < mult && index < list.length; j++, index++ ) {
                    self.F._drawPsWorker(list[index], func, row);
                }
            }
        }
        self.F._drawPsWorker = function(ps, func, row) {
            var node = VIEW['ps-table-item'](ps);
            node.clickOn = function() { func(ps); };
            node.onclick = node.clickOn;
            
            row.attach(node);
        }
        
        self.F._prepRowData = function() {
            //- delete existing data
            self.C.rowDataDict = {};
            //- fill self.C.rowDataDict
            map(self.C.exchanges, f(exchange) {
                var rowData,
                    inC = ORM.O('currency_'+exchange.in_currency_id),
                    outC = ORM.O('currency_'+exchange.out_currency_id);

                if ( !def(self.C.rowDataDict[inC.accurrency_id]) ) {
                    rowData = {};
                    rowData['tableRowOrder'] = self.C.acCurList.indexOf(inC._rel.accurrency);
                    rowData['exchanges'] = {};
                    rowData.exchanges[outC.accurrency_id] = exchange;
                    rowData['in_currency'] = inC;
                    rowData['out_currencies'] = {};              
                    rowData.out_currencies[outC.accurrency_id] = outC;
                    self.C.rowDataDict[inC.accurrency_id] = rowData;
                } else {
                    rowData = self.C.rowDataDict[inC.accurrency_id];
                    rowData.out_currencies[outC.accurrency_id] = outC;
                    rowData.exchanges[outC.accurrency_id] = exchange;
                }
            });
        }

        self.F._prepExchanges = function(exchanges) {
            //- delete stored exchanges
            self.C.exchanges = [];
            //- filter and store exchanges in self.C.exchanges
            map(exchanges, f(exch) {
                map(self.C.inPS._rel.currency, f(inCur) {
                    if ( exch.in_currency_id ==  inCur.id ) {
                        map(self.C.outPS._rel.currency, f(outCur) {
                            if ( exch.out_currency_id == outCur.id ) {
                                self.C.exchanges.push(exch);
                            }
                        })
                    }
                })
            });
        }
        self.F.init = function() {
            self.F.drawInPs()
            self.F.drawOutPs();
            //- collect exchanges from DOM
            map(S('.mk_exchange', self), f(node) {
                var exch = ORM.O('exchange_'+node.attr('data-exchangeid'));
                if ( exch ) {
                    self.C.exchanges.push(exch);
                }
                node.detach();
            });
            if ( self.C.exchanges.length === 0 ) { //- no exchanges for chosen paysystems/chosen paysystems are unavailable
                var exchanges = CASH.calc.exchanges.filter(f(obj) { 
                    if ( obj.lvl <= self.C.maxLevel && obj.blockers == 0 ) { 
                        return true;
                    }
                    return false;
                });
                //- choose the first available exchange
                var defaultInCur = ORM.O('currency_'+exchanges[0].in_currency_id),
                    defaultOutCur = ORM.O('currency_'+exchanges[0].out_currency_id);
                //- set paysystems, change the URL, get available exchanges
                self.C.inPS = ORM.O('paysystem_'+defaultInCur.paysystem_id);
                self.C.outPS = ORM.O('paysystem_'+defaultOutCur.paysystem_id);
                self.F._setUrl();
                self.F._prepExchanges(exchanges);
                
            } else { //- the exchanges have been collected from DOM
                //- set paysystems
                self.C.inPS = ORM.O('paysystem_'+self.D.inpsid);
                self.C.outPS = ORM.O('paysystem_'+self.D.outpsid);
            }
            //- set icons for default paysystems
            self.V.top_in_ps.src = [ENGINE.path.static, 'image/ps/', self.C.inPS.viewparams.imgHover].join('');
            self.V.top_out_ps.src = [ENGINE.path.static, 'image/ps/', self.C.outPS.viewparams.imgHover].join('');
            //- set titles for default paysystems
            self.V.top_title_in_ps = self.V.in_ps_title.cr('span', 'title');
            self.V.top_title_in_ps.VAL(ORM.getVisName(self.C.inPS));
            self.V.top_title_out_ps = self.V.out_ps_title.cr('span', 'title');
            self.V.top_title_out_ps.VAL(ORM.getVisName(self.C.outPS));

            self.F._prepRowData();
            VIEW['ratesTable'](self);
            self.F._setExchangeLink();
        }

        

        self.F.init();
    }
});

