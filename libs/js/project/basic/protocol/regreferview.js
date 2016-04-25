
new eProtocol('regreferview', {
    prefix: '/_handler/regreferview/',
    lastId: '',
    write: function(self, id) {
        var rid = glob('refereruid');
        if ( !rid || glob('refereruid_sent') == rid ) { return 0; }
        
        self.doReq(self.data.prefix, parseStr({
            id:rid
        }), function(resp) { self.read(resp); });
        
        glob('refereruid_sent', rid);
    },
    
    
    read: function(self) {}
    
});










