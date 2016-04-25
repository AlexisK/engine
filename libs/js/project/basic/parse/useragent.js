new eParse('useragent', {
    parse: function(string) {
        var env = getEnv(this);
        var self = env.self;
        var data = self.data;
        var result = ['','','/','',''];
        
        var ch = true;
        map(data.rules.browser, function(rule) {
            var str = string||'';
            str.replace(new RegExp(rule.reg), f(m,ver) {
                result[0] = rule.title;
                result[1] = ver;
                ch = false;
            });
            return ch;
        });
        if ( ch ) { return string||''; }
        
        ch = true;
        map(data.rules.os, function(rule) {
            var str = string||'';
            str.replace(new RegExp(rule.reg), f(m,ver) {
                result[3] = rule.title;
                result[4] = ver;
                ch = false;
            });
            return ch;
        });
        if ( ch ) { return string||''; }
        
        return result.join(' ');
        
    },
    rules: {
        browser: [
            {title:'Firefox',reg:/Firefox\/([\d\.]+)/},
            {title:'Seamonkey',reg:/Seamonkey\/([\d\.]+)/},
            {title:'Chrome',reg:/Chrome\/([\d\.]+)/},
            {title:'Chromium',reg:/Chromium\/([\d\.]+)/},
            {title:'Safari',reg:/Safari\/([\d\.]+)/},
            {title:'Opera',reg:/(Opera|OPR)\/([\d\.]+)/},
            {title:'MSIE',reg:/MSIE ([\d\.]+)/},
            {title:'Trident',reg:/Trident\/([\d\.]+)/}
        ],
        os: [
            {title:'Android',reg:/Android ([\d\.]+)/},
            {title:'Linux',reg:/Linux (\w+)/},
            {title:'iPhone',reg:/iPhone OS ([\d\_]+)/},
            {title:'iPad',reg:/CPU OS ([\d\_]+)/},
            {title:'Mac OS X',reg:/Mac OS X ([\d\_]+)/},
            {title:'Windows',reg:/Windows ([^\)]+)/}
        ]
    }
});


