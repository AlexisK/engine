function $AD(obj, path, params) {
    params = params || {};
    
    if ( !def(obj) ) { return null; }
    if ( typeof(path) == 'string' ) { path = path.split('.'); }
    
    if ( path.length > 0 ) {
        
        if ( !def(obj[path[0]]) && def(params.autocreate) ) {
            obj[path[0]] = CO(params.autocreate);
        }
        
        if ( def(params.setVal) && path.length == 1) {
            obj[path[0]] = params.setVal;
        }
        
        return $AD(obj[path.splice(0,1)[0]], path, params);
    }
    
    return obj;
}

var addressIt = $AD;
