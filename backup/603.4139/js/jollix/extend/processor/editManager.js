{
    var rules = lsMapToDict( mergeObjects(CONF.extend.editManagerRules, CONF.project.editManagerRules) );
    
    new eProcessor('editManager', {
        process: function(self, db) {
            _jO(self);
            var lvl = self.D.l || %levelManager;
            
            if ( PAGE.level >= lvl ) {
                if ( def(rules[self.D.emr]) ) {
                    tm(f(){ rules[self.D.emr](self); });
                } else {
                    tm(f(){ rules.def(self); });
                }
            } else {
                self.addCls('hidden');
            }
            
        }
    });
}























