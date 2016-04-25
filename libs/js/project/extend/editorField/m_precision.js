
new eEditorField('m_precision', {
    build: f(self, data) {
        var node = cr('input').attr({type: 'number'});
        
        $P(node, 'val', f() {
            var resp = 0;
            var val = this.value;
            for ( ;val < 1; resp += 1, val *= 10 );
            return resp;
        }, f(data) {
            this.value = 1 / Math.pow(10, data);
            return data;
        });
        
        return node;
    },
    postprocess: f(self, data, INP) { INP.fullSet.addCls('oneline'); }
});



