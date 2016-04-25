
new eEditorField('fee_type', {
    build: f(self, data) {
        return cr.dropdown(calcObj.fee_types);
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});



