CONF.project.modelVisName = {
    currency: f(obj) {
        var str = [ORM.getVisName(obj._rel.paysystem), obj.displayname].join(' ');
        return str;
    },
    exchange: f(obj) {
        return [ORM.O('currency_'+obj.in_currency_id).name, ORM.O('currency_'+obj.out_currency_id).name].join(' | ');
    }
};
