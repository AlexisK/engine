
CONF.project.editManagerRules = {
    'category,blogcategory': function(self) {
        var entity = self.D.emr;
        var crentity = self.D.emc || entity;
        
        ORM.prep([entity,self.D.ref].join('_'), function(category) {
            var ld = ORM.lang(category);
            
            var reqDict = { displaydate: new Date()*1 }
            reqDict[entity+'_id'] = category.id;
            
            EDITOR[crentity].create(reqDict, function(button) {
                self.V.newArticleBtn = button;
                self.attach(button);
            });
            
            EDITOR[entity].edit(category, function(button) {
                self.V.editCategoryBtn = button;
                self.attach(button);
            });
        
        });
    }
}
