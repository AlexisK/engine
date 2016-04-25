
new eSubprogram('payment', function(onfinish) {
    var self = this;
    
    self.setPs = function(name) {
        self.name = name;
        self.prepData = null;
        self.reqFunc = CONF.project.paysystemForms[name] || CONF.project.paysystemForms.def;
    }
    
    self.prep = function() {
        if ( self.reqFunc.prep ) {
            self.prepData = self.reqFunc.prep(self.prepData);
        }
    }
    
    self.send = function(data, func) {
        func = func || log;
        self.reqFunc.send(data, func, self.prepData);
    }
    
});



