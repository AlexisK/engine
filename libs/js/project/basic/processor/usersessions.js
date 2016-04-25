

new eProcessor('usersessions', {
    process: function(self, db) {
        self.target = S('.mk_sessions', self)[0];
        if ( PAGE.level && self.target ) {
            db._process(self, db);
        }
    },
    _process: function(self, db) {
        ORM.req('session:select',f(list) {
            self.target.val = '';
            var count = 1;
            map(list, f(obj) {
                obj.displayNumber = count;
                db.objProcess(self, db, obj);
                count += 1;
            })
        }, {
            selector: {
                owner_id:['=',PAGE.user.id]
            }
        });
    },
    objProcess: f(self, db, obj) {
        var view = VIEW.usersession(obj);
        view.delBtn.onclick = f() {
            ORM.req(obj._oid+':delete',f() {
                db._process(self, db);
            });
        };
        view.mobDelBtn.onclick = f() {
            ORM.req(obj._oid+':delete',f() {
                db._process(self, db);
            });
        };
        self.target.attach(view);
    }
});















