
new eTable('user', {
    fields: 'email',
    customFields: {
        'lvl':function(obj) {
            return [g_lvl[obj.lvl]];
        }
    }
});



