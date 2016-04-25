
new eSubprogram('mailEditor', function(onfinish) {
    var self = this;
    
    self.init = function(func) {
        self.inited = true;
        
        self.editor = new eEditor({
            form: function(obj) {
                return {
                    title:      PAGE.ld('Шаблоны писем'),
                    submitStr:  PAGE.ld('save'),
                    fields:     parseLS('mail_from'),
                    ldfields:   parseLS('top_forgot,tpl_forgot,top_confirm,tpl_confirm'),
                    custom: function() {},
                    includeLang: true
                }
            },
            onsubmit: function(newDataMap, obj, onfinish) {
                var data = mergeObjects({
                    mail_from: ORM.O('settings_mailtemplate').value.mail_from
                }, newDataMap[0]);
                
                mapO(ORM.model.lang, function(lang) {
                    data[lang.name] = mergeObjects(obj[lang.name], newDataMap[1][lang.name])
                });
                
                
                ORM.req('settings_mailtemplate:update', { value: data }, log);
            }
        });
        func();
    }
    
    
    self.show = function() {
        if ( !self.inited ) {
            self.init(function() {
                ORM.prep('settings_mailtemplate', function(obj) {
                    self.editor.prep(obj.value);
                });
            });
        } else {
            ORM.prep('settings_mailtemplate', function(obj) {
                self.editor.prep(obj.value);
            });
        }
        
    }
    
});

ENGINE.menu['шаблоны писем'] = new SUBPROGRAM.mailEditor();

