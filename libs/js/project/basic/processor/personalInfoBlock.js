new eProcessor('personalInfoBlock', {
	process: function(self, db) {
		self.C.tags = ['avatar_100', 'avatar_200'];
		self.C.verDataKeys = ['last_name', 'first_name', 'birthdate', 'city', 'country'];

		self.F.init = function() {
			var avaContainer = self.cr('div', 'ava_cont');
			self.V.infoContainer = self.cr('div', 'profile_info_cont');
			self.V.imgCont = avaContainer.cr('img', 'ava');
			self.V.overlay = avaContainer.cr('img', 'ava_over').attr('src', ENGINE.path.static+'image/ava_overlay.png');
			self.V.uploadInput = avaContainer.cr('input', 'ava_input').VAL('UPLOAD').attr({type: 'file'});

			self.V.infoContainer.cr('div', 'email').VAL(PAGE.user.email+':');

			var status = self.V.infoContainer.cr('div', 'is_verified');
			self.V.infoContainer.cr('hr', 'wClear');

			var statusText;
			if ( PAGE.user.lvl < 30 ) {
				statusText = PAGE.ld('profile_status_unverified');
				status.addCls('unverified');
			} else if ( PAGE.user.lvl == 30 ) {
				statusText = PAGE.ld('profile_status_verified');
				status.addCls('verified');
			} else if ( PAGE.user.lvl >= 200 ) {
				statusText = PAGE.ld('profile_status_admin');
				status.addCls('admin');
			} else {
				statusText = PAGE.ld('profile_status_' + PAGE.user.lvl);
				status.addCls('admin');
			}

			status.VAL(statusText);


			if ( def(PAGE.user.verification_data) ) {
				var verificatonData = self.V.infoContainer.cr('div', 'verification_data');
				if ( def(PAGE.user.verification_data['first_name']) && def(PAGE.user.verification_data['last_name']) && PAGE.user.verification_data['first_name'] != '' && PAGE.user.verification_data['last_name'] != '' ) {
					var verName = verificatonData.cr('div', 'profile_name');
					var nameStr = PAGE.user.verification_data['last_name'].concat(' ', PAGE.user.verification_data['first_name']);
					verName.VAL(nameStr);
				}
				if ( def(PAGE.user.verification_data['birthdate']) ) {
					var verDate = verificatonData.cr('div', 'profile_birthdate dateHid')
					verDate.VAL(PAGE.user.verification_data['birthdate']);
					PROCESSOR.verificationDate.process(verDate);
				}
				if ( def(PAGE.user.verification_data['city']) && def(PAGE.user.verification_data['country']) && PAGE.user.verification_data['city'] != '' && PAGE.user.verification_data['country'] != '' ) {
					var verGeo = verificatonData.cr('div', 'profile_geo');
					var geoStr = PAGE.user.verification_data['city'].concat(', ', PAGE.user.verification_data['country']);
					verGeo.VAL(geoStr);
				}
				self.V.infoContainer.cr('hr', 'wClear');
			}
			
			self.V.uploadInput.onchange = function() {
				var imgFile = self.V.uploadInput.files[0];
				var tags = ['avatar_200', 'avatar_100'];
				var name = getFileName(imgFile);

				SYS.notify(PAGE.ld('avatar-is-loading'));

				resizeImage(imgFile, '200x200x2', function(newUri, newFile) {

					PROTOCOL.form.write('user:avatarUpload', {
						tag: tags[0],
					    file:[newFile, name]
					}, self.F.processResponse);

					resizeImage(imgFile, '100x100x2', function(nUri, nFile) {
						PROTOCOL.form.write('user:avatarUpload', {
							tag: tags[1],
					    	file:[nFile, name]
						});
					});
				});
			};
		}

		self.F.processResponse = function(o1, o2) {
			var newUser = o2.user[0];
			PAGE.user = newUser;
			glob('user', JSON.stringify(newUser));
			SYS.notify(PAGE.ld('avatar-uploaded'));
			tm(self.F.showAvatar, 100);
		}
		self.F.showAvatar = function() {
			if ( def(PAGE.user.media_id) ) {
				//-getImage(PAGE.user.media_id, function(mediafiles) {
				//-	self.V.imgCont.src = mediafiles[self.C.tags[1]];
				//-});
				var timestamp = new Date();
				var url = ENGINE.path.page + '/_view/mediabyid/' + PAGE.user.media_id + '/?v=' + timestamp.getTime();
				getRawData(url, function(resp) {
					resp = JSON.parse(resp);
					var result = {};

		            if ( resp.fields ) {

		                map(resp.fields, function(fieldSet) {
		                    result[fieldSet[0]] = [];
		                });
		                
		                
		                map(resp.data, function(obj) {
		                    var index = 0;
		                    map(resp.fields, function(fieldSet) {
		                        var writeTo = {};
		                        result[fieldSet[0]].push(writeTo);
		                        for ( var i = 1; i < fieldSet.length; i++ ) {
		                            writeTo[fieldSet[i]] = obj[index];
		                            index += 1;
		                        }
		                    }); 
		                });
		            }
					self.V.imgCont.src = result.mediafile[0].fullSrc;
				});
				
			} else {
				self.V.imgCont.src = ENGINE.path.static + 'images/noava.png';
			}
			
		}

		self.F.fetchBonusData = function(callback) {
			var urlBonus = ENGINE.path.page + '/_view/select_bonus/';
			var urlPartner = ENGINE.path.page + '/_view/select_partner/';

			function respFunc(resp) {
				resp = JSON.parse(resp);
				var result = {};
	            if ( resp.fields ) {

	                map(resp.fields, function(fieldSet) {
	                    result[fieldSet[0]] = [];
	                });
	                
	                
	                map(resp.data, function(obj) {
	                    var index = 0;
	                    map(resp.fields, function(fieldSet) {
	                        var writeTo = {};
	                        result[fieldSet[0]].push(writeTo);
	                        for ( var i = 1; i < fieldSet.length; i++ ) {
	                            writeTo[fieldSet[i]] = obj[index];
	                            index += 1;
	                        }
	                    }); 
	                });
	            }
	            return result;
			}

			getRawData(urlBonus, function(resp) {
				self.C['bonusData'] = respFunc(resp)['bonus'];
				getRawData(urlPartner, function(resp) {
					self.C['partnerData'] = respFunc(resp)['partner'];
					callback();
				});
			});
		}

		self.F.init();
		self.F.showAvatar();
		self.F.fetchBonusData(function() { self.V.infoContainer.attach(VIEW.profileBonus(self)); })
	}
});
