
new eHtml('cur-table-item', '<div><img src="" alt="" /></div><p></p>',{
        img:'img',
        p:'title'
    });

new eView('cur-table-item', {
    create: function() { return HTML['cur-table-item'](cr('td')); },
    init: function(block, obj) {
        block.V.img.src = [ENGINE.path.static,'image/cur/',obj.displayname.toLowerCase(), '.png'].join('');
        block.V.img.alt = obj.displayname;
        block.V.title.val = ORM.lang(obj)||obj.displayname;
    }
});









