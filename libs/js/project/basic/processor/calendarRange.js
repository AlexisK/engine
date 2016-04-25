new eProcessor('calendarRange', {
	defaultRangeDays: 7,
	_process: function(self, db) {
		_jO(self);

		self.V = selectorMapping(self, {
			'.inp': 'wrapTo,wrapFrom',
			'.calendar-inp-cont': 'contTo,contFrom',
			'.calendar-represent': 'reprTo,reprFrom',
			'.calendar-dropdown': 'ddTo,ddFrom'
		});
		self.C.suffixes = ['From', 'To'];

		self.F.getSuffix = function(bool) {
			if ( bool ) {
				return self.C.suffixes[0];
			}
			return self.C.suffixes[1];
		}
    	self.F._checkVal = function() {
    		if ( self.V.calendarFrom.val > self.V.calendarTo.val ) {
    			//- switch vals
    			var fromVal = self.V.calendarFrom.val;
    			self.V.calendarFrom.val = self.V.calendarTo.val;
    			self.V.calendarTo.val = fromVal;
    			self.F._setReprVal(true);
    			self.F._setReprVal(false);
    		}
    	}
		self.F._setReprVal = function(bool) {
			var suff = self.F.getSuffix(bool),
				prefix = '',
				formatStr = formatDate(self.V['calendar'+suff].val, false, true, false);
			if ( !bool ) { prefix = '- '; }
        	self.V['repr'+suff].val = prefix + formatStr;
    	}
		self.F.initCalendar = function(bool) {
			var suff = self.F.getSuffix(bool),
				wrapNode = self.V['wrap'+suff],
				ddNode = self.V['dd'+suff],
				reprNode = self.V['repr'+suff],
				calendarNode = cr.calendar(suff, ddNode);
			self.V['calendar'+suff] = calendarNode;
			
			function markRange(bool, calendarNode) {
				var otherSuffix = self.F.getSuffix(!bool),
					otherCalendarNode = self.V['calendar'+otherSuffix],
					otherCells = S('td', otherCalendarNode),
					thisCells = S('td', calendarNode),
					thisActiveCell = S('.curDate', calendarNode)[0],
					otherActiveCell = S('.curDate', otherCalendarNode)[0],
					thisStartIndex = thisCells.indexOf(thisActiveCell) + 1,
					thisEndIndex = thisCells.length,
					otherStartIndex = 0,
					otherEndIndex = otherCells.indexOf(otherActiveCell);

				if ( bool ) {
					thisStartIndex = thisCells.indexOf(thisActiveCell) + 1;
					thisEndIndex = thisCells.length;
					otherStartIndex = 0;
					otherEndIndex = otherCells.indexOf(otherActiveCell);
				} else {
					otherStartIndex = otherCells.indexOf(otherActiveCell) + 1;
					otherEndIndex = otherCells.length;
					thisStartIndex = 0;
					thisEndIndex = thisCells.indexOf(thisActiveCell);
				}

				map(thisCells, f(node) {
					node.remCls('curRange');
				});
				for ( var i = thisStartIndex; i < thisEndIndex; i += 1 ) {
					thisCells[i].addCls('curRange');
				}
				map(otherCells, f(node) {
					node.remCls('curRange');
				});
				for ( var i = otherStartIndex; i < otherEndIndex; i += 1 ) {
					otherCells[i].addCls('curRange');
				}
			}

			calendarNode.onupdate(function() {
				self.F._checkVal();
	        	self.F._setReprVal(bool);
	        	markRange(bool, calendarNode);
	        	self.emitUpdated();
			});


	    	evt(reprNode, 'click', f() {
	    		markRange(bool, calendarNode);
				self.F._setReprVal(bool);
				wrapNode.swCls('active');
				closeOnClick(ddNode, [wrapNode], function() {
					wrapNode.remCls('active');
					self.F._checkVal();
					self.F._setReprVal(bool);
				});
			});
		}
		self.F.setDefaultRange = function() {
    		var dateFrom = new Date(),
    			dateTo = new Date();
    		dateFrom = dateFrom.setDate(dateFrom.getDate() - db.defaultRangeDays);
    		self.V.calendarFrom.val = dateFrom;
    		self.V.calendarTo.val = dateTo;
    		self.F._setReprVal(true);
    		self.F._setReprVal(false);
    	}
		

		self.F.initCalendar(true);
		self.F.initCalendar(false);
		self.F.setDefaultRange();

		$P(self, 'val', function() {
			var fromTime = clearTime(new Date(self.V.calendarFrom.val)).getTime(),
				toTime,
				tillTime = clearTime(new Date(self.V.calendarTo.val));
			tillTime.setDate(tillTime.getDate()+1);
			toTime = new Date(tillTime.getTime() - 1);
			toTime = toTime.getTime();
			
			return { from: fromTime, to: toTime }
		}, function(obj) {
			if ( def(obj.from) ) { self.V.calendarFrom.val = obj.from; }
			if ( def(obj.to) ) { self.V.calendarTo.val = obj.to; }
			self.F._checkVal();
			self.F._setReprVal('From');
			self.F._setReprVal('To');
			return { from: self.V.calendarFrom.val, to: self.V.calendarTo.val };
		});

		dispatchOnUpdate(self);
		self.emitUpdated = CEF(function() {
    		self.C._emitUpdated(self.val);
		});
	},
	process: function(self, db) {
		tm(db._process(self,db));
	}
});
