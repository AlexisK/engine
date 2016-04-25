
//-CONF.project.tstatus = lsMapToDict({
//-    '0'     : 'новая транзакция',//-                created
//-    '50'    : 'выставлен счет',//-                  in_billed
//-    '60'    : 'счет отменен',//-                    in_cancelled
//-    '70'    : 'счет не оплачен',//-                 in_failed
//-    '90'    : 'счет оплачен',//-                    in_payed
//-    '100'   : 'ожидаем подтверждения',//-           out_review
//-    '110'   : 'выплата отменена',//-                out_cancelled
//-    '120'   : 'возврат денег',//-                   out_refund
//-    '150'   : 'счет на выплату',//-                 out_billed
//-    '160'   : 'не хватает средств',//-              out_insuff
//-    '170'   : 'оплата провалилась',//-              out_failed
//-    '190'   : 'оплата произведена',//-              out_payed
//-    '250'   : 'транзакция проведена успешно',//-    ok
//-    '200'   : 'счет оплачен'
//-});

CONF.project.tstrstatus = lsMapToDict({
    'expired'   : 'истекла',
    'cancelled' : 'отменена'
});



CONF.project.ts_tech = {
    0   : 'unknown',
    1   : 'new',
    10  : 'new_cancel',
    20  : 'in_bill',
    30  : 'in_bill_gw_cancel',
    40  : 'in_bill_ps_fail',
    50  : 'in_bill_ps_wait',
    60  : 'in_bill_u_cancel',
    70  : 'in_fail',
    79  : 'in_revokable',
    80  : 'in_bill_gw_confirm',
    90  : 'in_bill_ps_confirm',
    100 : 'in_payed',
    110 : 'out_manual',
    120 : 'out_admin_cancel',
    130 : 'out_refund',
    140 : 'out_rollback',
    150 : 'out_account_invalid',
    160 : 'out_bill_ps_fail',
    165 : 'out_bill_ps_insuff',
    179 : 'out_revokable',
    180 : 'out_bill_ps_wait',
    200 : 'out_bill_ps_payed',
    205 : 'interest',
    230 : 'out_payed'
}


CONF.project.ts_user = {
    0   : 'unknown',
    1   : 'new',
    50  : 'cancel',
    60  : 'refund',
    150 : 'review',
    200 : 'payed',
    250 : 'ok'
}

var TSTATUS1 = reverseDict(CONF.project.ts_tech);
var TSTATUS2 = reverseDict(CONF.project.ts_user);


CONF.project.ts_map = {}
#def t CONF.project.ts_map[TSTATUS1
#def u TSTATUS2
%t.new]                 = %u.new,
%t.new_cancel]          = %u.cancel,
%t.in_bill]             = %u.new,
%t.in_bill_gw_cancel]   = %u.cancel,
%t.in_bill_ps_fail]     = %u.cancel,
%t.in_bill_ps_wait]     = %u.new,
%t.in_bill_u_cancel]    = %u.cancel,
%t.in_fail]             = %u.cancel,
%t.in_bill_gw_confirm]  = %u.new,
%t.in_bill_ps_confirm]  = %u.new,
%t.in_payed]            = %u.payed,
%t.out_manual]          = %u.review,
%t.out_admin_cancel]    = %u.cancel,
%t.out_refund]          = %u.refund,
%t.out_rollback]        = %u.refund,
%t.out_account_invalid] = %u.payed,
%t.out_bill_ps_fail]    = %u.review,
%t.out_bill_ps_insuff]  = %u.review,
%t.out_bill_ps_wait]    = %u.payed,
%t.out_bill_ps_payed]   = %u.ok,
%t.interest]            = %u.ok,
%t.out_payed]           = %u.ok


CONF.project.ts_user_str = {
    0   : 'unknown',
    1   : 'новая',
    50  : 'отменена',
    150 : 'в обработке',
    200 : 'оплачена',
    250 : 'проведена'
}


CONF.project.tstatus = {};
mapO(CONF.project.ts_user, f(v, k) {
    CONF.project.tstatus[k] = CONF.project.ts_user_str[k] || 'unknown';
});
//-mapO(CONF.project.ts_tech, f(v, k) {
//-    CONF.project.tstatus[k] = CONF.project.ts_user_str[CONF.project.ts_map[k]] || 'unknown';
//-});
//-




//-from,to,also
CONF.project.transactionMethodLimit = {
    setManual   : [0,180],
    cancel      : [0,179],
    refundUserProfit : [80,179],
    refundSystemProfit : [80,179],
    refundFixedFee : [80,179],
    refundAcwallet : [80,179],
    setCalcResult : [0,0],
    payout      : [0,250],
    recalc      : [0,179]
}

CONF.project.transactionInterest = 205;




CONF.project.inbillStatus = {
    0   : 'new',
    10  : 'cancel',
    20  : 'sent',
    30  : 'gw_cancel',
    40  : 'ps_fail',
    50  : 'ps_wait',
    60  : 'u_cancel',
    70  : 'fail',
    80  : 'fraud',
    80  : 'gw_confirm',
    90  : 'ps_confirm',
    100 : 'ps_pay',
    200 : 'confirm'
}









