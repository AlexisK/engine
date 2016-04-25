
{
    
    new eTable('currency', {
        fields: 'id,paysystem_id,displayname',
        models: {
            paysystem_id: 'paysystem'
        },
        customFields: {
            'Вкл.': function(obj) {
                var is_a = cr.bool().VAL(obj.is_active);
                is_a.onupdate(function(val) { ORM.req(obj._oid+':update',{is_active:val}); });
                return [is_a];
            }
        }
    });
}













