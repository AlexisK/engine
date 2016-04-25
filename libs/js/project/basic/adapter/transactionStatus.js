
new eAdapter('tstatus', {
    process: function(self, dom) {
        dom.val = CONF.project.tstatus[dom.val]||CONF.project.tstatus.def;
    },
    selector: '.ad_tstatus'
});









