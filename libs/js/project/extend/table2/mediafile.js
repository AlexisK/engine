

new eTable2('mediafile', {
    level:%levelSuper,
    fields: parseLS('id,media_id,img,filename,tag,size'),
    fieldFunc: {
        'img' : function(obj, key) { return cr('img').attr({
                width:  '40',
                height: '40',
                src: getMediaFileUrl('thumb',obj.media_id,obj.ext)
            }); },
        'size'   : function(obj, key) { return ADAPTER.fileSize.process(cr('span').VAL(obj[key])); }
    },
    filter: {
        'id,media_id'   : TINP.number,
        'filename,tag'  : TINP.like
    },
    sorter: parseLS('id,media_id,tag,size'),
    lineHeight: 48
});



