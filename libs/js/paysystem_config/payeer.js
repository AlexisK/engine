payeer: {
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
        
        
        var strMap = [];
        
        mapO(bill.params, f(val, field) {
            strMap.push([field, val].join('='));
        });
        
        var form = cr('form').attr({
            method           : 'POST',
            'accept-charset' : 'UTF-8',
            action           : 'https://payeer.com/merchant/?'+strMap.join('&')
        });
        
        target.appendChild(form);//- FF workaround
        form.submit();
        
    },
    
    inputs: {
        key: 'payeer'
    },
    
    validator: f(node) { return VALIDATOR.ps_payeer(node); },
    //-in_inputs: lsMapToDict({
    //-    'insert': f(self, db, obj) {
    //-        db.template.input_coffer(self, db, obj, {
    //-            ph: 'P123456',
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
    //-            ph: 'P123456',
    //-            pre: 'out',
    //-            func: f(val) {
    //-                self.C.insertData.u_params.out.key = val;
    //-            }
    //-        });
    //-        
    //-    },
    //-    '250': f(self, db, obj) {
    //-        
    //-    }
    //-}),
    walletInput: {title: 'account'},
    
    additionalFields: {},
    merchantFields: {
        'in_pwd,out_pwd': 'text',
        'in_login,out_login': 'int',
        'name': 'ps_payeer'
    },
    cofferFields: {}
},

