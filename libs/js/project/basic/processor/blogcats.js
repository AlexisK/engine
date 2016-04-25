
new eProcessor('blogcats', {
    process: function(self, db) {
        _jO(self).C.catLinks = S('.mk_blogcat', self);
        self.C.checkUrl = ENGINE.modLink(self.D.bcparent);
        
        map(self.C.catLinks, function(node) {
            if ( self.C.checkUrl == ENGINE.modLink(node.href) ) {
                node.addCls('active');
                return false;
            }
        });
    }
});






















