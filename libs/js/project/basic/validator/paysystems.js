

UPARAMS.store('email', {
    ph: 'user@server.domain',
    title: 'Email',
    validator: VALIDATOR.email
});



new eValidator('ps_perfect', /^[uegb]\d{7,8}$/i);
UPARAMS.store('perfect', {
    ph: 'U1234567',
    title: 'Account',
    validator: VALIDATOR.ps_perfect
});


new eValidator('ps_payeer',  /^P\d{5,}$/i);
UPARAMS.store('payeer', {
    ph: 'P123456',
    title: 'Account',
    validator: VALIDATOR.ps_payeer
});


new eValidator('ps_yandex',  /^41001\d{7,12}$/i);
UPARAMS.store('yandex', {
    ph: '41001012345678901',
    title: 'Account',
    validator: VALIDATOR.ps_yandex
});





