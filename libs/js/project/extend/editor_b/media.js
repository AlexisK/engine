
ENGINE.prepEditor('media', {
    fields:  'name',
    dropdown: {
        mediatype:'mediatype_id'
    },
    media: {
        id: {
            proto: 'image',
            type:  'ogimage',
            file: {
                thumb: '40x40x2',
                og:    '225x225x2',
            }
        }
    }
});















