
new eEditorField('dec', {
    build: f(self) {
        var newNode = cr('input').attr('type', 'number');
        ADAPTER.dec.process(newNode);
        return newNode;
    },
    buildView: f(self, data) {
        var newNode = cr('div');
        ADAPTER.dec.process(newNode);
        return newNode;
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});
