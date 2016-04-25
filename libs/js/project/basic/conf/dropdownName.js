
CONF.project.dropdownName = {
    def: function(obj) { return ORM.getVisName(obj); },
    currency: function(obj) {
        return [ORM.getVisName(ORM.O('paysystem_'+obj.paysystem_id)), ORM.getVisName(obj)].join(' ');
    }
}








