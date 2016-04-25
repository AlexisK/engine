

new eProcessor('menu', {
    process: function(self, db) {
        db.btn    = S('.mk_menuBtn', self)[0];
        db.search = S('.mk_search',  self)[0];
        db.goTop  = S('.goTop',      self)[0];
        
        db.int = null;
        db.opened = false;
        db.isAlwaysVisible = false;
        
        
        
        
        
        db.close = function() {
            log('close');
            self.remCls('opened');
            db.opened = false;
            evtDel(document.body, 'click', db.tryClose);
            evtDel(document.body, 'touchstart', db.tryClose);
            db.fetchSvg(self,db);
        }
        
        db.tryClose = function() {
            db.int = tm(db.close, 10);
        }
        
        db.open = function() {
            self.addCls('opened');
            db.opened = true;
            evt(document.body, 'click', db.tryClose);
            evt(document.body, 'touchstart', db.tryClose);
            db.fetchSvg(self,db);
        }
        
        
        
        if ( db.btn ) {
            EVENT.global.resize.add(function() {
                db.fetchState(self,db);
            });
            db.fetchState(self,db);
        }
        
        if ( db.search ) {
            db.searchInt = null;
            
            db.search.onkeyup = function() {
                clearInterval(db.searchInt);
                db.searchInt = tm(function() {
                    PROTOCOL.search.write(db.search.val);
                }, %timeSearch);
            }
        }
        
        if ( db.goTop ) {
            var flag = false;
            var goTopPos = null;
            
            var toShow = function() { return (EVENT.data.windowScroll.y > EVENT.data.windowSize.y / 2); }
            
            var fetchPos = function() {
                if ( toShow() ) {
                    db.goTop.remCls('opaque');
                    if ( flag ) {
                        flag = false;
                        goTopPos = null;
                        SVG.arrTop(db.goTop);
                    }
                } else {
                    if ( !goTopPos ) {
                        db.goTop.addCls('opaque');
                    }
                }
            }
            
            EVENT.global.scroll.add(fetchPos);
            fetchPos();
            
            SVG.arrTop(db.goTop);
            
            
            db.goTop.onclick = function() {
                if ( goTopPos ) {
                    SVG.arrTop(db.goTop);
                    setDocumentScroll(goTopPos);
                    goTopPos = null;
                    flag = false;
                } else if ( toShow() ) {
                    goTopPos = [EVENT.data.windowScroll.x, EVENT.data.windowScroll.y];
                    SVG.arrBottom(db.goTop);
                    setDocumentScroll();
                    tm(function() { flag = true; }, %animationTimeout);
                }
                
            }
        }
        
        EVENT.on('goPage', function() { db.close(); }, true);
        
    },
    fetchSvg: function(self, db) {
        if ( db.isAlwaysVisible ) {
            db.btn.addCls('hidden');
        } else {
            db.btn.remCls('hidden');
        }
        if ( db.opened ) {
            SVG.arrLeft(db.btn);
        } else {
            SVG.menu(db.btn);
        }
    },
    fetchState: function(self, db) {
        
        if ( db.isAlwaysVisible = EVENT.data.windowSize.x > %sizeTablet ) {
            db.close();
        }
        
        self.onclick = self.ontouchstart = function() {
            tm(function() {
                clearInterval(db.int);
            })
        }
        
        clearEvents(db.btn).onclick = function() {
            if ( db.opened ) {
                db.close();
            } else {
                db.open();
            }
            
            return false;
        }
        
        db.fetchSvg(self,db);
    }
});















