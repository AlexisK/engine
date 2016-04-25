
new eEditorField('ps_perfect', {
    validator: VALIDATOR.ps_perfect,
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});



new eEditorField('ps_payeer', {
    validator: VALIDATOR.ps_payeer,
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});



new eEditorField('ps_yandex', {
    validator: VALIDATOR.ps_yandex,
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline wide'); }
});



