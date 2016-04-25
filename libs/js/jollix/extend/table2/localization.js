

new eTable2('localization', {
    level: %levelManager,
    fields: parseLS('id,key,value'),//-,lang_id
    fieldFunc: {
        'lang_id' : TVIEW.rel
    },
    filter: {
        'id'        : TINP.number,
        //-'lang_id'   : f(self, f) { return TINP.modelDropdown(self,f,'lang'); },
        'key,value' : TINP.like
    },
    sorter: parseLS('id'),
    rowGen: function(obj) {
        var node = cr('tr','green');
        var info = new ST(node);
        
        return node;
    },
    lineHeight: 17
});



