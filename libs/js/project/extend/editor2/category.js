
prepEditor2('category','insert,update,delete',{
    inherit: '_page',
    level: %levelModerator,
    schema: {
        'order':'number',
        'params': {
            'css':'text',
            'yatitle': {
                _type:'dropdown',
                data: ['Политика', 'Экономика', 'Происшествия', 'Технологии', 'Спорт', 'Здоровье', 'Культура', 'За рубежом', 'Курьезы', 'Фоторепортаж', 'Видеорепортаж', 'Городские новости'],
                required: true
            }
        }
    },
    group: {
        g_settings: {
            fields:'order,params.css,params.yatitle'
        }
    }
});




























