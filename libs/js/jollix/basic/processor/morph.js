

new eProcessor('morph', {
    process: f(self, db) {
        tm(f(){ db._process(self, db); });
    },
    _process: f(self, db) {
        
        _jO(self);
        
        dispatchOnUpdate(self);
        
        var at;
        var clsList = self.className.split(/\s+/g);
        
        if ( self._tag == 'select' || clsList.contains('select') ) {
            at = 'select';
        } else if ( self._tag == 'input' || clsList.contains('input') ) {
            at = self.D.type || self.attr('type') || 'text';
        }
        
        if ( at ) {
            if ( db.rules[at] ) {
                tm(f() {
                    db.ruleWrapper(self,db,at);
                });
                
            } else if ( db.rulesraw[at] ) {
                tm(f() {
                    db.rulesraw[at](self,db);
                });
                
            }
        }
        
    },
    ruleWrapper: f(self, db, rule) {
        var newNode = db.rules[rule](self);
        if ( !newNode ) { return self; }
        
        self.insBefore(newNode);
        self.addCls('hidden');
        
        $P(self, 'val', f() {
            return newNode.val;
        }, f(data) {
            return (newNode.val = data);
        });
        
        self._morphNode = newNode;
        
        return newNode;
    },
    rules: {
        'checkbox': f(node) {
            var newNode = cr.bool();
            newNode.val = node.checked;
            newNode.onupdate(function(val) {
                node.checked = val;
                node.C._emitUpdated();
            });
            
            node.V.viewNode = newNode;
            
            return newNode;
        },
        'date': f(node) {
            if ( node.attr('disabled') ) {
                node.attr({type:'text'});
                node.val = formatDate(node.val);
                node.remCls('hidden');
                return null;
            }
            
            var newNode = cr.dateinput();
            newNode.val = node.val;
            
            newNode.onupdate(function(val) {
                node.val = val;
                node.C._emitUpdated(node.val);
            });
            
            node.V.viewNode = newNode;
            
            return newNode;
        },
        select: f(node) {
            var dt = {};
            var nodes = S('option', node).concat(S('.option', node));
            
            map(nodes, f(opt) {
                _jO(opt);
                var chds = getChildren(opt);
                
                if ( chds.length == 0 ) {
                    dt[opt.D.value||opt.value] = opt.textContent;
                } else {
                    dt[opt.D.value||opt.value] = chds[0];
                }
            });
            
            var newNode = cr.dropdown(dt, null, null, {
                noUpdateOnVal: true
            });
            newNode.val = node.D.value || node.val;
            
            newNode.onupdate(function(val) {
                node.val = val;
                node.C._emitUpdated(node.val);
            });
            
            node.V.viewNode = newNode;
            
            return newNode;
        }
        
    },
    rulesraw: {
        'file': f(node) {
            var newNode = cr.fileselector();
            newNode.F.setInput(node);
            
            newNode.onupdate(function(val) {
                node.C._emitUpdated(node.val);
            });
            return newNode;
        }
    }
})


















