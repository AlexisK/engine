

new eProcessor('insertview', {
    process: function(self, db) {
        db.getData(self, db, f(list) {
            db.drawData(self, db, list);
        });
    },
    getData: f(self, db, todo) {
        var urlMap = [self.D.src];
        if ( self.D.args ) {
            map(self.D.args.split('/'), f(key) {
                if ( key.length > 0 ) {
                    urlMap.push((db.keyRules[key] || db.keyRules.def)(self, db, key));
                }
            });
        }
        
        var url = urlMap.join('/');
        //-log(url);
        getRawData(url, f(html) {
            var t = cr('div');
            t.innerHTML = html;
            todo(t.childNodes);
        });
    },
    drawData: f(self, db, nodeList) {
        self.innerHTML = '';
        map(nodeList, f(node) {
            try {
                self.attach(node);
            } catch(err) {}
        })
    },
    keyRules: {
        'def':f(self, db, val) {
            return val;
        },
        'token': f(self, db, val) {
            if ( PAGE.level ) {
                return glob('token');
            }
            return null;
        }
    }
});















