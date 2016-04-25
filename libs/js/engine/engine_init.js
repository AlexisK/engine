var NOW = new Date()*1;

window.ENGINE = {
    path: {
        page:      '%baseUrl',
        handler:   '%baseUrl/_handler/',
        static:    '%baseUrl/static/',
        media_raw: '%baseUrl/_media/',
        media:     ['%baseUrl/_media/',NOW,'/'].join(''),
        compiled:  ['%baseUrl/_compiled/',NOW,'/'].join('')
    },
    menu: {},
    goAnimation: false
};



#include engine/wrap/basic
#include engine/wrap/browserCheck
#include engine/wrap/dom
#import engine/cr
#include engine/wrap/ajax

#include engine/wrap/math
#include engine/wrap/class
#include engine/wrap/range
#include engine/wrap/buildRel


window.CONF = {
    engine:  {},
    object:  {},
    extend:  {},
    project: {}
};



CONF.engine.defaultDomFilterRules = {
        available   : 'a,table,tr,td,th,font,ins,img,br,h2,h4,code,blockquote,pre,p,strong,i,u,strike',
        stackable   : 'p,pre,h2,ins,code,blockquote',
        textwrap    : 'p',
        plain       : 'span,nobr,bdi',
        empty       : 'td,img,br',
        inline      : 'span,i,strong,font,u,strike',
        
        morph       : {
            h2      : 'h1,h3',
            h4      : 'h5,h6',
            p       : 'div,label,article,body,html,header,footer,ol,ul,dl,dt,nav,big,small',
            strong  : 'b',
            i       : 'em',
            pre     : 'li,dd',
            span    : 'abbr'
        },
        
        attrs       : {
            'p,blockquote' : 'style',
            a       : 'href,data-ct',
            font    : 'color',
            img     : 'src,alt,width,height,data-imagetype,data-media,data-preview,data-isfull',
            'td,th' : 'colspan,rowspan'
        },
        
        styles      : {
            'p,blockquote' : 'text-align'
        }
        
    }

CONF.engine.swipeEvents = 'touchstart,touchend,touchcancel,touchleave,touchmove,mousedown,mousemove';


CONF.engine.table = {
    entitiesPerPage: 30,
    offsetTop: 65
};

CONF.engine.notify = {
    timeout: {
        def: 3000,
        red: 6000
    }
}



#include project/engineConf


#include engine/worker/address
#include engine/worker/translitter
#include engine/worker/format
#include engine/worker/pageCleaner
#include engine/worker/dynamicPageRequest
#include engine/worker/domFilter
#include engine/worker/swipeManager
#include engine/worker/cronEmitFilter
#include engine/worker/closeOnClick
#include engine/worker/notify

#include engine/model/parse
#include engine/model/protocol
#include engine/model/svg
#include engine/model/log
#include engine/model/subprogram
#include engine/model/storage
#include engine/model/layer
#include engine/model/validator
#include engine/model/view
#include engine/model/pop

#include engine/model/adapter
#include engine/model/processor
#include engine/worker/processDom

#include engine/model/event
#include engine/model/scenario
