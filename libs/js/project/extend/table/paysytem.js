
new eTable('paysystem', {
    fields: 'id,name',
    customFields: {
        'title,Вкл.': function(obj) {
            var is_a = cr.bool().VAL(obj.is_active);
            is_a.onupdate(function(val) { ORM.req(obj._oid+':update',{is_active:val}); });
            return [ORM.lang(obj),is_a];
        }
    }
});














