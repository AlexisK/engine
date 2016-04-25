new eProcessor('ucheck', {
    process: function(self, db) {
        _jO(self);
        if ( PAGE.level < %levelSupport || !self.D.uid ) { return 0; }
        var ref = 'user_'+self.D.uid;
        
        ORM.prep(ref, f(user) {
            if ( user.lvl == %levelNotConfirmed ) {
                var iBlock = cr('div','userValidationBlock');
                iBlock.cr('div').VAL(PAGE.ld('User avaits passport data confirmation.'));
                var confBtn = iBlock.cr('div','asBtn').VAL(PAGE.ld('Confirm'));
                
                self.attach(iBlock);
                
                confBtn.onclick = f() {
                    SYS.confirm(PAGE.ld('Confirm user verification')+' '+user.email, 'center warning', f() {
                        ORM.req(ref+':setlevel', {lvl:%levelConfirmed}, f() {
                            LM.go(LAYER.pop.url.url.split('?')[0]+'?v='+new Date()*1);
                        });
                    })
                    
                }
            }
        });
    }
})


