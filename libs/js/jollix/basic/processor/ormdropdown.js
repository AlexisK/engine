
new eProcessor('ormdropdown', {
    process: function(self, db) {
        dispatchOnUpdate(self);
        var dd = cr.ormdropdown(RNG(ORM.model[self.D.model]));
        
        tm(f(){
            dd.val = self.val;
            dd.onupdate(f(val) {
                self.val = val;
                self.C._emitUpdated();
            });
        });
        
        insBefore(dd, self);
        self.addCls('hidden');
    }
});

