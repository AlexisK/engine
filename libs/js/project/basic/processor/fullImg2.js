
new eProcessor('fullImg2', {
    process: function(self, db) {
        _jO(self);
        var url = self.D.src;
        var trigger = S('.mk_fullImgTrig', self)[0];
        
        if ( url ) {
            self.C.isExpanded = false;
            self.C.isAnimating = false;
            self.C.pageMargin = CONF.project.pageMargin || 80;

            var target = trigger||self;
            
            self.V.bg = cr('div', 'fullscreen fullImg zoomOut');
            var block = self.V.bg.cr('div', 'fullImg');
            var svgBg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

            svgBg.setAttributeNS(null, 'version', '1.1');
            svgBg.setAttributeNS(null, 'width', '100%');
            svgBg.setAttributeNS(null, 'height', '100%');
            svgBg.setAttributeNS(null, 'class', 'overlaySingleGallery');

            var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            
            circle.setAttributeNS(null, 'cx', 0);
            circle.setAttributeNS(null, 'cy', 0);

            self.V.bg.appendChild(svgBg);
            svgBg.appendChild(group);
            group.appendChild(circle);

            self.V.targetImg = S('img', target)[0];
            self.V.imgNode = block.cr('img', 'original');
            self.V.imgNode.attr('src', '');

            //- create the clone image and append it to the DOM
            self.F._getTargetImgOffset = function() {
                return self.V.targetImg.getBoundingClientRect();
            }
            self.F._setClone = function(src, settings) {
                if( !src || self.D.isfull == '0' || document.documentElement.clientWidth < %wrapperS5 ) {
                    self.V.cloneImg = cr('img', 'clone');
                    src = '';
                    self.V.cloneImg.style.opacity = 0;  
                } else if ( self.D.isfull == '1' ) {
                    self.V.cloneImg.style.opacity = 1;
                    //- set top/left/width/height of grid item's image to the clone
                    self.V.cloneImg.style.width = settings.width  + 'px';
                    self.V.cloneImg.style.height = settings.height  + 'px';
                    self.V.cloneImg.style.top = settings.top  + 'px';
                    self.V.cloneImg.style.left = settings.left  + 'px';
                }
                self.V.bg.appendChild(self.V.cloneImg);
                self.V.cloneImg.attr('src', src);
            }
            self.F._setClone();

            self.F.whichTransitionEvent = function() {
                var t,
                    el = cr("fakeelement"),
                    transitions = {
                        "transition"      : "transitionend",
                        "OTransition"     : "oTransitionEnd",
                        "MozTransition"   : "transitionend",
                        "WebkitTransition": "webkitTransitionEnd"
                    };
                for ( t in transitions ) {
                    if (el.style[t] !== undefined){
                        return transitions[t];
                    }
                }
            }
            self.C.transEndEventName = self.F.whichTransitionEvent();
            self.F.onEndTransition = function(el, callback) {
                var onEndCallbackFn = function(ev) {
                    if ( ev.target != this ) return;

                    this.removeEventListener(self.C.transEndEventName, onEndCallbackFn);
                    if ( callback && typeof callback === 'function' ) { callback.call(this); }
                };
                el.addEventListener(self.C.transEndEventName, onEndCallbackFn);
            }
            self.F.setCircleR = function() {
                circle.setAttributeNS(null, 'r', Math.sqrt(Math.pow(self.V.bg.offsetWidth,2) + Math.pow(self.V.bg.offsetHeight,2)));
            }
            self.F.getImageDimentions = function() {
                var imgNode = self.V.imgNode;
                var result = { width: imgNode.naturalWidth || imgNode.width, height: imgNode.naturalHeight || imgNode.height };        
                return result;
            }
            self.F._getWinSize = function() {
                return {
                    width: document.documentElement.clientWidth,
                    height: window.innerHeight
                };
            }
            self.F.setTransforms = function(originalSize) {
                function endTransition() {
                    //- animate the opacity to 1
                    self.V.imgNode.style.opacity = 1;
                    //- and once that's done..

                    self.F.onEndTransition(self.V.imgNode, function() {
                        self.V.cloneImg.style.opacity = 0;
                        self.V.cloneImg.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
                        self.V.cloneImg.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';

                        self.C.isAnimating = false;
                    });
                }
                if ( self.D.isfull == '1' && document.documentElement.clientWidth >= %wrapperS5 ) {
                    var win = self.F._getWinSize(),
                    targetImgOffset = self.F._getTargetImgOffset();
                    dx = win.width/2 - targetImgOffset.left - 0.5 * self.V.targetImg.offsetWidth,
                    dy = win.height/2 - targetImgOffset.top - 0.5 * self.V.targetImg.offsetHeight,
                    renderedWidth = Math.min(win.width - self.C.pageMargin, originalSize.width),
                    renderedHeight = Math.min(win.height - self.C.pageMargin, originalSize.height),
                    z = Math.min(renderedWidth / self.V.targetImg.offsetWidth, renderedHeight / self.V.targetImg.offsetHeight);

                    self.V.cloneImg.style.WebkitTransform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale3d(' + z + ', ' + z + ', 1)';
                    self.V.cloneImg.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale3d(' + z + ', ' + z + ', 1)';
                    //- after the clone animates..
                    self.F.onEndTransition(self.V.cloneImg, function() {
                        endTransition();
                    });
                } else {
                    endTransition();
                }
            }

            self.F.setCircleR();

            EVENT.global.resize.add(function() {
                self.F.setCircleR();
            });

            target.addCls('zoomIn');

            clearEvents(target).onclick = function(ev) {
                if( !self.C.isAnimating && !self.C.isExpanded ) {
                    var targetImgOffset = self.F._getTargetImgOffset();
                    self.C.isAnimating = true;
                    self.C.isExpanded = true;
                    self.V.imgNode.attr({ src:url });
                    self.V.imgNode.style.opacity = 0;
                    //- set the clone image
                    self.F._setClone(self.V.targetImg.src, {
                        width : self.V.targetImg.offsetWidth,
                        height : self.V.targetImg.offsetHeight,
                        left : targetImgOffset.left,
                        top : targetImgOffset.top
                    });
                    //- attach the background
                    document.body.attach(self.V.bg);
                    //- animate the background svg
                    self.F.setCircleR();
                    group.setAttributeNS(null, 'transform', 'translate(0, ' + window.innerHeight + ')');
                    self.V.bg.addCls('preview--open');
                    //- when the full size image is loaded
                    evt(self.V.imgNode, 'load', function() {
                        var dimensions = self.F.getImageDimentions();
                        self.F.setTransforms(dimensions);
                    });
                }
                return false;
            }
            
            self.V.bg.onclick = function() {
                if ( !self.C.isExpanded || self.C.isAnimating ) return 0;
                self.C.isExpanded = false;
                self.V.imgNode.addCls('animate');
                function endTransition() {
                    //- fade out the original image
                    setTimeout(function() { self.V.imgNode.style.opacity = 0; }, 30);

                    //- and after that
                    self.F.onEndTransition(self.V.imgNode, function() {
                        //- reset original/large image
                        self.V.imgNode.remCls('animate');
                        self.V.imgNode.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
                        self.V.imgNode.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';

                        self.C.isAnimating = false;
                        self.V.bg.detach();
                        self.V.cloneImg.detach();
                    });
                }

                if ( self.D.isfull == '1' && document.documentElement.clientWidth >= %wrapperS5 ) {
                    var win = self.F._getWinSize(),
                    targetImgOffset = self.F._getTargetImgOffset();
                    dx = targetImgOffset.left + self.V.targetImg.offsetWidth/2 - win.width/2,
                    dy = targetImgOffset.top + self.V.targetImg.offsetHeight/2 - win.height/2,
                    z = self.V.targetImg.offsetWidth/self.V.imgNode.offsetWidth;
                
                    self.V.imgNode.style.WebkitTransform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale3d(' + z + ', ' + z + ', 1)';
                    self.V.imgNode.style.transform = 'translate3d(' + dx + 'px, ' + dy + 'px, 0) scale3d(' + z + ', ' + z + ', 1)';  
                    
                    self.F.onEndTransition(self.V.imgNode, function() {
                        //- show original grid item
                        self.V.cloneImg.style.opacity = 1;

                        endTransition();
                    });
                } else {
                    endTransition();
                }
                
                self.V.bg.remCls('preview--open');
            }
        }
        
    }
});


