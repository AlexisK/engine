cr.dropdown = function(data, cls, parent, params) {
    params = mergeObjects({
        limit: null,
        customInput: false,
        noUpdateOnVal: false,
        autocompleteMinChars: 0,
        validator: f() { return true; },
        defValue: null
    }, params);
    
    var node = _jO(cr('div', 'jDropdown '+cls, parent));
    node.lastSelectedNode = false;
    dispatchOnUpdate(node);
    node._data = data;
    node._ddHead = node.cr('div', 'jHead');
    node._ddBody = node.cr('div', 'jBody');
    node._ddFilt = node.cr('input', 'jFilt').attr({type:'text'});
    
    if ( params.placeholder ) {
        node._ddFilt.attr({placeholder: params.placeholder});
    }
    
    node._ddnodes    = {};
    node._ddnodeList = [];
    node._state      = null;
    
    node.C._updData = null;
    node.C._updFunc = [];
    
    node._ddOpened = false;
    node._curResults = [];
    
    node._ddHead.onclick = function() {
        node._ddFilt.focus();
    }
    
    
    node.directSelect = function() {}
    node.oneachstate = function() {}
    node._oneachstate = function() {
        node.oneachstate(node._state);
    }
    
    
    node.F.prepareResults = f() {
        
        var lim = params.limit;
        if ( node._ddFilt.val.length < params.autocompleteMinChars ) { lim = 0; }
        
        node._curResults = domSearch(node._ddnodeList, node._ddFilt.val, null, null, {limit:lim});//-,reqValue:params.limit
        
        if ( node._curResults.length == 0 ) {
            node._ddHead.remCls('hasOptions');
        } else {
            node._ddHead.addCls('hasOptions');
        }
        
    }
    
    
    
    node.F.ddopen  = function() {
        if ( node.lastSelectedNode ) { detach(node.lastSelectedNode); }
        node.addCls('active');
        
        //-node._ddHead.attr({placeholder:PAGE.ld('filter')});
        //-node._ddHead.attr({contenteditable:true});
        if ( params.customInput ) {
            node._ddFilt.val = node._ddHead.val;
            node._ddFiltSaved = node._ddFilt.val;
            node._ddHead.val = '';
        } else {
            node._ddHead.val = '';
            node._ddFilt.val = '';
        }
        
        node.F.prepareResults();
        
        node._ddOpened = true;
        
        //-node._ddHead.focus();
        node._ddFilt.focus();
        
        //-closeOnClick(node,null,f() {
        //-    node.F.ddclose();
        //-    if ( node._curResults.length == 1) {
        //-        node._curResults[0].click();
        //-    }
        //-});
    }
    node.F.ddclose = function() {
        node.remCls('active');
        //-node._ddHead.remattr('contenteditable');
        
        
        if ( params.customInput ) {
            if ( params.validator(node._ddFilt.val) ) {
                node._ddHead.val = node._ddFilt.val;
            } else if ( def(node._ddFiltSaved) ) {
                node._ddHead.val = node._ddFiltSaved;
            }
            node._ddFilt.val = '';
        } else if ( node._ddnodes[node._state] ) {
            node._ddFilt.val = '';
            node._ddHead.innerHTML = '';
            var anode = node._ddnodes[node._state].cloneNode(true);
            node._ddHead.attach(anode);
            node.lastSelectedNode = anode;
        } else {
            node._ddFilt.val = '';
            node._ddHead.val = '';
        }
        node._ddOpened = false;
    }
    
    
    node._ddFilt.onkeyup = function(ev) {
        
        if ( ev.keyCode == 13 ) {
            if ( params.customInput ) {
                node._ddFilt.blur();
            } else if ( node._curResults.length > 0 ) {
                node._curResults[0].clickOn();
            }
            return false;
        } else {
            node._curResults = domSearch(node._ddnodeList, node._ddFilt.val, null, null, {limit:params.limit,reqValue:params.limit});
        }
    }
    
    
    
    node.F.ddBuild = function() {
        node._ddnodeList = [];
        node._ddnodes = {};
        node._ddBody.innerHTML = '';
        
        var iterf = mapO;
        if ( T(node._data) == T.A ) {
            iterf = map;
        }
        
        iterf(node._data, function(val, key) {
            if ( key == 'null' ) { key = null; }
            var btn = node._ddBody.cr('div', 'asBtn fa')
            
            if ( typeof(val) == 'string' || typeof(val) == 'number' ) {
                btn.VAL(val);
            } else {
                btn.attach(val);
            }
            
            node._ddnodes[key] = btn;
            node._ddnodeList.push(btn);
            btn.selfKey = key;
            btn.clickOn = function() {
                //-node.F.ddclose();
                node._ddFilt.blur();
                
                node.val = this.selfKey;
                node.F.runUpdates(node.val, true);
                //-node.C._emitUpdated();
                node.directSelect(node.val);
            }
            btn.onmousedown = btn.clickOn;
        });
        node._oneachstate();
    }
    
    node.F.runUpdates = f(data, forceUpdate) {
        var updateOnVal = forceUpdate || !params.noUpdateOnVal;
        if ( updateOnVal && node.C._updData != data ) {
            node.C._updFunc.map(function(func) {
                func(data);
            });
        }
    }
    
    $P(node, 'val', function() { return node._state; }, function(data) {
        
        if ( data === true ) { data = 'True'; } else if ( data === false ) { data = 'False'; }
        
        if ( params.customInput ) {
            node._ddHead.val = data;
            
            node._state = data;
            
            node.F.runUpdates(data);
            
            node._oneachstate();
            return node._state;
        }
        
        if ( node._ddnodes[data] ) {
            node._ddHead.innerHTML = '';
            var anode = node._ddnodes[data].cloneNode(true);
            node._ddHead.attach(anode);
            node.lastSelectedNode = anode;
            //-node._ddHead.val = node._ddnodes[data].val;
            
            node._state = data;
            
            node.F.runUpdates(data);
            
            if ( node._state && node._state != 'None' ) { node.addCls('selected'); } else { node.remCls('selected'); }
            
            node._oneachstate();
            return node._state;
        }
        
        node._ddHead.val = '';
        node._state = null;
        node._oneachstate();
        return node._state;
    });
    
    //-evt(node._ddHead, 'click', function() {
    //-    if ( node._ddOpened ) { node.F.ddclose(); } else { node.F.ddopen(); }
    //-});
    //-evt(node._ddHead, 'blur', function() {
    //-    node.F.ddclose();
    //-    
    //-    if ( node._curResults.length == 1) {
    //-        node._curResults[0].click();
    //-    }
    //-});
    evt(node._ddFilt, 'focus', function() { node.F.ddopen(); });
    evt(node._ddFilt, 'blur', function() {
        
        node.F.ddclose();
        if ( params.customInput ) {
            node.val = node._ddHead.val;
            node.F.runUpdates(node.val, true);
            node.directSelect(node.val);
        } else {
            if ( node._curResults.length == 1) {
                node._curResults[0].clickOn();
            } else if ( node.lastSelectedNode ) {
                node.lastSelectedNode.remCls('hidden');
                node._ddHead.attach(node.lastSelectedNode);
            }
        }
    });
    node.F.ddBuild();
    node.F.prepareResults();
    if ( def(params.defValue) ) {
        var keys = okeys(node._ddnodes);
        if ( node._ddnodes[params.defValue] ) {
            node._ddnodes[params.defValue].clickOn();
        } else if ( keys.length > 0 ) {
            node._ddnodes[keys[0]].clickOn();
        }
    }
    
    
    return node;
}


cr.ormdropdown = function(objList, cls, parent, params) {
    var reqD = {};
    params = mergeObjects({
        method: 'getFullName'
    }, params);
    map(objList, f(obj) {
        reqD[obj.id] = ORM[params.method](obj);
    });
    return cr.dropdown(reqD, cls, parent, params);
}


