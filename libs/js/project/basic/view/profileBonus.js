new eView('profileBonus', {
	create: f(){ return _jO(cr('div', 'bonus_cont')); },
	init: f(self, obj) {
		self.C.bonusLvl = 0;
		self.C.partnerLvl = 0;

		self.V.bonus = self.cr('div', 'bonus');
		self.V.partnership = self.cr('div', 'partnership');

		self.V.bonus.cr('span', 'label_top').VAL(PAGE.ld('bonuslvl')+": ");
		self.V.bonusScale = self.V.bonus.cr('div', 'rect_scale');
		self.V.bonusLevelName = self.V.bonus.cr('span', 'label_bottom');

		self.V.partnership.cr('span', 'label_top').VAL(PAGE.ld('partnershiplvl')+": ");
		self.V.partnerScale = self.V.partnership.cr('div', 'rect_scale');
		self.V.partnerLevelName = self.V.partnership.cr('span', 'label_bottom');

		self.F.getBonusLvl = function(userPoints, modelName) {
			var list = obj.C[modelName+'Data'].sort(f(a,b) {
					return a.points - b.points;
				}),
				lvl = self.C[modelName+'Lvl'],
				node;

			map(list, f(val, ind) {
				if ( userPoints >= val.points ) {
					lvl += 1;
				} else {
					return 0;
				}
			});

			for ( var i = 0; i < list.length; i += 1 ) {
				node = self.V[modelName+'Scale'].cr('div', 'lvl_rect');
				if ( i < lvl ) {
					node.addCls('colored');
				}
			}
			self.V[modelName+'LevelName'].VAL(list[lvl-1].langdata[PAGE.lang].title);
		}

		self.F.getBonusLvl(PAGE.user.bonus_points, 'bonus');
		self.F.getBonusLvl(PAGE.user.referer_points, 'partner')
	}
});
