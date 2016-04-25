
new eTable('media', {
    fields: 'mediatype_id',
    //-models: {
    //-    mediatype_id:'mediatype'
    //-},
    //-customFields: {
    //-    'thumb': function(obj) {
    //-        var img = cr('img').attr({
    //-            width:  40,
    //-            height: 40
    //-        });
    //-        
    //-        ORM.req('mediafile:select', function(fileList) {
    //-            var thumb = filterObjects(fileList, {tag:'thumb'})[0];
    //-            if ( def(thumb) ) {
    //-                ORM.onStore(thumb._oid, function() {
    //-                    var th = ORM.O(thumb._oid);
    //-                    img.src = [ENGINE.path.media,th.id,'.',th.ext].join('');
    //-                });
    //-                img.src = [ENGINE.path.media,thumb.id,'.',thumb.ext].join('');
    //-            }
    //-        }, {
    //-            selector: {media_id:['=',obj.id]}
    //-        });
    //-        
    //-        return [img];
    //-    }
    //-}
});



