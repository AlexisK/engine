
new eProcessor('mobExtendBlock', {
	process: function(self, db) {
        _jO(self);
        self.V.exts = S('.mk_ext', self);
        self.V.triggers = S('.mk_trigger', self);
        self.C.mobSize = %wrapperRatesMobile;

        self.F.isMob = function() {
        	return EVENT.data.windowSize.x <= self.C.mobSize;
        }

        map(self.V.triggers, function(node, index) {
        	evt(node, 'click', function() {
        		if ( self.F.isMob() ) {
        			map(self.V.exts, function(ext, i) {
        				ext.addCls('hide');
        				self.V.triggers[i].remCls('active');
        			});
        			self.V.exts[index].remCls('hide');
        			node.addCls('active');
        		}
        	});
        });

    },
    singleProcess: false
});
