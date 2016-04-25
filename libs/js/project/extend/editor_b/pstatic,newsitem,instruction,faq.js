

ENGINE.prepEditor('pstatic,newsitem,instruction,faq', {
    lvl: %levelManager,
    title:     function(obj) { return obj.title; },
    fields:    'is_published,is_important',
    ldfields:  'displaydate,urlpart,title,keywords,tags,description,content',
    media: {
        media_id: {
            proto: 'image',
            type:  'ogimage',
            file: {
                thumb:   '40x40x2',
                video:   '150x91x2',
                widget:  '255x190x2',
                preview: '582x364x2'
            }
        }
    },
    schema: {
        params: {
            sm: {
                freq: 'text',
                prio: 'text'
            },
            show_picture: 'bool'
        }
    },
    insert_custom: TEDITOR.urlpart_tags,
    update_custom: TEDITOR.tags,
    //-'oncreate,onupdate': function(t, t, onfinish) { onfinish(); window.location.reload(); }
});













