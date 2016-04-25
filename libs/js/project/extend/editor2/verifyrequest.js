
prepEditor2('verifyrequest','view,accept,decline',{
    level:%levelSupport,
    schema: {
        data: CO(CONF.project.editor2_userdata),
        msg: 'text',
        'owner_id,responsible_id':'div',
        'is_accepted':'bool'
    },
    group: {
        g_pdata: {
            title: 'Passport data',
            fields: 'data'
        }
    },
    order: 'g_pdata',
    onshow: f(dom, obj, self) {
        var block_photo = dom.cr('div');
        dom.cr('br');
        var block_controlls = dom.cr('div', 'j-form-controlls');
        
        var statusLine = VIEW.form_line();
        block_controlls.attach(statusLine);
        statusLine.V.key.val = PAGE.ld('current status')+':';
        
        var ind = clearEvents(cr.bool3('readonly'));
        ind.val = obj.is_accepted;
        statusLine.V.val.attach(ind);
        
        var inp = VIEW.input_text();
        block_controlls.attach(inp);
        inp.label = PAGE.ld('msg');
        inp.val = obj.msg;
        
        block_controlls.cr('br');
        var btnAccept = block_controlls.cr('div','asBtn accept').VAL(PAGE.ld('Accept'));
        var btnDecline = block_controlls.cr('div','asBtn decline').VAL(PAGE.ld('Decline'));
        
        btnAccept.onclick = f() {
            ORM.req(obj._oid+':accept', {
                msg: inp.val
            }, self.hide);
        }
        
        btnDecline.onclick = f() {
            ORM.req(obj._oid+':decline', {
                msg: inp.val
            }, self.hide);
        }
        
        getRawData(['/_view/',PAGE.lang,'/verifyrequest/',obj.name,'/'].join(''), f(html) {
            var t = cr('div');
            t.innerHTML = html;
            var target = S('.mk_images_table', t)[0];
            if ( target ) {
                block_photo.innerHTML = target.outerHTML;
                tm(f(){ ENGINE.processDom(dom); });
            }
            
        });
    }
});
