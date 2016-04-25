
new eEditorField('ceil_method', {
    build: f(self, data) {
        return cr.dropdown(parseLS('floor,ceil,round'));
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});



