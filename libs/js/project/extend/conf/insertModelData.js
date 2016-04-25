CONF.project.insertDefData = lsMapToDict({
    
    'exchange':  { is_active: true, is_auto: false, is_autorepel: false },
    'paysystem': { params: {} },
    
    'user' : { lvl: 20 },
    'article,pstatic,newsitem,instruction,faq,info,category' : {
        displaydate: new Date()*1,
        tags: [],
        is_published: true,
        params: {
            show_picture: true
        }
    },
    'redirect' : { is_permanent : true }
});
