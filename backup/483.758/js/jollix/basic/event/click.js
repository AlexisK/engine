{
    new eEvent('click', {
        ontrigger: function(ev) {
            if ( def(ev.button) ) {
                EVENT.data.button = ev.button;
            } else {
                EVENT.data.button = 0;
            }
        }
    });
}
