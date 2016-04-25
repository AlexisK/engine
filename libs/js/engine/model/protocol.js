
window.PROTOCOL = {};
ENGINE.protocolData = {};

function eProtocol(name, data, parent) {
    var self   = this;
    self.model = PROTOCOL;
    
    self.init = function() {
        if ( def(parent) ) {
            self.data = mergeObjects(ENGINE.protocolData[parent], data);
        } else {
            self.data = mergeObjects({
                method: 'post',
                prefix: '_handler',
                headers:{},
                write: function(self){},
                read: function(self) {}
            }, data);
        }
        
        self.reqester = window[self.data.method+'RawData'] || postRawData;
        
        ENGINE.protocolData[name] = self.data;
        PROTOCOL           [name] = self;
    }
    
    self.write = function() {
        var data = listToArray(arguments);
        data.splice(0,0,self);
        var todo = [];
        try {
            todo = CONF.project.protocol[name].write;
        } catch(err) {}
        
        var worker = f() { self.data.write.apply(self, data); }
        
        if ( todo.length == 0 ) {
            worker();
        } else {
            var q = new EQ(worker);
            map(todo, f(func) {
                q.add(f(done) {
                    func(done, data);
                });
            });
        }
    }
    
    self.read = function() {
        var data = listToArray(arguments);
        data.splice(0,0,self);
        
        var todo = [];
        try {
            todo = CONF.project.protocol[name].read;
        } catch(err) {}
        
        var worker = f() { self.data.read.apply(self, data); }
        
        if ( todo.length == 0 ) {
            worker();
        } else {
            var q = new EQ(worker);
            map(todo, f(func) {
                q.add(f(done) {
                    func(done, data);
                });
            });
        }
    }
    
    self.doReq = function(url, data, pFunc) {
        LOG.ajax.write(name+': ', data, {format:'obj'});
        self.reqester(url, data, pFunc, log, self.data.headers);
    }
    
    self.init();
}














