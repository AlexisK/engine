privat24: {
    externalRetry: false,
    hasExternal: true,
    bill: f(self, db, obj, resp) {
        var target;
        var bill = resp.inbill[0];
        
        if ( SYS.payWnd ) {
            target = SYS.payWnd.document.body;
        } else {
            target = db.externalForm();
        }
        
        var form = cr('form').attr({
            method           : 'POST',
            'accept-charset' : 'UTF-8',
            action           : 'https://api.privatbank.ua/p24api/ishop'
        });
        
        mapO(bill.params, f(val, field) {
            //-form.cr('div').VAL(field);
            form.cr('input').attr({
                type  : 'hidden',
                name  : field,
                value : val
            });
        });
        
        //-form.cr('input').attr({type: 'submit'});
        
        target.appendChild(form);//- FF workaround
        form.submit();
        
    },
    
    inputs: {
        key: 'creditcard'
    },
    
    validator: f(node) { return VALIDATOR.creditcard(node); },
    //-in_inputs: lsMapToDict({
    //-    'insert': f(self, db, obj) {
    //-        db.template.input_coffer(self, db, obj, {
    //-            ph: 'XXXX XXXX XXXX XXXX',
    //-            func: f(val) {
    //-                self.C.insertData.u_params.in.key = val;
    //-            }
    //-        });
    //-    }
    //-}),
    //-out_inputs: lsMapToDict({
    //-    'insert,150': f(self, db, obj) {
    //-        db.template.input_coffer(self, db, obj, {
    //-            ph: 'XXXX XXXX XXXX XXXX',
    //-            pre: 'out',
    //-            func: f(val) {
    //-                self.C.insertData.u_params.out.key = val;
    //-            }
    //-        });
    //-    }
    //-}),
    walletInput: {title: 'creditcard'},
    
    additionalFields: {},
    merchantFields: {
        'key': 'text',
        'merchant': 'int',
        'card': 'creditcard'
    },
    cofferFields: {},
    cofferNameValidation: f(node) { return VALIDATOR.creditcard(node.V.input); }
},






