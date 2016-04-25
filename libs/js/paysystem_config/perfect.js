perfect: {
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
            action           : 'https://perfectmoney.is/api/step1.asp'
        });
        
        mapO(bill.params, f(val, field) {
            //-form.cr('div').VAL(field);
            form.cr('input').attr({
                type  : 'hidden',
                name  : field,
                value : val
            });
        });
        
        //-form.cr('input').attr({
        //-    type: 'submit'
        //-});
        
        target.appendChild(form);//- FF workaround
        form.submit();
        
    },
    
    inputs: {
        key: 'perfect'
    },
    
    validator: f(node) { return VALIDATOR.ps_perfect(node); },
    //-in_inputs: lsMapToDict({
    //-    'insert': f(self, db, obj) {
    //-        db.template.input_coffer(self, db, obj, {
    //-            ph: 'U1234567',
    //-            func: f(val) {
    //-                self.C.insertData.u_params.in.key = val;
    //-            }
    //-        });
    //-        
    //-    }
    //-}),
    //-out_inputs: lsMapToDict({
    //-    'insert,150': f(self, db, obj) {
    //-        db.template.input_coffer(self, db, obj, {
    //-            ph: 'U1234567',
    //-            pre: 'out',
    //-            func: f(val) {
    //-                self.C.insertData.u_params.out.key = val;
    //-            }
    //-        });
    //-        
    //-    }
    //-}),
    walletInput: {title: 'account'},
    
    additionalFields: {},
    merchantFields: {
        'login,pwd,passphrase,codephrase,key' : 'text'
    },
    cofferFields: {}
},


















