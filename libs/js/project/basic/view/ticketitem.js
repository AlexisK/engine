
new eHtml('ticketitem', '<div class="time"></div><div class="pr_ticketstatus"></div><div class="text"></div>', {
    div: 'time,status,text'
});

new eView('ticketitem', {
    create: f() { return HTML.ticketitem(cr('a','ticketitem')); },
    init: f(self, obj) {
        
        self.href = ['/',PAGE.lang,'/ticket/',obj.name,'/'].join('');
        
        self.V.status.val = obj.status;
        self.V.time.val = formatDate(obj.ctime,true,true);
        self.V.text.val = obj.subject;
        
        PROCESSOR.dynamicLink.process(self);
    }
});




new eHtml('ticketadditem','<p></p><p></p><div></div><input type="text" class="hidden" /><p></p><textarea></textarea><div class="asBtn submit"></div>',{
    p:'label_main,label_subject,label_text',
    textarea:'textarea',
    input:'subjectother',
    div:'subjectblock,submit'
});




new eView('ticketadditem', {
    create: f() { return HTML.ticketadditem(cr('div','ticketadditem')); },
    init: f(self) {
        self.V.label_main.val = PAGE.ld('add new ticket');
        
        var opts = {};
        try {
            var nopts = PAGE.projectSettings.value.langdata[PAGE.lang].ticket_topics.split(/\,\s*/g);
            map(nopts, f(v) { opts[v] = v; });
            var oStr = PAGE.ld('ticket_other');
            opts[oStr] = oStr;
        } catch(err) {}
        
        if ( okeys(opts).length ) {
            self.V.subject = cr.dropdown(opts, null, self.V.subjectblock);
            
            self.V.subject.onupdate(f(val) {
                if ( val == oStr ) {
                    self.V.subjectother.remCls('hidden');
                } else {
                    self.V.subjectother.addCls('hidden');
                    self.V.subjectother.val = val;
                }
            });
            
            self.V.subject.val = okeys(opts)[0];
        } else {
            self.V.subjectblock.addCls('hidden');
            self.V.subjectother.remCls('hidden');
        }
        
        
        
        self.V.subjectother.attr({placeholder:PAGE.ld('Subject')});
        self.V.label_subject.val = PAGE.ld('Subject');
        self.V.textarea.attr({placeholder:PAGE.ld('Message')});
        self.V.label_text.val = PAGE.ld('Message');
        self.V.submit.val = PAGE.ld('Submit');
        
        self.V.submit.onclick = f() {
            if ( VALIDATOR.notEmpty(self.V.subject) && VALIDATOR.notEmpty(self.V.subjectother) && VALIDATOR.notEmpty(self.V.textarea) ) {
                ORM.req('ticket:insert', {subject:self.V.subjectother.val,text:self.V.textarea.val},f() {
                    LM.go(PAGE.url);
                });
            }
        }
    }
});



new eHtml('ticketaddmsg','<textarea></textarea><div class="asBtn iconed"></div><div class="asBtn submit"></div>',{
    textarea:'textarea',
    div:'addfiles,submit'
});


new eView('ticketaddmsg', {
    create: f() { return HTML.ticketaddmsg(cr('div','ticketadditem')); },
    init: f(self, obj) {
        var ref = obj._ref;
        var refMap = ref.split('_');
        
        self.V.textarea.attr({placeholder:PAGE.ld('message')});
        
        SVG.text(self.V.addfiles);
        self.V.submit.val = PAGE.ld('Submit');
        
        self.V.submit.onclick = f() {
            if ( VALIDATOR.notEmpty(self.V.textarea) ) {
                ORM.req(ref+':reply', {text:self.V.textarea.val},f() {
                    var udata = ENGINE.getUrlData(LAYER.pop.url.url);
                    udata.query.v = new Date()*1;
                    LM.go(udata.getUrl());
                    //-window.location.href = LAYER.pop.url.url;
                });
            }
        }
        
        self.C.addfiles = cr('input').attr({type:'file',multiple:'true'});
        self.V.addfiles.onclick = f() {
            self.C.addfiles.click();
        }
        self.C.addfiles.onchange = f(ev) {
            var files = ev.target.files;
            
            map(files, f(file) {
                PROTOCOL.media.write(refMap[1]+':upload', {file:[file,file.name||file.fileName]}, function() {
                    SYS.notify(PAGE.ld('file uploaded'), 'ok');
                    LM.go(LAYER.pop.url.url.split('?')[0]+'?v='+new Date()*1);
                }, null, 'ticket');
            });
        }
        
        
        if ( LAYER.pop.url.query && LAYER.pop.url.query.ask == 'profileupload' && obj._fileitems.length == 0 ) {
            SYS.alert(PAGE.ld('Please, upload your passport scans.'), 'red center', f() { self.C.addfiles.click(); })
        }
    }
});




