new eProcessor('verificationDate', {
	process: function(self, db) {
		_jO(self);
		self.C.datetime = new Date(parseFloat(self.innerHTML));
		var date = [self.C.datetime.getDate().toLen(), (self.C.datetime.getMonth()+1).toLen(), self.C.datetime.getFullYear()].join('.');
		self.remCls('dateHid');
		self.innerHTML = date;
	}
});
