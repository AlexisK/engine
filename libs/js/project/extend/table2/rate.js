

new eTable2('rate', {
    level:%levelModerator,
    fields: parseLS('id,ctime,in_accurrency_id,out_accurrency_id,ratesource_id,value,is_accepted'),
    fieldFunc: {
        'ctime'          : TVIEW.time,
        'in_accurrency_id,out_accurrency_id,ratesource_id' : TVIEW.rel,
        'value'          : TVIEW.dec,
        'is_accepted'    : TVIEW.boolReadonly
    },
    colCls: {
        'is_accepted' : 'chb'
    },
    filter: {
        'id'        : TINP.number,
        'ctime'     : TINP.rangeTime,
        'is_accepted' : TINP.bool,
        'value'       : TINP.rangeDec,
        'in_accurrency_id,out_accurrency_id' : f(self, f) { return TINP.modelDropdown(self,f,'accurrency'); },
        'ratesource_id' : f(self, f) { return TINP.modelDropdown(self,f,'ratesource'); },
    },
    sorter: parseLS('id'),
    rowGen: function(obj) {
        var node = cr('tr', 'green');
        var info = new ST(node);
        var delim = optDelim(obj.value.toDec());
        
        if ( !obj.is_accepted ) {
            var btn = cr('div','asBtn').VAL('accept');
            info.add('link', btn);
            
            btn.onclick = f() {
                
                var ed = new eEditor2('rate', 'accept', {
                    cls: 'small noLang',
                    schema: {
                        'info,default': 'div',
                        value: 'dec'
                    }
                }, true);
                
                ed.show({
                    info: [
                        PAGE.ld('Accept'),
                        PAGE.ld('rate'),
                        ORM.getVisName(obj._rel.in_accurrency),
                        ORM.getVisName(obj._rel.out_accurrency)
                    ].join(' '),
                    default: [obj.value.toDec(),' (',delim.join(':'),')'].join(''),
                    value:   obj.value
                });
                
                ed.submit = f(t, basedata, t, done) {
                    ORM.req(obj._oid+':accept', {
                        value: basedata.value
                    }, f(t,resp) {
                        if (resp.exception) {
                            SYS.fail();
                        } else {
                            SYS.success();
                        }
                        done();
                    });
                }
                
            }
        }
        
        return node;
    },
    lineHeight: 18,
    prep: 'accurrency'
});



