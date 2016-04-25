
new eHtml('cofferView', '<div class="example-slide">\
    <p class="extra-bold-example-slide"></p>\
    <div class="example-slide-image-holder"><img class="mk_img" src="" alt=""></div>\
</div>', {
    p: 'title',
    '.mk_img': 'img',
    '.example-slide': 'cont'
});

new eHtml('coffer-currency', '<p class="extra-bold-example-slide"><span class="semi"></span> <span></span></p>', {
    span: 'amount,currency'
});



new eView('coffer-currency', {
    create: function() { return HTML['coffer-currency'](cr('p')); },
    init: function(block, objD) {
        
        function redraw(obj) {
            var sum = obj.display_total || 0;
            block.V.amount.val = PARSE.money(sum.toDec());//-PARSE.money(sum);
            block.V.currency.val = ORM.getVisName(obj);
            
        }
        redraw(objD);
        
        ORM.onStore(objD._oid, redraw);
    }
})


new eView('cofferView', {
    create: function(){ return HTML.cofferView(cr('div', 'col-example-slider')); },
    init: function(block, obj) {
        block.V.title.val = ORM.getVisName(obj);
        
        block.V.img.src = [ENGINE.path.static, 'image/ps/', obj.viewparams.imgHover].join('');
        block.V.img.alt = obj.displayname;
        
        map(obj._rel.currency, function(cur) {
            var node = VIEW['coffer-currency'](cur);
            block.V.cont.attach(node);
        });
    }
});










