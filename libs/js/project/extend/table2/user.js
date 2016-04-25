

var filterUserBonusFunc = f(obj, key, pre) {
    var nd = TINP.modelDropdown(obj, key, pre);
    var resultMap = [];
    mapO(ORM.model[pre], f(bonus) {
        resultMap.push(bonus.points);
    });
    resultMap.sort(f(a,b){return a-b;});
    
    
    nd.onupdate(function(val) {
        if ( val && val != 'None' ) {
            var points = ORM.O(pre+'_'+val).points;
            var ind = resultMap.indexOf(points)+1;
            
            obj.selectBy[key] = ['>=', points];
            if ( ind < resultMap.length) {
                obj.selectBy[key].splice(2,0,'<',resultMap[ind]);
            }
        } else {
            delete obj.selectBy[key];
        }
        obj.rebuild();
    });
    
    nd.setVal = function(val) { nd.val = RNG(ORM.model[pre]).filter({points:val[1]})[0].id; };
    return nd;
}

new eTable2('user', {
    level:%levelSupport,
    strs: {
        rtime: 'Registration'
    },
    fields: parseLS('id,email,phone,lang_id,lvl,rtime,mtime,bonus_points,referer_points,is_banned'),
    fieldFunc: {
        'rtime,mtime' : TVIEW.time,
        'lang_id'     : TVIEW.rel,
        'lvl'         : function(obj, key) { return TVIEW.mapper(g_lvl, obj, key); },
        'is_banned'   : TVIEW.bool,
        'bonus_points,referer_points' : TVIEW.dec
    },
    filter: {
        'id'             : TINP.number,
        'lvl'            : function(obj, key) { return TINP.dropdown(obj, key, g_lvl); },
        'email,phone'    : TINP.like,
        'lang_id'        : f(self, f) { return TINP.modelDropdown(self,f,'lang'); },
        'rtime,mtime'    : TINP.rangeTime,
        'bonus_points'   : f(obj, key) { return filterUserBonusFunc(obj, key, 'bonus'); },
        'referer_points' : f(obj, key) { return filterUserBonusFunc(obj, key, 'partner'); },
        'is_banned'      : TINP.bool
    },
    sorter: parseLS('lvl,mtime'),
    rowGen: function(obj) {
        var block = cr('tr');
        var info = new ST(block);
        
        if ( obj.is_banned ) {
            info.add('error', 'banned');
            block.addCls('red');
            return block;
        }
        
        
        var chargeBtn = cr('div','asBtn').VAL(PAGE.ld('charge anycash'));
        info.add('link', chargeBtn);
        
        chargeBtn.onclick = f() {
            var viewBlock = VIEW.charge_ac_email(obj.email);
            POP.modal.show(viewBlock);
        }
        
        
        if ( obj.id == PAGE.user.id ) {
            block.addCls('green');
            
            var delAvaBtn = cr('div','asBtn').VAL(PAGE.ld('Delete avatar'));
            delAvaBtn.onclick = function() {
                ORM.req('user_'+PAGE.user.id+':update',{media_id:null});
            }
            info.add('link', delAvaBtn);
            
            return block;
        }
        
        if ( obj.lvl == %levelSupport ) {
            block.addCls('blue');
        } else if ( obj.lvl > PAGE.level ) {
            block.addCls('warning');
        }
        
        var writeBtn = cr('div','asBtn').VAL(PAGE.ld('Write message to this user'));
        info.add('link', writeBtn);
        
        writeBtn.onclick = f() {
            if ( !this._form ) {
                this.form = VIEW.write_user_form({id:['=',obj.id]});
            }
            this.form.ondone = POP.window.hide;
            POP.window.show(this.form);
        }
        
        
        return block;
    },
    prep: 'bonus,partner'
});



