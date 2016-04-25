
new eHtml('exchange-menu2', '<div class="currency-select t1"><input type="text" placeholder="filter" /><div class="cont"></div></div>\
<div class="currency-select t2"><input type="text" placeholder="filter" /><div class="cont"></div></div>\
<div class="currency-editarea">\
    <h2></h2>\
    <div class="rate"><input type="text" placeholder="amount" class="ad_money" /><span>:</span><input type="text" placeholder="amount" class="ad_money" /></div>\
    <div class="cont"><div class="col"></div><div class="col"></div><hr class="breaker" /></div>\
    <div class="rate"><input type="text" placeholder="amount" class="ad_money" /><span>:</span><input type="text" placeholder="amount" class="ad_money" /></div>\
    <div class="asBtn">Save</div>\
</div>', {
    h2:'title',
    input:'filter_in,filter_out,rate_in,rate_out,final_in,final_out',
    '.cont':'cont_in,cont_out,cont',
    '.asBtn':'submit',
    '.col':'col_in,col_out'
});



new eHtml('exchange-menu', '<h2></h2>\
<div class="rate">\
    <div class="aman"></div>\
    <input type="text" placeholder="amount" class="ad_money" />\
    <span>:</span>\
    <input type="text" placeholder="amount" class="ad_money" />\
    <div class="aman"></div>\
</div>\
<h4>Commision</h4>\
<div class="cont"><div class="col"></div><div class="col"></div><hr class="breaker" /></div>\
<h4>Preview</h4>\
<div class="rate"><input type="text" placeholder="amount" class="ad_money" /><span>:</span><input type="text" placeholder="amount" class="ad_money" /></div>\
<div class="asBtn">Save</div>', {
    h2:'title',
    '.aman':'editButton_in,editButton_out',
    input:'rate_in,rate_out,final_in,final_out',
    '.asBtn':'submit',
    '.col':'col_in,col_out'
});



new eHtml('commision-edit-item', '<h4><h4><div class="line"><div class="key ad_lang">k_amount</div><input type="text" class="val ad_money"><span>$</span></div>\
<div class="line"><div class="key ad_lang">k_percent</div><input type="text" class="val ad_money"><span>%</span></div>\
<div class="line"><div class="key ad_lang">k_min</div><input type="text" class="val ad_money"><span>$</span></div>\
<div class="line"><div class="key ad_lang">k_max</div><input type="text" class="val ad_money"><span>$</span></div>', {
    h4:'title',
    input:'amount,percent,min,max'
});

new eView('commision-edit-item', {
    create: function() {
        return HTML['commision-edit-item'](cr('div','commision'));
    },
    init: function(){}
})



new eHtml('commision-view-item', '<div class="line"><h4 class="key">commision</h4><div>\
<span class="val"></span>$ + <span class="val"></span>% (<span class="val"></span> - <span class="val"></span>$)\
</div></div>', {
    h4:'title',
    '.val':'amount,percent,min,max'
});

new eView('commision-view-item', {
    create: function() {
        return HTML['commision-view-item'](cr('div','commision view'));
    },
    init: function(){}
})


new eView('exchange-menu',{
    create: function(self) {
        
        self.V.filter_in = self.V.filter1;
        self.V.filter_out = self.V.filter2;
        self.V.cont_in = self.V.side1;
        self.V.cont_out = self.V.side2;
        
        HTML['exchange-menu'](self.V.cont);
        self.V.cont.addCls('currency-editarea');
        self.V = mergeObjects(self.V, self.V.cont.V);
        
        return self;
        
    },
    init: function(block, obj) {
        
        block.F._redrawCurrency = function(node, list, todo) {
            node.innerHTML = '';
            
            mapO(ORM.model.paysystem, function(ps) {
                var psNode      = _jO(node.cr('div', 'ps-item'));
                psNode.V.title  = psNode.cr('div', 'title').VAL(ps.langdata.en);
                psNode.V.cont   = psNode.cr('div', 'cont');
                
                map( filterObjects(objToArray(ORM.model.currency), {
                    paysystem_id:ps.id
                }), function(currency) {
                    var curNode = psNode.V.cont.cr('div', 'cur-item').VAL(currency.displayname);
                    list.push(curNode);
                    
                    curNode.onclick = function() {
                        todo(currency);
                        switchActive(list, curNode);
                    }
                } );
            });
            
            block.C.doFilter();
        }
        
        block.F.redrawInCurrency = function(todo) {
            block.F._redrawCurrency(block.V.cont_in, block.B.list1, todo);
        }
        
        block.F.redrawOutCurrency = function(todo) {
            block.F._redrawCurrency(block.V.cont_out, block.B.list2, todo);
        }
        
        
        block.F.createCommision = function(obj, title, tpl, mod) {
            tpl = tpl||'commision-edit-item';
            mod = mod||1;
            title = title||'';
            var newBlock = VIEW[tpl]();
            newBlock.V.title.val    = PAGE.ld('h_'+title, title);
            newBlock.V.amount.val   = (obj.amount||0)/mod;
            newBlock.V.percent.val  = (obj.percent||0)/mod;
            newBlock.V.min.val      = (obj.min||0)/mod;
            newBlock.V.max.val      = (obj.max||0)/mod;
            
            return newBlock;
        }
        
        
        block.F.addInCommision = function(obj, title, tpl, mod) {
            var newBlock = block.F.createCommision(obj, title, tpl, mod);
            block.V.col_in.attach(newBlock);
            return newBlock;
        }
        
        block.F.addOutCommision = function(obj, title, tpl, mod) {
            var newBlock = block.F.createCommision(obj, title, tpl, mod);
            block.V.col_out.attach(newBlock);
            return newBlock;
        }
        
        block.F.clearCommisions = function() {
            block.V.col_in.innerHTML = '';
            block.V.col_out.innerHTML = '';
        }
        
        
    }
}, 'menu3col');














