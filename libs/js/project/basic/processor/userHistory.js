




new eProcessor('userHistory', {
	process: f(self, db) {
		tm(f(){
		    //-log('u_h');
		    db.linkContents(self, db);
		    db.catchSelector(self, db);
		}, 2);
	},
	linkContents: f(self, db) {
	    self.V = selectorMapping(self, {
		    '.table-switcher'       : 'tabs',
		    '.mk_datepicker_from'   : 'date_from',
		    '.mk_datepicker_to'     : 'date_to',
		    '.mk_type'              : 'type',
		    '.mk_status'            : 'status',
		    '.mk_history_items'     : 'tbody',
		    '.mk_history_more'      : 'btn_more',
		    '.field_str'            : 'str1,str2,str3',
		    '.mk-calendar-submit'   : 'calendar_submit'
		});
		
		self.onupdatekeys = ['tabs','type','status'];
		
		self.V.tableTabs = S('.line', self.V.tabs);
		self.C.tableTabs = {};
		self.C.currentTab = null;
		map(self.V.tableTabs, function(button) {
		    var key = button.attr('data-type');
		    if ( key ) {
		        self.C.tableTabs[key] = button;
		        button.doClick = f() {
		            db.setTable(self, db, key);
		        }
		        button.onclick = button.doClick;
		    }
		});
		
		
		self.processed = [];
		
		map(self.onupdatekeys, f(key) {
		    var node = self.V[key];
		    
		    if ( node && node.onupdate && !self.processed.contains(node) ) {
		        node.onupdate(f() { db.redrawTable(self, db); });
		        self.processed.push(node);
		    }
		});
		
		self.V.calendar_submit.onclick = f() {
		    db.redrawTable(self, db);
		}
		
		//-log(self.V);
		
		var t = okeys(self.C.tableTabs);
		if ( t.length ) { tm(self.C.tableTabs[t[0]].doClick); }
		
	},
	weekDiff: 604819346,
	fetchMoreBtn: f(self, db) {
		if ( self.V.btn_more ) {
		    var showDates = self.V.date_from.val,
		    	fromDate;

		    fromDate = new Date(showDates.from - db.weekDiff);
		    showDates.to = fromDate.getTime() + db.weekDiff - 1;
		    showDates.from = clearTime(fromDate).getTime();
		    
		    self.V.btn_more.val = [PAGE.ld('Show period'), formatDate(showDates.from, false, true)].join(' ');
		    
		    self.V.btn_more.onclick = f() {
		        self.V.date_from.val = { from: showDates.from };
		        db.redrawTable(self, db);
		    }
		}
	},
	setTable: f(self, db, tkey) {
	    if ( self.C.currentTab ) {
	        self.C.tableTabs[self.C.currentTab].remCls('active');
	        self.C.currentTab = null;
	    }
	    self.C.currentTab = tkey;
	    self.C.tableTabs[self.C.currentTab].addCls('active');
	    
	    if ( db.table_rules[tkey] ) {
	        var conf = db.table_rules[tkey];
	        conf.prepare(self, db, conf);
	    } else {
	        SYS.notify(PAGE.ld('Could not find table rule')+' '+tkey, 'center red');
	    }
	    
	},
	catchSelector: f(self, db) {
	    var req = [glob('token')];
	    req.push(self.V.date_from.val.from);
	    req.push(self.V.date_to.val.to);
	    req.push(self.V.type.val || 'any');
	    req.push(self.V.status.val || 'any');
	    
	    var result = req.join('/');
	    self.selector = result;
	    
	    db.fetchMoreBtn(self, db);
	},
	redrawTable: f(self, db) {
	    if ( self.C.currentTab && db.table_rules[self.C.currentTab] ) {
	        var conf = db.table_rules[self.C.currentTab];
	        db.catchSelector(self, db);
	    
	        getRawData(['/_dynaview',PAGE.lang,conf.urlpart,self.selector].join('/'), f(html, respObj) {
	            PROTOCOL.api.read(html, respObj, f(resp) {
	                
	                self.V.tbody.val = '';
                    self.C.viewByDate = {};
	                
	                if ( resp[conf.model] ) {
	                    
	                    map(resp[conf.model], f(obj) {
	                        var ftime = clearTime(new Date(obj.ctime||obj.mtime))*1;
	                        ORM.model[conf.model] = ORM.model[conf.model] || [];
	                        ORM.storePriv(conf.model, obj.id, obj);
    	                    var view = conf.view(obj);
    	                    self.C.viewByDate[ftime] = self.C.viewByDate[ftime] || [];
    	                    self.C.viewByDate[ftime].push(view);
    	                });
    	                
    	                db.resortTable(self, db);
	                }
	            });
	        });
	    } else {
	        
	    }
	    
	    
	},
	resortTable: f(self, db) {
	    mapO(self.C.viewByDate, f(list, date) {
	        var parent = self.V.tbody.cr('div','history-group');
	        var dom = parent.cr('div', 'row row-date').VAL(formatDate(date, false, true));
	        dom.onclick = f() {
	            parent.swCls('active');
	        }
	        
	        map(list, f(view) {
	            parent.attach(view);
	        })
	    }, { sort: f(a,b) { return b-a; } });
	},
	table_rules: {
	    transaction: {
	        model : 'transaction',
	        urlpart: 'user_transactions',
	        view: VIEW.history_transaction,
	        prepare: f(self, db, conf) {
	            self.V.type.V.viewNode._data = {
	                exchange : PAGE.ld('Exchange'),
	                payment  : PAGE.ld('Payment')
	            }
	            self.V.type.V.viewNode.F.ddBuild();
	            if ( self.V.type.V.viewNode._ddnodeList[0] ) { self.V.type.V.viewNode._ddnodeList[0].clickOn(); }
                
                self.V.status.V.viewNode._data = {
                    'any' : PAGE.ld('Status'),
                    'ok'  : PAGE.ld('Ok'),
                    'wait': PAGE.ld('Progress'),
                    'fail': PAGE.ld('Fail')
                }
	            self.V.status.V.viewNode.F.ddBuild();
	            if ( self.V.status.V.viewNode._ddnodeList[0] ) { self.V.status.V.viewNode._ddnodeList[0].clickOn(); }
                
                self.V.str1.val = PAGE.ld('Debited');
                self.V.str2.val = PAGE.ld('Credited');
                self.V.str3.val = PAGE.ld('Bonus');
                
                db.redrawTable(self, db);
	        }
	    },
	    acbill: {
	        model : 'acbill',
	        urlpart: 'user_acbill',
	        view: VIEW.history_acbill,
	        prepare: f(self, db, conf) {
	            getRawData('/_view/'+PAGE.lang+'/select_acbill_type/', f(html) {
	                var list = parseObj(html);
	                if ( list ) {
	                    var dict = {
	                        any: PAGE.ld('Any')
	                    };
	                    map(list, f(val) { dict[val] = PAGE.ld(val); });
	                    self.V.type.V.viewNode._data = dict;
	                    self.V.type.V.viewNode.F.ddBuild();
	                    if ( self.V.type.V.viewNode._ddnodeList[0] ) { self.V.type.V.viewNode._ddnodeList[0].clickOn(); }
	                    
                        self.V.status.V.viewNode._data = {
                            'any' : PAGE.ld('Type'),
                            'pos' : PAGE.ld('Credited'),
                            'neg' : PAGE.ld('Debited')
                        }
        	            self.V.status.V.viewNode.F.ddBuild();
        	            if ( self.V.status.V.viewNode._ddnodeList[0] ) { self.V.status.V.viewNode._ddnodeList[0].clickOn(); }
                        
	                    
	                    db.redrawTable(self, db);
        	            
	                }
	            });
	            
                self.V.str1.val = PAGE.ld('Debited');
                self.V.str2.val = PAGE.ld('Credited');
                self.V.str3.val = PAGE.ld('Balance');
	        }
	    }
	}
});









