
function addLabelAbility(self) {
    self.C.label = null;
    self.V.label = null;
    
    $P(self, 'label', function() { return self.C.label; }, function(str) {
        if ( str ) {
            if ( !self.V.label ) {
                self.V.label = cr('div','txt');
                insBefore(self.V.label, self);
            }
            self.V.label.val = str+':';
            //-self.V.input.attr({placeholder:str});
        } else {
            //-self.V.input.attr({placeholder:''});
            if ( self.V.label ) {
                detach(self.V.label);
                delete self.V.label;
            }
        }
        self.C.label = str || null;
    });
}

new eView('form_line', {
    create: f() { return _jO(cr('div','line oneline wide')); },
    init: f(self, obj) {
        self.V.key = self.cr('div','key');
        self.V.info = self.cr('div','info');
        self.V.val = self.cr('div');
        self.cr('hr','wClear');
        addLabelAbility(self);
    }
});

new eView('input_text', {
    create: f() { return _jO(cr('div','inp-block')); },
    init: f(self, obj) {
        self.V.cont  = self.cr('div','inp');
        self.V.input = self.V.cont.cr('input').attr({type:'text'});
        
        $P(self, 'val', f() { return self.V.input.val; }, f(data) {
            return (self.V.input.val = data);
        });
        addLabelAbility(self);
    }
});


new eView('input_ormdd', {
    create: f() { return _jO(cr('div','inp-block')); },
    init: f(self, objList) {
        self.V.cont  = self.cr('div','inp');
        self.V.input = cr.ormdropdown(objList, null, self.V.cont);
        
        $P(self, 'val', f() { return self.V.input.val; }, f(data) {
            return (self.V.input.val = data);
        });
        addLabelAbility(self);
    }
});


new eView('input_ddtext', {
    create: f() { return _jO(cr('div','inp-block')); },
    init: f(self, data) {
        if ( T(data) == T.A ) {
            var db = data;
            data = {};
            map(db, f(v){data[v]=v;});
        }
        self.V.cont  = self.cr('div','inp');
        self.V.input = cr.dropdown(data, null, self.V.cont, {customInput: true});
        
        $P(self, 'val', f() { return self.V.input.val; }, f(data) {
            return (self.V.input.val = data);
        });
        addLabelAbility(self);
    }
});




