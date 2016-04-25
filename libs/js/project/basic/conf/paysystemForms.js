
CONF.project.paysystemForms = {
    def: { send: log },
    privat24: {
        prep: function(prep) {
            if ( !def(prep) || prep.closed ) {
                return postPageForm('https://api.privatbank.ua/p24api/ishop');
            }
            return prep;
        },
        send: function(transaction, func, prep) {
            
            var unloadInt = null;
            var unloadf =  function() {
                log(prep.window.closed);
                
                if ( !def(prep.window) || prep.window.closed ) {
                    clearInterval(unloadInt);
                    ORM.req(transaction._oname+':select', function(resp) {
                        func(resp[0]);
                    });
                }
            }
            
            unloadInt = setInterval(unloadf, 500);
            
            prep.form.insertFields(transaction.bill);
            prep.form.submit();
        }
    }
}







