

new eProcessor('reservenotify', {
    process: function(self, db) {
        db.createDom(self, db);
        
        EVENT.on('calc.currency.out', CEF(f(cur) {
            db.fetchView(self, db, cur);
        }));
    },
    createDom: function(self, db) {
        self.innerHTML = '';
        self.V.ico     = self.cr('img');
        self.V.str_ps  = self.cr('strong');
        self.V.str_txt = self.cr('div').VAL(PAGE.ld('available for exchange'));
        self.V.str_cur = self.cr('nobr');
        
        
        self.cr('hr', 'wClear');
    },
    fetchView: f(self, db, cur) {
        var ps = cur._rel.paysystem;
        var imgPath = [ENGINE.path.static,'image/ps/',ps.viewparams.imgHover].join('');
        
        self.V.ico.src     = imgPath;
        self.V.str_ps.val  = ORM.getVisName(ps);
        
        if ( ps.id == PAGE.userData.acPaysystem.id ) {
            self.V.str_cur.val = "\u221E "+ORM.getVisName(cur);
        } else {
            self.V.str_cur.val = PARSE.money(cur.display_total.toDec()) + ' ' + ORM.getVisName(cur);
        }
        
        
    }
});















