

new eTable2('paysystem', {
    level:%levelSupport,
    fields: parseLS('id,name,img,is_active'),
    fieldFunc: {
        'img' : function(obj, key) { return cr('img').attr({
                width:  '43',
                height: '31',
                src: [ENGINE.path.static, 'image/ps/', obj.viewparams.imgHover||''].join('')
            }); },
        'is_active'    : TVIEW.bool
    },
    colCls: {
        'is_active' : 'chb'
    },
    filter: {
        'id'        : TINP.number,
        'is_active' : TINP.bool,
        'name'      : TINP.like
    },
    sorter: parseLS('id,is_active'),
    rowGen: function(obj) {
        var node = cr('tr', 'green');
        var info = new ST(node);
        info.title = ORM.getVisName(obj);
        
        if ( !obj.is_active ) { info.add('error', 'inactive'); node.addCls('red'); }
        
        if ( !obj.viewparams.img || !obj.viewparams.imgHover ) {
            info.add('error', 'no image');
            node.addCls('error');
        }
        var curs = RNG(ORM.model.currency).filter({
            paysystem_id:obj.id,
            is_active: true
        });
        
        info.add('link', TSTMenu.table('currency', { paysystem_id: ['=',obj.id] }));
        
        if ( curs.length == 0 ) {
            info.add('warning', 'no active currency found');
            node.addCls('warning');
        }
        
        return node;
    },
    lineHeight: 38
});



