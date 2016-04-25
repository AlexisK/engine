
ENGINE.path.fbpage = null;
ENGINE.defaultLang = 'en';

CONF.engine.dynamicPageSelectors = ".menu,header,.wrapper:class,.content,footer,.dynb,.canonical:href".split(',');
CONF.engine.dynamicPopSelectors  = ".content,.dynb".split(',');
CONF.engine.mainContentSelector = ".content";



CONF.engine.dynamicPageRetarget = {
    exchange: {
        pop      : "window",
        urlMap   : "///exchange/".split('/'),
        selector : [".calc-container"]
    }
}


CONF.engine.layer = {
    pop: [
        "///page/".split('/'),
        "///exchange/".split('/'),
        "///transaction/".split('/'),
        "///newsitem/".split('/'),
        "///faq/".split('/'),
        "///instruction/".split('/'),
        "///ticket/".split('/')
    ],
    paper: [
        "///settings/".split('/')
    ]
}



CONF.engine.articleImage = {
    size: {
        thumb:   '40x40x2',
        thumb2:  '120x80x2',
        preprop: '580x1080x1',
        preview: '580x326x2'
    },
    type: 'ogimage',
    startSize: 'preview',
    startSizeSingle: 'preprop',
    thumbSize: 'thumb2'
};


