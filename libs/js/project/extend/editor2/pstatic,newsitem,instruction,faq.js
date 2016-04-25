map(parseLS('pstatic,newsitem,instruction,faq'), f(model) {
    prepEditor2(model,'insert,update,delete',{
        level:%levelManager,
        inherit: '_page',
        schema: {
            'is_important':'bool'
        },
        group: {
            g_settings: {
                fields:'is_important'
            }
        },
        defaultObject: {
            displaydate: new Date()*1
        }
    });
});

