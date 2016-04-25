
var PAGE = new eScenario('page', { autoClear: true });
var INIT = new eScenario('init', { });


PAGE.userData = {};


var initNode = function(link, self, done) {
    var cnn = S('.canonical')[0];
    
    PAGE.virtUrl = [];
    
    if ( cnn ) {
        PAGE.url = ENGINE.modLink(cnn.attr('href'));
        if ( window.location.href.indexOf(cnn.attr('href')) == 0 ) {
            PAGE.virtUrl = window.location.href.sl([cnn.attr('href').length]).split('/');
        }
    } else {
        PAGE.url = ENGINE.modLink(window.location.href);
    }
    
    var urlMap = PAGE.url.split('/');
    PAGE.urlMap = {
        data:urlMap,
        lang:urlMap[3]||'en',
        tpl:urlMap[4]
    }
    
    
    
    
    $P(PAGE, 'lang', function() {
        return PAGE.urlMap.lang;
    }, function(newLang) {
        var newUMap = CO(PAGE.urlMap);
        newUMap.lang = newLang;
        newUMap.data[3] = newLang;
        
        ENGINE.goPage(newUMap.data.join('/'), function() {
            PAGE.urlMap = newUMap;
            PAGE.langObj = ORM.O('lang_'+newLang);
        }, null, function() {
            POP.info.show(cr('div', 'alert').VAL(PAGE.ld('this page has not being translated yet')));
        });
    });
    
    done();
    
}

INIT.addAction('init', initNode);
PAGE.addAction('init', initNode);






INIT.addAction('ormRules', function(link, self, done) {
    
    mapDLS({
        'article':'category',
        'transaction':'exchange',
        'translog':'transaction,logmsg',
        'inbill':'transaction,coffer',
        'currency':'paysystem,accurrency',
        'merchant':'paysystem',
        'coffer':'currency,merchant',
        'acwallet':'accurrency',
        'acbill':'acwallet',
        'wallet':'currency'
    },f(to,from) { ENGINE.addRel(from,to); });
    
    ENGINE.buildRels();
    
    ORM.onModel('exchange', f(obj) {
        $P(obj._rel, 'in_currency',  f() { return ORM.O('currency_'+obj.in_currency_id);  });
        $P(obj._rel, 'out_currency', f() { return ORM.O('currency_'+obj.out_currency_id); });
        //-if ( obj.rate == 1 ) { obj.rate = (1).fromDec(); }
        //-if ( obj.raterev == 1 ) { obj.raterev = (1).fromDec(); }
    });
    
    ORM.onModel('transaction', f(obj) {
        $P(obj._rel, 'in_currency',  f() { return ORM.O('currency_'+obj.in_currency_id);  });
        $P(obj._rel, 'out_currency', f() { return ORM.O('currency_'+obj.out_currency_id); });
    });
    
    ORM.onModel('rate', f(obj) {
        $P(obj._rel, 'in_accurrency',  f() { return ORM.O('accurrency_'+obj.in_accurrency_id);  });
        $P(obj._rel, 'out_accurrency', f() { return ORM.O('accurrency_'+obj.out_accurrency_id); });
    });
    
    
    done();
    
}, { autoRun:'init' });








INIT.addAction('calcView', function(link, self, done) {
    
    var viewportNode = S('#confViewPort');
    
    PAGE.recalcViewport = function() {}
    
    if ( viewportNode ) {
        PAGE.recalcViewport = function() {
            if ( EVENT.data.windowSize.x > %sizeHuge || EVENT.data.windowSize.y > %sizeHuge ) {
                viewportNode.attr({content:"width=device-width/2, initial-scale=2, maximum-scale=2, user-scalable=no"});
            } else {
                viewportNode.attr({content:"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"});
            }
        }
    }
    
    //-SVG.meshAbstract1.bg(S('.theme')[0], { fill:'#f3f3f3', stroke:'#ddd', 'stroke-width':'0.02px'});
    //-SVG.meshTopLeft.bg(S('.navbar')[0], { fill:'#bdbdbd'});
    //-SVG.meshChess.bg(S('.navbar')[0], { fill:'#bdbdbd'});
    
    done();
}, { autoRun:'init' });



INIT.addAction('lang', function(link, self, done) {
    PAGE.langObj = filterObjects(RNG(ORM.model.lang), {name:PAGE.lang})[0];
    
    PAGE.ld = LOCALIZATION.ld;
    done();
}, { autoRun: 'ormRules' });




INIT.addAction('getSettings', function(link, self, done) {
    getRawData('/_view/ru/projectsettings/', f(data) {
        PROTOCOL.api.read(data,null,f(resp) {
            PAGE.projectSettings = resp.settings[0];
            done();
        });
    });
}, { autoRun: 'init' });

INIT.addAction('getPS', function(link, self, done) {
    ORM.req('paysystem:select', done);
}, { autoRun: 'init' });

INIT.addAction('getCurrency', function(link, self, done) {
    ORM.req('currency:select', done);
}, { autoRun: 'init' });

INIT.addAction('getCoffers', function(link, self, done) {
    ORM.req('coffer:select', done);
}, { autoRun: 'init' });

INIT.addAction('getExchange', function(link, self, done) {
    ORM.req('exchange:select', done);
}, { autoRun: 'init' });







INIT.addAction('authCheck', function(link, self, done) {
    ENGINE._auth.pop = POP.modal;
    
    if ( ENGINE.isIframe ) {
        PAGE.level = 0;
        done();
        return 0;
    }
    
    var act = getQuery(null, '#');
    
    if ( act.action ) {
        
        if ( act.action == 'forgot' ) { act.action = 'getuser'; }
        
        PROTOCOL.auth.write(':'+act.action, function(resp) {
            ENGINE._auth.authOk({}, resp.user[0], resp.session[0], function() {
                LOG.auth.write('confirm:', ['OK expiry',formatDate(resp.session[0].expiry, true, true),resp.session[0].token].join(' '));
                ENGINE._auth.reload();
            });
        }, function(resp) {
            LOG.auth.write('confirm:', ['Fail',parseStr(resp.statusData)].join(' '));
            ENGINE._auth.authFail({}, resp.statusData);
            log(resp.statusData);
        }, { token:act.token });
        
    } else if ( glob('user') ) {
        
        
        
        ENGINE._auth.renewMaybe(function() {
            if ( glob('user') && glob('user') != 'undefined' ) {
                PAGE.user = parseObj(glob('user'));
                
                EVENT.on('ORM.user.'+PAGE.user.id,f(nUser) {
                    PAGE.user = mergeObjects(PAGE.user, nUser);
                    glob('user',parseStr(PAGE.user));
                    PAGE.level = PAGE.user.lvl||%levelUser;
                    
                    PAGE.userData.auth2stepOn = {};
                    PAGE.userData.auth2stepCst = {};
                    
                    if ( nUser.auth2params ) {
                        if ( nUser.auth2params.model ) {
                            mapO(nUser.auth2params.model, f(val, sch) {
                                if ( val ) {
                                    var schMap = sch.split('_');
                                    var model = schMap.splice(0, 1)[0];
                                    var method = schMap.join('_');
                                    
                                    PAGE.userData.auth2stepOn[model] = PAGE.userData.auth2stepOn[model] || [];
                                    PAGE.userData.auth2stepOn[model].add(method);
                                }
                            });
                        }
                        if ( nUser.auth2params.custom ) {
                            mapO(nUser.auth2params.custom, f(val, sch) {
                                if ( val ) {
                                    var schMap = sch.split('_');
                                    var model = schMap.splice(0, 1)[0];
                                    var method = schMap.join('_');
                                    
                                    PAGE.userData.auth2stepCst[model] = PAGE.userData.auth2stepCst[model] || [];
                                    PAGE.userData.auth2stepCst[model].add(method);
                                }
                            });
                        }
                    }
                    
                }, true);
                
                
                EVENT.emit('ORM.user.'+PAGE.user.id, PAGE.user);
                
            } else {
                PAGE.level = 0;
            }
            done();
        });
        
    } else {
        PAGE.level = 0;
        done();
    }
}, { autoRun: 'lang,getSettings' });


INIT.addAction('getWallet', function(link, self, done) {
    if ( PAGE.level ) {
        ORM.req('wallet:select', f(list) {
            PAGE.userData.wallet = list;
            done();
        }, {
            selector:{'owner_id': ['=',PAGE.user.id]}
        });
    } else {
        done();
    }
}, { autoRun: 'authCheck' });





SYS.getProfile = function(func) {
    
    ORM.req('profile:select', function(profiles) {
        if ( profiles.length > 0 ) {
            PAGE.profiles = profiles;
            PAGE.profile  = PAGE.profiles[0];
            
            func();
        } else {
            ORM.req('profile:upsert', {
                owner_id: PAGE.user.id
            }, function(profiles) {
                PAGE.profiles = profiles;
                PAGE.profile  = PAGE.profiles[0];
                
                func();
            }, {
                selector: { owner_id: ['=', PAGE.user.id]}
            } );
        }
    }, {
        selector: { owner_id: ['=', PAGE.user.id]}
    } );
}



SYS.gettransactionreferer = f() {
    var exp = glob('refererexpire');
    if ( !exp ) { return null; }
    exp = parseInt(exp);
    if ( exp < new Date()*1 ) {
        glob.removeItem('refereruid');
        glob.removeItem('refererexpire');
        return null;
    }
    return glob('refereruid');
}


INIT.addAction('prep_userdata', function(link, self, done) {
    
    var act = getQuery(null, '#');
    if ( act.u && act.u != 'undefined' ) {
        if ( ( !PAGE.user || PAGE.user.id != act.u ) && glob('refereruid') != act.u) {
            glob('refereruid', act.u);
            glob('refererexpire', new Date()*1+(parseInt(PAGE.projectSettings.refererexpire||1)*1440000));//- conf in hours
        }
    }
    
    if ( new Date()*1+(parseInt(PAGE.projectSettings.refererexpire||1)*1440000) < new Date(glob('refererexpire'))*1 ) {
        glob('refererexpire', new Date()*1+(parseInt(PAGE.projectSettings.refererexpire||1)*1440000));
    }
    
    CONF.project.protocol.api.read.add(SYS.auth2step.reader);
    CONF.project.protocol.auth.read.add(SYS.auth2step.reader);
    
    if ( PAGE.level < 20 ) {
        done();
        return 0;
    } else {
        
        if ( PAGE.user.auth2params && PAGE.user.auth2type ) {
            
            CONF.project.protocol.api.write.add(SYS.auth2step.writer);
            CONF.project.protocol.auth.write.add(SYS.auth2step.writer);
            
        }
    }
    
    if ( PAGE.level < %levelModerator ) {
        SYS.globalUrlModification = f(url) {
            log(url);
            var q = getQuery(url, '#');
            q.u = PAGE.user.id;
            var result = [];
            mapO(q, f(v,k) { result.push(k+'='+v); });
            
            return [url.split('#')[0], '#', result.join('&')].join('');
        }
    }
    
    
    var nurl = SYS.globalUrlModification(window.location.href);
    if ( window.location.href != nurl ) {
        history.replaceState({
            selfUrl: nurl
        }, document.title, nurl);
    }
    
    //-SYS.getProfile(done);
    PAGE.profiles = [];
    PAGE.profile  = {};
    
    SYS.filterTransactions = CEF(function(func) {
        var dataList = filterObjects(objToArray(ORM.model.transaction), {owner_id: PAGE.user.id});
        dataList.sort(function(a,b) { return a.expiry - b.expiry; });
        PAGE.userData.transaction = dataList;
        if ( func && T(func) == T.F ) { func(); }
    });
    
    SYS.getTransactions = function(func) {
        ORM.req('transaction:select', function(dataList) {
            func(dataList);
        }, {
            selector: {
                owner_id: ['=', PAGE.user.id]
            },
            rng: [0,100]
        });
    }
    
    SYS.getTransactions(function() {
        ORM.onModel('transaction', SYS.filterTransactions);
        SYS.filterTransactions(done);
    });
    
    
}, { autoRun: 'authCheck' });






INIT.addAction('init_calcs', function(link, self, done) {
    PAGE.userData.acPaysystem = ORM.O('paysystem_ac');
    PAGE.userData.currencyAcEq = PAGE.userData.acPaysystem._rel.currency;
    
    CASH.normaliseExchanges();
    done();
    
}, { autoRun: 'getPS,getCurrency,getCoffers,getExchange,getWallet,authCheck' });




INIT.addAction('layer_prep', function(link, self, done) {
    LM.fetchPos(done);
}, { autoRun: 'prep_userdata,init_calcs' });



INIT.addAction('getAcwallet', function(link, self, done) {
    
    if ( PAGE.level ) {
        ORM.req('acwallet:select', f(list) {
            PAGE.userData.acwallet = RNG(list);
            
            done();
        }, {
            selector: {owner_id:['=',PAGE.user.id]}
        });
    } else {
        done();
    }
}, { autoRun: 'layer_prep' });

INIT.addAction('getAccurrency', function(link, self, done) {
    ORM.req('accurrency:select', done);
}, { autoRun: 'layer_prep' });



INIT.addAction('init_user', function(link, self, done) {
    
    if ( PAGE.level >= %levelManager ) {
        SYS.isAdmin = true;
        INIT.emit('initManager');
    } else {
        PAGE.run();
    }
    done();
    
}, { autoRun: 'getAcwallet,getWallet,getAccurrency' });




INIT.addAction('initManager', function(link, self, done) {
    done();
});

//-INIT.addAction('getMerchant', function(link, self, done) {
//-    ORM.req('merchant:select', done);
//-}, { autoRun: 'initManager' });
//-
//-INIT.addAction('getAccurrency', function(link, self, done) {
//-    if ( PAGE.level >= %levelAdmin ) {
//-        ORM.req('accurrency:select', done);
//-    } else {
//-        done();
//-    }
//-}, { autoRun: 'initManager' });

//-INIT.addAction('getAcwallet', function(link, self, done) {
//-    ORM.req('acwallet:select', done);
//-}, { autoRun: 'initManager' });




INIT.addAction('ormView', function(link, self, done) {
    
    var script = S('script')[0];
    
    if ( S('.aceScript').length == 0 ) {
        var newScript = cr('script').attr({
            type: 'text/javascript',
            src: ENGINE.path.static+'ace-src/ace.js',
            class:'aceScript'
        });
        insBefore(newScript, script);
    }
    if ( S('.extScript').length == 0 ) {
        var newScript = cr('script').attr({
            type: 'text/javascript',
            src: ENGINE.path.compiled+'extended.js',
            class:'extScript'
        });
        insBefore(newScript, script);
    }
    if ( S('.extCss').length == 0 ) {
        var newCss = cr('link').attr({
            rel: 'stylesheet',
            href: ENGINE.path.compiled+'extended.css',
            class:'extCss'
        });
        document.head.attach(newCss);
    }
    
    
    
    done();
}, { autoRun: 'initManager'});//-getAccurrency,getAcwallet,getMerchant







PAGE.addAction('recalcVP', function(link, self, done) {
    PAGE.recalcViewport();
    done();
}, { autoRun: 'init' })


PAGE.addAction('sendView', function(link, self, done) {
    ENGINE.viewInt = tm(function() {
        PROTOCOL.regview.write();
        PROTOCOL.regreferview.write();
    }, %timeView);
    ENGINE._clear.push(function() { clearInterval(ENGINE.viewInt); });
}, { autoRun: 'init' });



//- @
var checkALF = f() {
    if ( !PAGE.level ) {
        map(S('.ALF'), function(node) {
            node.onclick = ENGINE._auth.askLogin;
        });
        map(S('.ALFR'), function(node) {
            node.onclick = function() {
                POP.modal.show('auth-register');
                return false;
            };
        });
    } else {
        map(S('.ALF'), function(node) {
            node.onclick = function() {
                ENGINE._auth.logout();
            }
        });
    }
}
ENGINE.processDomQueue.add(checkALF);


PAGE.addAction('dom', function(link, self, done) {
    
    SYS.body = document.body;
        
    ENGINE.processDom();
    ENGINE.processDomFinish();


    map(S('.adsbygoogle'), function(node) {
        if ( !node.__jagp ) {
            if ( node.offsetWidth > 0 ) {
                (adsbygoogle = window.adsbygoogle || []).push({});
            } else {
                node.detach();
            }
            node.__jagp = true;
        }
    });
    
    
    map(S('.bgLayer'),     function(node) { SVG.meshLine.bg(node, {fill:'rgba(238,238,238,0.15)'});})
    //-map(S('.small-title'), function(node) { SVG.meshChess.bg(node, {fill:'rgba(255,255,255,0.15)'});})
    map(S('blockquote'),   function(node) { SVG.meshChess.bg(node, {fill:'rgba(255,255,255,0.25)'});})
    
    EVENT.resize.push(function() {
        map(S('textarea'), adjustHeight);
    });
    map(S('textarea'), autoAdjust);
    
    done();
}, { autoRun: 'recalcVP'});
























