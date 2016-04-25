yandex: {
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
            action           : 'https://sp-money.yandex.ru/oauth/authorize'
        });

        mapO(bill.params, f(val, field) {
            form.cr('input').attr({
                type  : 'hidden',
                name  : field,
                value : val
            });
        });
        //-SYS.test = form;
        //-log(form)
        target.appendChild(form);//- FF workaround
        form.submit();
        
    },
    
    inputs: {
        key: 'yandex'
    },
    
    validator: f(node) { return VALIDATOR.ps_yandex(node); },
    //-in_inputs: lsMapToDict({
    //-    'insert': f(self, db, obj) {
    //-        db.template.input_coffer(self, db, obj, {
    //-            ph: '41001012345678901',
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
    //-            ph: '41001012345678901',
    //-            pre: 'out',
    //-            func: f(val) {
    //-                self.C.insertData.u_params.out.key = val;
    //-            }
    //-        });
    //-        
    //-    },
    //-    
    //-}),
    additionalFields: {},
    merchantFields: {'in_login,in_pwd,out_login,out_pwd':'hex'},
    cofferFields: {}
},

