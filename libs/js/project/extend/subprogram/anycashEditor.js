
new eSubprogram('anycashEditor', function(onfinish) {
    var self = this;
    
    self.init = function(func) {
        self.inited = true;
        
        self.editor = new eEditor({
            form: function(obj) {
                return {
                    title:      PAGE.ld('Настройки'),
                    submitStr:  PAGE.ld('save'),
                    fields:     parseLS('bal_req_period,untrans_del_period'),
                    custom: function() {},
                    schema: {}
                }
            },
            onsubmit: function(newDataMap, obj, onfinish) {
                var data = mergeObjects(obj, newDataMap[0]);
                
                ORM.req('settings_anycash:update', {
                    value: data
                }, function() {
                    PROTOCOL.tab.write('window.location.reload();', null, true);
                });
            }
        });
        func();
    }
    
    
    self.show = function() {
        if ( !self.inited ) {
            self.init(function() {
                ORM.prep('settings_anycash', function(obj) {
                    self.editor.prep(obj.value);
                });
            });
        } else {
            ORM.prep('settings_anycash', function(obj) {
                self.editor.prep(obj.value);
            });
        }
        
    }
    
});

ENGINE.menu['тех. настройки'] = new SUBPROGRAM.anycashEditor();

