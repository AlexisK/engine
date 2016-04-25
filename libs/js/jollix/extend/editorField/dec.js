
new eEditorField('dec', {
    build: f(self, data) {
        var newNode = cr('input').attr('type', 'number');
        newNode.__precision = data.precision;
        ADAPTER.dec.process(newNode);
        return newNode;
    },
    buildView: f(self, data) {
        var newNode = cr('div');
        newNode.__precision = data.precision;
        ADAPTER.dec.process(newNode);
        return newNode;
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});
