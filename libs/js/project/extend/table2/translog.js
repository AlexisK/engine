

function translogIOFill(node, objD) {
    mapO(objD, f(obj, key) {
        var newLine = node.cr('tr');
        var keyNode = newLine.cr('td').VAL(key);
        
        if ( T(obj) == T.S || T(obj) == T.N ) {
            newLine.cr('td').VAL(obj);
        } else {
            var valNode = newLine.cr('td').cr('table','translog');
            translogIOFill(valNode, obj);
        }
        
    });
}

new eTable2('translog', {
    level:%levelSupport,
    strs: {
        tstatus         : 'Статус',
        ctime           : 'Созд.'
    },
    fields: parseLS('id,ctime,transaction_id,logmsg_id,tstatus'),
    fieldFunc: {
        'ctime'               : TVIEW.time,
        'logmsg_id'           : TVIEW.rel,
        'tstatus'             : function(obj, key) { return TVIEW.mapper(CONF.project.tstatus, obj, key); }
    },
    cls: 'exch-table',
    filter: {
        'id'                  : TINP.number,
        'ctime'               : TINP.rangeTime,
        'payload'             : TINP.like,
        'logmsg_id'         : f(self, f) { return TINP.modelDropdown(self,f,'logmsg'); },
        'tstatus'             : f(self, f) { return TINP.dropdown(self,f,CONF.project.tstatus); }
    },
    sorter: parseLS('id,ctime,tstatus'),
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
        
        if ( obj.tstatus == 50 ) {
            info.add('error', 'cancelled');
            node.addCls('red');
        } else if ( obj.tstatus == 150 ) {
            node.addCls('warning');
        } else if ( obj.tstatus >= 200 ) {
            node.addCls('green');
        }
        
        
        
        var infoObj = cr('table', 'translog');
        translogIOFill(infoObj, obj.payload);
        var infoBtn = cr('div','asBtn').VAL(PAGE.ld('details'));
        infoBtn.onclick = f() {
            POP.drag.showNew(infoObj);
        }
        
        info.add('link', infoBtn);
        
        return node;
    },
    lineHeight: 17
});



