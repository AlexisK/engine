
new eProtocol('form', {
    prefix: '/_handler/api/',
    
    write: function(self,reqStr,data,funcOk,funcBad, table) {
        reqStr     = reqStr.split(':');
        
        var reqDict = mergeObjects({
            table: reqStr[0],
            method: reqStr[1]
        }, data);
        
        if ( reqDict.data && T(reqDict.data) == T.O ) {
            reqDict.data = parseStr(reqDict.data);
        }
        
        
        var tokenStr = '';
        if ( def(glob('token')) ) {
            tokenStr = ['?token', glob('token')].join('=');
        }
        
        self.doReq(self.data.prefix+tokenStr, parseForm(reqDict), function(resp, respObj) { self.read(resp, respObj, funcOk, funcBad); });
    },
    
    
    read: function(self, resp, respObj, funcOk, funcBad) {
        funcOk = funcOk||log;
        funcBad = funcBad || funcOk;
        
        var nFuncOk = f(data, original) {
            return funcOk([], data, original);
        }
        
        PROTOCOL.api.read(resp, respObj, nFuncOk, funcBad);
    }
});











