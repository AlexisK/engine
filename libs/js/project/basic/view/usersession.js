
new eHtml('usersession','<td></td>\
    <td></td>\
    <td></td>\
    <td></td>\
    <td></td>\
    <td>\
      <div class="mob-view">\
          <div class="toLeft">\
              <div class="mob-head"></div>\
              <div class="mob-cut hidden">\
                  <div></div>\
                 <div></div>\
              </div>\
          </div>\
          <div class="toRight">\
              <div class="mob-head"></div>\
              <div class="mob-cut hidden"></div>\
          </div>\
      </div>\
    </td>\
    <td></td>', {
    td:'no,ctime,expiry,ip,country,useragent,action',
    div:'mobCont,mobLeft,mobLeftHead,mobLeftCut,dynDataCont,statDataCont,mobRight,mobRightHead,mobRightCut'
});

window.detectIp = function(ip, func) {
    var urlMap = ['http://ipinfo.io'];
    if ( ip) { urlMap.push(ip); }
    urlMap.push('json');
    getRawData(urlMap.join('/'), function(data) {
        data = parseObj(data);
        var loc = data.loc;
        
        getRawData('https://maps.googleapis.com/maps/api/geocode/json?latlng='+loc, function(resp) {
            resp = parseObj(resp);
            if ( resp.results && resp.results.length > 0 ) {
                var result = resp.results[0];
                func(result.formatted_address, result, resp);
            }
        });
        
    });
}

new eView('usersession', {
    create: f() { return HTML.usersession(cr('tr')); },
    init: f(self, obj) {
        if ( obj.token == glob('token') ) {
            var block = self.V.action.cr('div','marker');
            var mobBlock = self.V.mobRightCut.cr('div','marker');
            self.delBtn = {};
            self.mobDelBtn = {};
        } else {
            var btn = self.V.action.cr('div','asBtn');
            var mobBtn = self.V.mobRightCut.cr('div','asBtn endSession');
            SVG.close(btn);
            mobBtn.VAL(PAGE.ld('close_session'));
            self.delBtn = btn;
            self.mobDelBtn = mobBtn;
        }

        self.V.no.val = obj.displayNumber;
        
        var timeStr = formatDate(obj.ctime , true, true, false).split(' ');
        self.V.ctime.cr('nobr').val = timeStr[0];
        self.V.ctime.cr('br');
        self.V.ctime.cr('nobr').val = timeStr[1];

        self.V.statDataCont.cr('nobr').val = PAGE.ld('created') + ': ' + timeStr[0] + ' ' + timeStr[1];
        self.V.statDataCont.cr('br');
        
        timeStr = formatDate(obj.expiry, true, true, false).split(' ');
        self.V.expiry.cr('nobr').val = timeStr[0];
        self.V.expiry.cr('br');
        self.V.expiry.cr('nobr').val = timeStr[1];

        self.V.statDataCont.cr('nobr').val = PAGE.ld('expiry') + ': ' + timeStr[0] + ' ' + timeStr[1];
        self.V.statDataCont.cr('br');

        self.V.ip.VAL(obj.ip);
        detectIp(obj.ip, function(t, resp) {
            var components = [null, null];
            map(resp.address_components, f(comp) {
                if ( comp.types.contains('administrative_area_level_1') ) {
                    components[1] = comp.long_name;
                } else if ( comp.types.contains('country') ) {
                    components[0] = comp.long_name;
                }
            });
            
            if ( components.length == 2 ) {
                self.V.country.cr('nobr').VAL(PAGE.ld(components[0]));
                self.V.country.cr('br');
                self.V.country.cr('nobr').VAL('('+PAGE.ld(components[1])+')');

                self.V.dynDataCont.cr('nobr').VAL(PAGE.ld(components[1]));
                self.V.dynDataCont.cr('nobr').VAL(', ' + PAGE.ld(components[0]));
            }

        });

        var ua = PARSE.useragent(obj.ua).split(' / ');
        
        self.V.useragent.cr('nobr').VAL(ua[0]);
        self.V.useragent.cr('br');
        self.V.useragent.cr('nobr').VAL(ua[1]);

        self.V.mobLeftHead.cr('nobr').VAL(ua[0]);
        self.V.mobLeftHead.cr('br');
        self.V.mobLeftHead.cr('nobr').VAL(ua[1]);


        self.V.mobExpandBtn = self.V.mobRightHead.cr('div', 'asBtn expander');
        self.V.mobExpandBtn.cr('div', 'text').VAL(PAGE.ld('details'));
        SVG.blueArrDown(self.V.mobExpandBtn.cr('div', 'icon'));
        evt(self.V.mobExpandBtn, 'click', f() {
            self.V.mobLeftCut.remCls('hidden');
            self.V.mobRightCut.remCls('hidden');
            self.V.mobRightHead.addCls('hidden');
        });
    }
})
