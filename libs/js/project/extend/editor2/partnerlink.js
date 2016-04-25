
prepEditor2('partnerlink','insert,update,delete',{
    level:%levelModerator,
    cls: 'noLang',
    schema: {
        'title,url':'text',
        'order':'number',
        'media_id': {
            _type:'image',
            noclick: true,
            nosizecheck: true,
            file: {
                display: '1000x40x1'
            }
        }
    }
});
