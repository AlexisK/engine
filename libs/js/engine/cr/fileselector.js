
cr.fileselector = function(params,cls, parent) {
    //- defaults
    params = mergeObjects({
        is_multiple: false,
        str: null,
        placeholder: 'file_not_chosen'
    }, params);
    
    //- init
    var node = _jO(cr('div', 'jFileSel '+cls||'', parent));
    dispatchOnUpdate(node);
    node.files = [];
    $P(node, 'file', f() {
        return node.files[0];
    }, f(data){ return data; });
    $P(node, 'val', f() {
        return node.files;
    }, f(data){ return data; });
    $P(node, 'filename', f() {
        if ( !node.files[0] ) { return ''; }
        return getFileName(node.files[0]);
    }, f(data){ return data; });
    
    
    
    node.V.button = node.cr('div','asBtn').VAL(PAGE.ld(params.is_multiple && ('Select files') || ('Select file')));
    node.V.path   = node.cr('div','path').VAL(PAGE.ld(params.placeholder));

    node.F.setInput = f(inp) {
        
        if ( node.V.selector ) {
            node.V.selector.onchange = f(){};
            detach(node.V.selector);
            if ( node.V.selector.V && node.V.selector.V.viewNode == node ) {
                delete node.V.selector.V.viewNode;
            }
        }
        
        if ( !node.parentNode && inp && inp.parentNode ) {
            insBefore(node, inp);
        }
        
        inp = inp || node.cr('input').attr({
            type: 'file'
        });
        if ( ENGINE.isIB ) {
            inp.style="position:fixed;top:-10000px;left:-10000px;";//- Safari fix 
            node.attach(inp);
        } else {
            detach(inp);
        }
        if ( params.is_multiple ) {
            inp.attr({
                multiple: true
            })
        }
        
        
        
        
        
        node.V.selector = inp;
        _jO(node.V.selector).V.viewNode = node;
        //-node.V.path.val = node.V.selector.value;
        
        evt(node.V.selector, 'change', f(ev) {
            node.files = [];
            map(ev.target.files, f(file) {
                if ( file ) {
                    node.files.push(file);
                    node.V.path.val = node.V.selector.value;
                }
            });
            node.C._emitUpdated();
        });
        
        
        node.F.checkDisabled();
    }
    
    node.F.checkDisabled = f() {
        if ( node.V.selector.attr('disabled') ) {
            node.disabled = true;
            node.addCls('disabled')
        } else {
            node.disabled = false;
            node.remCls('disabled')
        }
    }
    
    evt(node.V.button, 'click', f() {
        if ( !node.disabled ) { node.V.selector.click(); }
    });
    
    node.F.setInput();
    
    return node;
}


