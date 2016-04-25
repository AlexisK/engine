
CONF.project.ormDropdownName = {
    currency: function(stor, obj) {
        return [stor.O('paysystem_'+obj.paysystem_id).name, obj.displayname].join(' ');
    }
};
