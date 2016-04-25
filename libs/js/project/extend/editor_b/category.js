
{
    
    var yatitles = {};
    map(['Политика', 'Экономика', 'Происшествия', 'Технологии', 'Спорт', 'Здоровье', 'Культура', 'За рубежом', 'Курьезы', 'Фоторепортаж', 'Видеорепортаж', 'Городские новости'], function(str) {
        yatitles[str] = str;
    });
    
    ENGINE.prepEditor('category', {
        lvl: %levelModerator,
        fields:    'order',
        ldfields:  'urlpart,title,keywords,tags,description,content',
        cdropdown: {
            'params.yatitle'       : yatitles
        },
        media: {
            media_id: {
                proto: 'image',
                type:  'ogimage',
                file: {
                    thumb:      '40x40x2',
                    yalogo:     '100x100x1',
                    yalogorect: '180x180x2',
                    widget:     '255x190x2',
                    preview:    '582x364x2'
                }
            }
        },
        schema: {
            params: {
                sm: {
                    freq: 'text',
                    prio: 'text'
                },
                css:'text'
            }
        },
    insert_custom: TEDITOR.urlpart_tags,
    update_custom: TEDITOR.tags,
        //-'oncreate,onupdate': function(t, t, onfinish) { onfinish(); window.location.reload(); }
    });
    

}











