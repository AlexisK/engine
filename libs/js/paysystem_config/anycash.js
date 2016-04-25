ac: {
    externalRetry: false,
    hasExternal: false,
    bill: f(self, db, obj) {},
    
    inputs: {
        key: 'email'
    },
    
    validator: f(node) { return VALIDATOR.email(node); },
    //-in_inputs: lsMapToDict({}),
    //-out_inputs: lsMapToDict({
    //-    'insert,150': f(self, db, obj) {
    //-        db.template.input_coffer(self, db, obj, {
    //-            ph: 'user@yourdomain.com',
    //-            pre: 'out',
    //-            func: f(val) {
    //-                self.C.insertData.u_params.out.key = val;
    //-            }
    //-        });
    //-    }
    //-}),
    walletInput: {title: 'email'},
    
    additionalFields: {},
    merchantFields: {},
    cofferFields: {}
},


















