
new eEditorField('bool', {
    build: f(self, data) {
        return cr.bool();
    },
    buildView: f(self, data) {
        var node = cr.bool('readonly');
        return clearEvents(node);
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});
