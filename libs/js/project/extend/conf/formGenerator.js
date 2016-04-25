
CONF.project.formGeneratorTypes = {
    fee_type: function() {
        return cr.dropdown(calcObj.fee_types);
    },
    ceil_method: function() {
        return cr.dropdown(parseLS('floor,ceil,round'));
    },
    m_precision: f() {
        var node = cr('input').attr({type: 'number'});
        
        $P(node, 'val', f() {
            var resp = 0;
            var val = this.value;
            for ( ;val < 1; resp += 1, val *= 10 );
            return resp;
        }, f(data) {
            this.value = 1 / Math.pow(10, data);
            return data;
        });
        
        return node;
    },
    label: f() { return cr('div'); }
};


CONF.project.formGeneratorFields = {
    'is_black,is_auto,is_banned,is_active_in,is_active_out':'bool',
    'max_per_coffer,max_total,bal_req_period,untrans_del_period':'number',
    'bonus_points,referer_points,surplus,max_profit_surplus,points,display_mult,display_offset,display_total,margin,dir_ratecorrection,rev_ratecorrection':'dec',
    'reference':'label',
    'src':'textarea'
}
