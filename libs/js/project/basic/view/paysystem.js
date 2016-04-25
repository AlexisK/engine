
new eHtml('ps-table-item', '<div class="sys-image">\
    <img src="" class="bw" alt="">\
    <img src="" class="color" alt="">\
</div><p class="system-name"></p>',{
        img:'img,imgHover',
        p:'title'
    });

new eView('ps-table-item', {
    create: function() { return HTML['ps-table-item'](cr('td')); },
    init: function(block, obj) {
        block.V.img.src = [ENGINE.path.static,'image/ps/',obj.viewparams.img].join('');
        block.V.imgHover.src = [ENGINE.path.static,'image/ps/',obj.viewparams.imgHover].join('');
        block.V.img.alt = obj.displayname;
        block.V.imgHover.alt = obj.displayname;
        block.V.title.val = ORM.getVisName(obj);
    }
});








