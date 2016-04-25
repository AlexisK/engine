
new eEditorField('datetime', {
    build: f(self, data) {
        var node =  cr.calendartimeinput();
        node.updateOnVal = true;
        return node;
    },
    buildView: f(self, data) {
        var node = cr('div');
        ADAPTER.datetime.process(node);
        return node;
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});
