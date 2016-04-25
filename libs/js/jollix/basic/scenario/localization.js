
var LOCALIZATION = new eScenario('localization', { initialRun: true, autoClear: true });


LOCALIZATION.addAction('getLangs', f(link, self, done){
    ORM.req('lang:select', done);
}, { autoRun: 'init' })

LOCALIZATION.addAction('getStrings', f(link, self, done){
    
    ORM.req('localization:select', f(list) {
        LOCALIZATION.langs = {};
        
        map(list, f(elem) {
            var lname = ORM.O('lang_'+elem.lang_id).name;
            LOCALIZATION.langs[lname] = LOCALIZATION.langs[lname] || {};
            LOCALIZATION.langs[lname][elem.key] = elem.value;
        });
        
        var func = f() {
            var langObj = LOCALIZATION.langs[PAGE.lang] || {};
            for ( var i = 0; i < arguments.length; i++ ) {
                var val = arguments[i];
                if ( langObj[val] ) { return langObj[val]; }
            }
            return arguments[arguments.length-1];
        }
        
        $P(LOCALIZATION, 'ld', f() {
            return func;
        });
        
        done();
    });
    
}, { autoRun: 'getLangs' });

LOCALIZATION.addAction('startProject', f(link, self, done){
    tm(f(){
        INIT.run();
    });
}, { autoRun:'getStrings' });

