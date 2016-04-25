
new eEditorField('hex', {
    validator: VALIDATOR.hex,
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});



