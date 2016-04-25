
new eTable2('adminlog', {
    level:%levelSupport,
    fields: parseLS('id,ctime,owner_id,details,logmsg_id'),
    fieldFunc: {
        'ctime'               : TVIEW.time,
        'logmsg_id'           : TVIEW.rel,
        'details'             : f(obj, key) {
            var node = cr('div');
            
            //-mapO(obj.payload, f(v,k) {
            //-    var kmap = k.split('_');
            //-    kmap.splice(0, kmap.length-2 );
            //-    
            //-    if ( kmap[1] == 'id' ) {
            //-        ORM.prep(kmap[0]+'_'+v, f(obj) {
            //-            node.cr('span').VAL(ORM.getVisName(obj));
            //-        });
            //-    }
            //-});
            
            if ( obj.payload.message ) {
                node.cr('span').VAL(obj.payload.message);
            }
            
            return node;
        }
    },
    filter: {
        'id,owner_id'         : TINP.number,
        'ctime'               : TINP.rangeTime,
        'logmsg_id'           : f(self, f) { return TINP.modelDropdown(self,f,'logmsg'); }
    },
    sorter: parseLS('id,ctime'),
    rowGen: function(obj) {
        var node = cr('tr');
        var info = new ST(node);
        
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
