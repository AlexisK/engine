prepEditor2('localization','insert,update,delete',{
    level: %levelManager,
    delete_level: %levelAdmin,
    insert_cls:'noLang',
    schema: {
        'key':'text'
    },
    lschema: {
        'value':'text',
    },
    order: 'key, value',
    defaultObject: {
        lang_id: PAGE.langObj.id
    },
    data_proxy: f(obj, bdata, ldata) {
        mapO(ldata, f(dict, lang_id) {
            if ( okeys(dict).length > 0 ) {
                dict.key = dict.key || bdata.key || obj.key;
                dict.lang_id = dict.lang_id || ORM.O('lang_'+lang_id).id;
            }
        });
        bdata = {};
    },
    insert_data_proxy: f(obj, bdata, ldata) {
        mapO(ldata, f(dict, lang_id) {
            mapO(dict, f(v,k) {
                bdata[k] = v;
            });
            delete ldata[lang_id];
        });
        bdata.lang_id = PAGE.langObj.id;
    },
    cast_method: {
        update:'upsert'
    },
    form_lang_selector: f(self, lang) {
        return {
            key: ['=',self.obj.key],
            lang_id: ['=',lang.id]
        }
    }
});




















