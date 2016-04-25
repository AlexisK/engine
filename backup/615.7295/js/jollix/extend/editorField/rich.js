
new eEditorField('rich', {
    build: f(self, data) {
        var input = cr('div');
        wysiwyg(input, data.headoptions, {is_bb:true});
        
        data.wysiwyg.push(input);
        
        return input;
    },
    buildView: f(self, data) {
        var node = cr('div', 'wys_inside');
        var nodeC = node.cr('div','editing');
        
        node.__selfVal;
        
        $P(node, 'val', f() { return node.__selfVal; }, f(data) {
            node.__selfVal = data;
            nodeC.innerHTML = data.text||'';
        });
    },
    postprocess: f(self, data, INP) {
        INP.fullSet.style.marginBottom = '2em';
    }
});
