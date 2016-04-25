
new eEditorField('creditcard', {
    validator: VALIDATOR.creditcard,
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});



