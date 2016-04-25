var TESTIMGNODE;
new eProcessor('banners', {
	process: function(self, db) {
		_jO(self);

		self.V = selectorMapping(self, {
			'.mk_banners_size_select': 'sizeSelector',
			'.mk_banners_variant_select': 'variantSelector',
			'.mk_banner_url': 'urlView',
			'.mk_banner_html': 'htmlView',
			'.mk_blocked_notif': 'blockNotification',
			'.mk_preview': 'preview'
		});

		self.F.getMediaFiles = f(callback) {
			var url = ENGINE.path.page + '/_view/banners/';
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
	            callback(result);
	        });
		}
		self.F._groupByTag = f(obj) {
			var mediaFiles = obj['mediafile'];
			if ( !def(mediaFiles) ) { return 0 };
			var mediaFilesByTag = {};
			map(mediaFiles, f(mf) {
				if ( !def(mediaFilesByTag[mf.tag]) ) {
					mediaFilesByTag[mf.tag] = [mf];
				} else {
					mediaFilesByTag[mf.tag].push(mf);
				}
			});
			return mediaFilesByTag;
		}
		self.F.fetchView = f(obj) {
			var mfDict = self.F._groupByTag(obj);
			self.F._makeDropdown(mfDict);
		}
		self.F._makeDropdown = f(mfDict) {
			var nodesList = [];
			var tagList = [];
			mapO(mfDict, f(mediaFiles, tag) {
				var strArr = tag.split('x');
				var str = PAGE.ld('banner') + ': ' + strArr[0] + ' x ' + strArr[1] + ';';
				var node = cr('div');
				node.VAL(str);
				nodesList.push(node);
				tagList.push(tag);
			});
			self.V.sizeDropdown = cr.dropdown(nodesList, 'banner-size-dropdown', self.V.sizeSelector, { noUpdateOnVal: true });
			
			
			self.C.currentTag = tagList[self.V.sizeDropdown.val];

			function activate(i) {
				self.C.currentTag = tagList[i];
                var variants = mfDict[self.C.currentTag];
                self.V.variantSelector.innerHTML = '';
                self.F._makeVariantInput(variants);
			}

            self.V.sizeDropdown.onupdate(activate);
            self.V.sizeDropdown._ddnodeList[0].clickOn();
		}
		self.F._makeVariantInput = f(variants) {

			var switchers = [];
					
			map(variants, f(mf, index) {
				var count = index + 1,
					str = PAGE.ld('variant') + ' ' + count,
					cont = self.V.variantSelector.cr('div', 'switcher-wrap'),
					switcher = cont.cr('div', 'jSwitcher');

				switcher.cr('div', 'mark').cr('div');
				switcher.cr('div').VAL(str);
				switchers.push(switcher);

				evt(switcher, 'click', f() {
					if ( self.C.activeSwitcherIndex == index ) {
						return 0;
					}
					switchers[self.C.activeSwitcherIndex].remCls('active');
					self.C.activeSwitcherIndex = index;
					switcher.addCls('active');
					self.F.createView(mf);
				});
			});

			self.C.activeSwitcherIndex = 0;
			self.F.createView(variants[0]);
			switchers[0].addCls('active');

		}
		self.F.createView = f(mf) {
			self.F._createLinks(mf);
			self.F._createPreview(mf);
		}
		self.F._createLinks = f(mf) {
			var urlStr = mf.fullSrc,
				htmlStr = '<a href="' + ENGINE.path.page + '/' + PAGE.lang + '/main/#u=' + PAGE.user.id + '" target="_blank"><img src="' + urlStr + '"></a>',
				urlInp,
				htmlInp;

			self.V.urlView.innerHTML = '';
			self.V.htmlView.innerHTML = '';
			
			urlInp = self.V.urlView.cr('div', 'inp-block').cr('div','inp').cr('input');
			htmlInp = self.V.htmlView.cr('div', 'inp-block').cr('div','inp').cr('input');
			
			urlInp.VAL(urlStr);
			urlInp.attr('type', 'text');
			urlInp.attr('disabled', 'true');
			htmlInp.VAL(htmlStr);
			htmlInp.attr('type', 'text');
			htmlInp.attr('disabled', 'true');
		}
		self.F._createPreview = f(mf) {
			self.V.preview.innerHTML = '';
			var banner = cr('img', 'img-preview');
			banner.attr('src', mf.fullSrc);
			self.V.preview.attach(banner);
			self.V.blockNotification.addCls('hidden');
			tm(function() {
				if ( banner.offsetHeight == 0 ) {
					self.V.blockNotification.remCls('hidden');
				}
			}, 200)
		}
		self.F.getMediaFiles(self.F.fetchView);
	}
});
