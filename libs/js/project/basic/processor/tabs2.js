new eProcessor('tabs2', {
    process: function(self, db) {
        _jO(self).V.tabs = S('.mk_tab', self);

        self.C.curTab = self.D.tab || 0;
        
        db.createButtons(self, db);
        db.switchTo(self, db, self.C.curTab);
        
        self.switchTo = function(key) {
            db.switchTo(self, db, key);
        }
        
    },
    switchTo: function(self, db, index) {
        self.C.curTab = index;
        map(self.V.tabs, function(node, i) {
            node.addCls('hidden');
            self.V.tabBtns[i].remCls('active');
        });
        self.V.tabs[index].remCls('hidden');
        self.V.tabBtns[index].addCls('active');

        
        if ( EVENT.data.windowSize.x <= %wrapperRatesMobile ) {
        	self.V.tabBtns[index].detach();
    		self.V.tabsBlock.attach(self.V.tabBtns[index]);
        }
		
        var ifms = S('iframe', self.V.tabs[index]);
        
        map(ifms, function(node) {
            var nSrc = node.attr('data-srcontab');
            if ( nSrc && nSrc.length > 0 ) {
                node.attr({
                    src: nSrc,
                });
                node.remattr('data-srcontab');
            }
        });
        
        if ( self.D.seturl ) {
            var url = SYS.globalUrlModification(ENGINE.getUrlData(self.D.seturl+self.C.curTab+'/').url);
            
            history.replaceState({
                selfUrl: url
            }, document.title, url);
        }
    },
    createButtons: function(self, db) {
        map(self.V.tabBtns||[], detach);
        self.V.tabBtns = [];
        self.V.tabsBlock = self.V.tabsBlock || cr('div','tabs heading');
        self.attachFirst(self.V.tabsBlock);
        
        map(self.V.tabs, function(tab) {
            _jO(tab);
            db.createButton(self, db, tab);
        })
    },
    createButton: function(self, db, tab) {
        var newBtnWrap = self.V.tabsBlock.cr('div','asBtn');
        var newBtn;
        if (self.D.wrapin) {
            newBtn = newBtnWrap.cr(self.D.wrapin, self.D.wrapincls);
        } else {
            newBtn = newBtnWrap;
        }
        if ( tab.D.svg ) { SVG[tab.D.svg](newBtn.cr('div', 'ico')); }
        if ( tab.D.title ) { newBtn.cr('div', 'str').VAL(tab.D.title); }
        
        newBtnWrap.cr('div', 'tab_shadow_mob');

        newBtnWrap._index = self.V.tabBtns.push(newBtnWrap)-1;
        clearEvents(newBtnWrap).onclick = function() {
            db.switchTo(self, db, this._index);
            return 0;
        }
    }
})












