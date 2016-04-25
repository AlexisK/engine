
new eTable('coffer', {
    fields: 'id,currency_id,created_at,amount',
    models: {
        currency_id:'currency.paysystem_id,currency',
        paysystem_id: 'paysystem'
    }
});


