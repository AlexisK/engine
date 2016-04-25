



var transStatusMap = {0:'new'};

new eTable('transaction', {
    hasRange: true,
    lineHeight: 40,
    cls    : 'exch-table',
    fields: [],
    clsCols: parseLS(',token,,cur bl,cur,cur bl,cur'),
    customTranslate: {
        profit:'Прибыль',
        bonus:'Бонус',
        partner:'Партнеру',
        profit2:'Итого',
        is_cancelled:'Закр.',
        is_fraud:'Мош',
        in_currency_id: ' ',
        out_currency_id: ' ',
        in_sum: 'Отдают',
        out_sum: 'Получают',
        in_uaccount:'Плательщик',
        out_uaccount:'Получатель',
        status: 'Статус',
        ctime: 'Созд.'
    },
    lineCls: function(obj) {
        return (obj.status > 0) && 'green' || '';
    },
    customFields: {
        'id,name,ctime,in_sum,in_currency_id,out_sum,out_currency_id,in_uaccount,in_batchid,out_uaccount,out_batchid,email,ip,profit,bonus,partner,profit2,is_cancelled,is_fraud,status': function(obj) {
            var cres = obj.calc_result;
            
            var exch    = ORM.rel(obj     , 'exchange');
            var in_cur  = ORM.rel(exch    , 'in_currency');
            var out_cur = ORM.rel(exch    , 'out_currency');
            
            var result = [
                obj.id,
                obj.name,
                formatDate(obj.ctime, true, true, true),
                toDec(cres.in_cash),
                eTable.currency(in_cur),
                toDec(cres.out_cash),
                eTable.currency(out_cur),
                obj.in_uaccount||'',
                obj.in_batchid||'',
                obj.out_uaccount||'',
                obj.out_batchid||'',
                obj.email,
                obj.ip||'',
                toDec(obj.profit),
                toDec(obj.bonus),
                toDec(obj.partner),
                toDec(obj.profit2),
                eTable.bool(obj,'is_canceled'),
                eTable.bool(obj,'is_fraud'),
                transStatusMap[obj.status]
            ];
            
            return result;
        }
    },
    customRangeFilter: lsMapToDict({
        'id'                               : eTable.INP.number,
        'in_sum,out_sum'                   : eTable.INP.rangeNumber,
        'profit,bonus,partner,profit2'     : eTable.INP.rangeNumber,
        'is_cancelled,is_fraud'            : eTable.INP.bool,
        'in_currency_id,out_currency_id'   : function(self, f) { return eTable.INP.modelDropdown(self,f,'currency'); },
        'in_uaccount,out_uaccount'         : eTable.INP.like,
        'in_batchid,out_batchid'           : eTable.INP.like,
        'name,email,ip'                    : eTable.INP.like,
        'status'                           : function(self, f) { return eTable.INP.dropdown(self,f,transStatusMap); }
    }),
    customRangeSorter: parseLS('id,ctime,in_sum,out_sum,in_currency_id,out_currency_id,profit,bonus,partner,profit2,is_canceled,is_fraud,status')
});














