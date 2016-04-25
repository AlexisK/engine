window.VALIDATOR = {};


function eValidator(name, data, isCustom) {
    var self = this;
    self.model = VALIDATOR;
    
    self.init = function() {
        self.data = {};
        
        if ( typeof(data) == 'function' ) {
            self.data.check = data;
            
        } else if ( typeof(data) == 'object' && data.constructor == RegExp ) {
            self.data.check = function(val) { return data.test(val); }
            
        } else {
            self.data = data;
        }
        
        self._init();
    }
    
    self._init = function() {
        
        if ( isCustom ) {
            VALIDATOR[name] = function() {
                return self.data.check.apply(self, [self].concat(listToArray(arguments)));
            }
            
        } else {
            VALIDATOR[name] = function(node) {
                if (self.data.wrap) {
                    self.data.wrap(self, node);
                }
                return self.run(node, f(val) {
                    return self.data.check(val, node, self);
                });
            }
        }
        
    }
    
    
    self.runSingle = function(elem, func) {
        if ( func(elem.val) ) {
            remCls(elem, 'notValid');
            addCls(elem, 'isValid');
            return true;
        } else {
            remCls(elem, 'isValid');
            addCls(elem, 'notValid');
            return false;
        }
    }
    
    self.run = function(target, func) {
        target.onkeyup = function() { self.runSingle(this, func); }
        return self.runSingle(target, func);
    }
    
    self.init();
}



