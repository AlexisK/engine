
new eProcessor('dropdownShadowed', {
    process: function(dom, db) {
        _jO(dom);
        
        if ( def(dom.D.target) ) {
            dom.C.targets = [];
            dom.C.markers = S('.mk_mark', dom);
            dom.D.cls = dom.D.cls||'closed';

            dom.V.shadowblock = S('.'+dom.D.shadowblock)[0];
            evt(dom, 'mouseover', function() {
                dom.V.shadowblock.addCls('hovered');
            });
            evt(dom, 'mouseout', function() {
                dom.V.shadowblock.remCls('hovered');
            });

            map(dom.D.target.split(/\s*\,\s*/g), function(selector) {
                dom.C.targets.push(S('#target_'+selector));
            });
            
            dom.C.closed = dom.C.targets[0].className.contains(dom.D.cls);
            dom.toclose = false;
            dom.C.int = null;
            
            dom.F.open  = function() {
                db.openContent(dom);
                tm(f() {
                    EVENT.click.add(dom.F.close);
                    EVENT.touchstart.add(dom.F.close);
                });
                dom.V.shadowblock.style = "display:none";
            }
            dom.F._close = function() {
                db.closeContent(dom);
                EVENT.click.remove(dom.F.close);
                EVENT.touchstart.remove(dom.F.close);
                dom.V.shadowblock.style = "display:block";
            }
            dom.F.close = function() {
                //-alert('dd f.close');
                dom.C.int = tm(dom.F._close, 2);
            }
            
            
            if ( dom.D.closeonclick != 'true' ) {
                map(dom.C.targets, function(target) {
                    
                    target.doclick = f() {
                        tm(f() {
                            clearInterval(dom.C.int);
                        });
                    };
                    
                    evt(target, 'click', target.doclick);
                    evt(target, 'touchstart', target.doclick);
                });
            }
            
            dom.doclick = function() {
                //-alert('click dd dom');
                if ( dom.C.closed ) {
                    dom.F.open();
                } else {
                    dom.F._close();
                }
            };
            dom.onclick = dom.doclick;
            //-dom.ontouchstart = dom.doclick;
        }
    },
    openContent: function(btn) {
        
        if ( def(btn.D.selfactive) ) {
            btn.addCls(btn.D.selfactive);
        }
        if ( def(btn.D.selfunactive) ) {
            btn.remCls(btn.D.selfunactive);
        }
        
        
        map(btn.C.markers, function(marker) {
            if ( def(btn.D.markactive) ) {
                marker.addCls(btn.D.markactive);
            }
            if ( def(btn.D.markunactive) ) {
                marker.remCls(btn.D.markunactive);
            }
        });
        
        if ( btn.D.keepOpen ) {
            map(btn.C.targets, function(target) {
                target.remCls(btn.D.cls);
                target.doclick = function() {
                    //-alert('click dd target');
                    tm(function() { btn.toclose = false; });
                }
                target.onclick = target.doclick;
                //-target.ontouchstart = target.doclick;
            })
        } else {
            map(btn.C.targets, function(target) {
                target.remCls(btn.D.cls);
            })
        }
        
        
        btn.C.closed = false;
    },
    closeContent: function(btn) {
        
        if ( def(btn.D.selfactive) ) {
            btn.remCls(btn.D.selfactive);
        }
        if ( def(btn.D.selfunactive) ) {
            btn.addCls(btn.D.selfunactive);
        }
        
        map(btn.C.markers, function(marker) {
            if ( def(btn.D.markactive) ) {
                marker.remCls(btn.D.markactive);
            }
            if ( def(btn.D.markunactive) ) {
                marker.addCls(btn.D.markunactive);
            }
        });
        
        map(btn.C.targets, function(target) { target.addCls(btn.D.cls); })
        
        btn.C.closed = true;
    }
});

