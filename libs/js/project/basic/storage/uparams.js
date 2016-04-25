
var UPARAMS = new eStorage('uparams', {
    store: f(self, name, data) {
        data = mergeObjects({
            ph: 'placeholder',
            title: 'title',
            validator: VALIDATOR.notEmpty
        }, data);
        
        self.cont[name] = data;
    }
},'');
























