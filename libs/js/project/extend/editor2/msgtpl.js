
prepEditor2('msgtpl','insert,update,delete',{
    level:%levelModerator,
    langPrefix: 'langdata',
    schema: {
        'reference':'div'
    },
    lschema: {
        'subj':'text',
        'src':'textarea'
    },
    order: 'reference,subj,src'
});
