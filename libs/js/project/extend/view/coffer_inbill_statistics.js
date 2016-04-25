


new eView('coffer_inbill_statistics',{
    create: f(){
        var self = _jO(cr('div','coffer_inbill_statistics'));
        
        self.V.titleBlock    = self.cr('div','title_block');
        var settingsBlock    = self.cr('div','settings_block');
        self.V.contentBlock  = self.cr('div','content_block');
        self.V.resultBlock   = self.cr('div','result_block').cr('table');
        
        self.V.calendar_from = cr.calendar(null, settingsBlock);
        self.V.calendar_to   = cr.calendar(null, settingsBlock);
        
        self.V.bars = [];
        
        RNG(100).each(f(){
            self.V.bars.push(self.V.contentBlock.cr('div').cr('div'));
        });
        
        return self;
    },
    init:f(self, obj){
        obj = obj || {};
        var data = {
            title: obj.title||''
        }
        data.selector = mergeObjects({
            status: ['>=', 100]
        }, obj.selector);
        
        self.V.titleBlock.val = data.title;
        
        self.F.fetchData = f() {
            if ( self.V.calendar_from.val && self.V.calendar_to.val ) { 
                var sel = mergeObjects(data.selector, {
                    ctime: ['>=', self.V.calendar_from.val, '<=', self.V.calendar_to.val]
                });
                
                self.V.resultBlock.val = '';
                
                ORM.req('inbill:select', f(list) {
                    
                    if ( list.length == 0 ) {
                        
                        RNG(100).each(f(i) {
                            self.V.bars[i].style.height = '0%';
                        });
                        
                        self.V.resultBlock.val = '';
                        
                    } else {
                        
                        var sum = 0;
                        var max = 0;
                        var step = (self.V.calendar_to.val - self.V.calendar_from.val) / 100;
                        var by_coffer = {};
                        
                        map(list, f(ib) {
                            sum += ib.in_cash;
                            by_coffer[ib.coffer_id] = by_coffer[ib.coffer_id] || 0;
                            by_coffer[ib.coffer_id] += ib.in_cash;
                        });
                        
                        var locs = [];
                        
                        RNG(100).each(f(i) {
                            var loc = 0;
                            var from = self.V.calendar_from.val + parseInt(i * step);
                            var to = parseInt(from + step);
                            
                            map(list.filter(f(o){
                                return o.ctime >= from && o.ctime < to;
                            }), f(o) { loc += o.in_cash; });
                            
                            locs.push(loc);
                            
                            max = Math.max(max, loc);
                        });
                        
                        RNG(100).each(f(i) {
                            self.V.bars[i].style.height = parseInt(locs[i] / max * 100) + '%';
                        })
                        
                        var row = self.V.resultBlock.cr('tr');
                        row.cr('td').VAL(PAGE.ld('coffer id'));
                        row.cr('td').VAL(PAGE.ld('$'));
                        
                        mapO(by_coffer, f(val, coff) {
                            var cf = ORM.O('coffer_'+coff);
                            var row = self.V.resultBlock.cr('tr');
                            row.cr('td').VAL(cf.account+' ('+coff+')');
                            row.cr('td').VAL(val.toDec()+' '+ORM.getVisName(cf._rel.currency._rel.paysystem)+' '+cf._rel.currency.displayname);
                        });
                        
                        
                    }
                    
                }, { selector: sel, order: ['ctime']});
            }
        }
        
        self.F.fetchData();
        
        self.V.calendar_from.onupdate(self.F.fetchData);
        self.V.calendar_to.onupdate(self.F.fetchData);
    }
});
