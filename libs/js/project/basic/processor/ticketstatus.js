

new eProcessor('ticketstatus', {
    process: function(self, db) {
        _jO(self);
        
        self._status = self.val;
        
        self.val = CONF.project.ticketstatus[self._status];
        self.addCls(CONF.project.ticketstatusColor[self._status]);
    }
});















