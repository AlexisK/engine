
prepEditor2('user','insert,update,delete',{
    level:%levelModerator,
    cls: 'noLang',
    schema: {
        'email,phone':'text',
        'bonus_points,referer_points':'dec',
        'is_banned':'bool',
        'lvl':{
            _type:'dropdown',
            data: {
                0:   'Гость',
                10:  'Незарегистр.',
                20:  'Пользователь',
                100: 'Редактор',
                150: 'Поддержка',
                170: 'Модератор',
                200: 'Админ'
            }
        },
        verification_data: CO(CONF.project.editor2_userdata)
    },
    insert_schema: {
        'email':'text',
        'pwd':'password',
        'lvl':{
            _type:'dropdown',
            data: {
                0:   'Гость',
                10:  'Незарегистр.',
                20:  'Пользователь',
                100: 'Редактор',
                150: 'Поддержка',
                170: 'Модератор',
                200: 'Админ'
            }
        }
    },
    group: {
        g_basic: {
            title: 'basic',
            fields: 'email,phone,pwd,lvl,is_banned'
        },
        g_points: {
            title: 'points',
            fields: 'bonus_points,referer_points'
        },
        g_passport: {
            title: 'passport',
            fields: 'verification_data'
        }
    },
    order: 'g_basic,g_points,g_passport'
});
