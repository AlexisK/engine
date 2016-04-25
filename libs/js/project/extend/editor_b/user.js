

ENGINE.prepEditor('user', {
    lvl: %levelModerator,
    fields:    'email,phone,bonus_points,referer_points,is_banned',
    insert_fields: 'email,pwd',
    cdropdown: {
        lvl: {
            0:   'Гость',
            10:  'Незарегистр.',
            20:  'Пользователь',
            100: 'Редактор',
            150: 'Поддержка',
            170: 'Модератор',
            200: 'Админ'
        }
    },
    schema: {
        verification_data: {
            'country,city,passSer,passNum,first_name,last_name,third_name':'text',
            'birthdate':'date'
        }
    }
});













