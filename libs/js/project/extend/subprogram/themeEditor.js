
new eSubprogram('themeEditor', function(onfinish) {
    var self = this;
    
    self.init = function(func) {
        self.inited = true;
        
        self.editor = new eEditor2('Settings','updateTheme', {
            langPrefix:'value.langdata',
            schema: {
                value: {
                    'projectName':'text',
                    'headerhtml,footerhtml':'textarea',
                    'contact_mail1,contact_skype1,contact_phone1,contact_viber1,contact_telegram1,contact_fb,contact_tw,contact_vk,contact_gp':'text',
                    'refererexpire':'number',
                    'timeframes': {
                        'keep_transaction_notbilled,keep_transaction_notpayed':'number'
                    }
                }
            },
            lschema:{
                'ticket_topics':'textarea'
            },
            group: {
                g_project: {
                    title: 'Project',
                    fields: 'value.projectName,value.headerhtml,value.footerhtml'
                },
                g_settings: {
                    title: 'Settings',
                    fields: 'value.refererexpire,value.timeframes'
                },
                g_contact: {
                    title: 'Contact',
                    fields: 'value'
                }
            },
            order:'g_project,g_settings,g_contact'
        });
        
        ED2Q.processors.update(self.editor);
        self.editor.onSetData = f(self, obj) {self.V.title.val = PAGE.ld('Настройки проекта');}
        //-self.editor.submit = f(obj, basedata, langdata, onfinish) { log(obj, basedata, langdata); onfinish(); }
        
        
        func();
    }
    
    
    self.show = function() {
        if ( !self.inited ) {
            self.init(function() {
                ORM.prep('settings_theme', function(obj) {
                    self.editor.showNew(obj);
                });
            });
        } else {
            ORM.prep('settings_theme', function(obj) {
                self.editor.showNew(obj);
            });
        }
        
    }
    
});

ENGINE.menu['настройки проекта'] = new SUBPROGRAM.themeEditor();

