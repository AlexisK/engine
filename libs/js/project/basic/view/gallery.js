
//- убрал fa у gallery, gallery-arrow, gallery-thumbcontainer, thumbs

new eHtml('gallery', '<div class="gallery-preview">\
        <div class="gallery-image">\
            <div class="overLayer fa">\
                <div class="svg"></div>\
            </div>\
            <img class="gallery-imgcontent">\
        </div>\
        <div class="gallery-close"></div>\
        <div class="gallery-arrow fa gleft"></div>\
        <div class="gallery-arrow fa gright"></div>\
    </div>\
    <div class="gallery-thumbs">\
        <div class="gallery-arrow gleft"></div>\
        <div class="gallery-arrow gright"></div>\
        <div class="gallery-thumbblock">\
            <div class="gallery-thumbcontainer"></div>\
        </div>\
    </div>', {
        div:'preview,image,overLayer,ico,closeFull,pArrLeft,pArrRight,thumbs,tArrLeft,tArrRight,thumbBlock,thumbContainer',
        img: 'imgContent'
    });


new eView('gallery', {
    create: function() { return HTML.gallery(cr('div','gallery')); },
    init: function(self, objData) {
        self.C.images     = objData.images;
        self.C.prop       = parseLS(objData.imageProp||CONF.project.imageProp);
        self.C.initThumbs = parseInt(objData.thumbCount||CONF.project.thumbCount);

        self.C.topMargin = parseInt(CONF.project.gallery.topMargin || 0);
        self.C.bottomMargin = parseInt(CONF.project.galleryBottomMargin || 20);

        self.C.thumbCount = self.C.initThumbs;
        self.C.thumbHalf  = self.C.thumbCount / 2 + 0.5;
        self.C.thumbSize  = parseInt(objData.thumbSize||CONF.project.thumbSize);
        self.C.galleryHeightOffset = parseInt(CONF.project.gallery.heightOffset || 0);
        self.C.thumbsIndent = 0;
        self.C.thumbMargin = parseInt(CONF.project.galleryThumbMargin || 10);
        self.C.previewMargin = parseInt(CONF.project.gallery.previewMargin || 10);
        self.C.arrowWidth = parseInt(CONF.project.galleryArrowWidth || 70);
        self.C.pos        = 0;
        self.C.shiftOn    = 0;
        self.C.thumbs     = [];
        self.C.full       = false;
        self.C.targetUrl = self.C.images[0].preview;
        self.V.cloneImg = cr('img', 'clone gallery-clone');
        self.C.isAnimating = false;
        self.C.imgContentWidth = 0;
        self.C.imgContentHeight = 0;
        self.C.prop = self.C.prop[0] / self.C.prop[1];
        
        self.V.placeholder = cr('div');
        SVG.search(self.V.ico);

        //- вынести, используется и в fullImg2, и здесь
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

        self.F.clear = function() {
            self.C.pos = 0;
            map(self.C.thumbs, detach);
            self.C.thumbs = [];
        }
        
        self.F.build = function() {
            map(self.C.images, self.F.buildThumb);
        }
        
        self.F.rebuild = function() {
            self.F.clear();
            self.F.build();
            self.F.setImage()
            self.F.doResize();
        }
        
        self.F.calcSizes = function() { 
            self.C.width = self.offsetWidth;

            if ( self.C.initThumbs * self.C.thumbSize < self.C.width ) {
                //-log('self.C.initThumbs * self.C.thumbSize < self.C.width');
                self.C.thumbCount = parseInt(self.C.width / self.C.thumbSize)-1;
                if ( self.C.thumbCount < 2 ) {
                    //-log('AND self.C.thumbCount < 2');
                    self.C.thumbCount = 2;
                }
            } else {
                //-log('ELSE');
                self.C.thumbCount = self.C.initThumbs;
            }
            if ( self.C.thumbCount % 2 == 0 ) { 
                //-log('self.C.thumbCount % 2 == 0');
                self.C.thumbCount += 1;
            }
            self.C.thumbHalf = self.C.thumbCount / 2 + 0.5;

            self.C.previewHeight    = Math.round(self.C.width / self.C.prop);
            //-self.C.thumbWidth       = Math.round(self.C.width / self.C.thumbCount);
            self.C.thumbWidth       = Math.round(self.C.width / (self.C.thumbCount+2));
            self.C.thumbsIndent     = self.C.thumbWidth;

            self.C.thumbHeight      = Math.round(self.C.thumbWidth / self.C.prop);
            self.C.totalHeight      = Math.round(self.C.previewHeight + self.C.thumbHeight + self.C.previewMargin);
            self.C.thumbsTotalWidth = self.C.thumbWidth * self.C.thumbs.length;
            self.C.placeholderHeight = self.C.totalHeight;

            //-log(self.C.thumbsTotalWidth);

            if ( self.C.full ) {
                self.C.totalHeight   = Math.round(EVENT.data.windowSize.y + self.C.galleryHeightOffset + self.C.previewMargin);
                self.C.previewHeight = Math.round(self.C.totalHeight - self.C.thumbHeight - self.C.previewMargin - self.C.bottomMargin - self.C.topMargin);
            }
        }
        
        self.F.setClone = function(src, settings) {
            if( !src || EVENT.data.windowSize.x < %wrapperS5 ) {
                src = '';
                self.V.cloneImg.style.opacity = 0;
            } else {
                self.V.cloneImg.style.opacity = 1;
                //- set top/left/width/height of target image to the clone
                self.V.cloneImg.style.width = settings.width  + 'px';
                self.V.cloneImg.style.height = settings.height  + 'px';
                self.V.cloneImg.style.top = settings.top  + 'px';
                self.V.cloneImg.style.left = settings.left  + 'px';
            }
            document.body.appendChild(self.V.cloneImg);
            self.V.cloneImg.attr('src', src);
        }
        self.F.setClone();

        self.F._doResize = function() {
            self.F.calcSizes();
            self.style.height = self.C.totalHeight+'px';
            var selfWidth = self.C.width;
            if ( self.C.full ) {
                selfWidth = EVENT.data.windowSize.x;
            }
            self.V.image.style.width = (selfWidth - self.C.arrowWidth * 2)+'px';
            self.V.image.style.marginLeft = self.C.arrowWidth+'px';
            self.V.image.style.marginRight = self.C.arrowWidth+'px';
            
            self.V.preview.style.height = self.C.previewHeight+'px';
            self.V.thumbs.style.height = self.C.thumbHeight+'px';

            self.V.thumbBlock.style.left = self.C.thumbsIndent+Math.floor(self.C.thumbMargin/2)+'px';
            self.V.thumbBlock.style.right = self.C.thumbsIndent+'px';

            var thumbWidthMargined = self.C.thumbWidth - self.C.thumbMargin;

            map(self.C.thumbs, function(thumb) {
                thumb.style.width  = thumbWidthMargined  + 'px';
                thumb.style.height = self.C.thumbHeight + 'px';
            });
            
            //-self.F.adjustThumbs(self.C.shiftOn);
            self.F.adjustThumbs();
        }
        
        //-self.F.doResize = function() { tm(self.F._doResize, %animationCss); }
        self.F.doResize = function() { tm(self.F._doResize, 0); }
        EVENT.resize.push(CEF(self.F.doResize));
        
        self.F.setImage = function(pos, isExpanding) {

            self.C.thumbs[self.C.pos].remCls('active');
            if ( def(pos) ) {
                self.C.pos = pos;
            }
            if ( self.C.pos == -1 ) {
                self.C.pos = self.C.thumbs.length - 1;
                
            } else if ( self.C.pos == self.C.thumbs.length ) {
                self.C.pos = 0;
                
            }
            
            self.C.thumbs[self.C.pos].addCls('active');
            if ( self.C.full ) {
                self.V.imgContent.attr('src', self.C.images[self.C.pos].full);
            } else {
                self.V.imgContent.attr('src', self.C.images[self.C.pos].preview);
            }

            if ( def(isExpanding) ) {
                evt(self.V.imgContent, 'load', self.F.onImageLoad);
            }
            function setOverlaySize() {
                function doSet() {
                    self.V.overLayer.style.width = self.V.imgContent.width + 'px';
                    self.V.overLayer.style.height = self.V.imgContent.height + 'px';
                    evtDel(self.V.imgContent, 'load', setOverlaySize);
                }
                if ( def(self.C.isAnimating) ) {
                    self.C.isAnimating = false;
                    tm(doSet, 50);
                } else {
                    doSet();
                }
            }
            evt(self.V.imgContent, 'load', setOverlaySize);

            //- clone image src
            self.C.targetUrl = self.C.images[self.C.pos].preview;

            self.F.adjustThumbs();
        }
        self.F.adjustThumbs = function(shiftOn) {
            var limit = self.C.thumbs.length-self.C.thumbCount;
            self.C.shiftOn = shiftOn || 0;
            var shift;
            
            self.C.shiftOn = Math.max(self.C.shiftOn, -(self.C.pos - self.C.thumbHalf + 1));
            self.C.shiftOn = Math.min(self.C.shiftOn,  (limit + self.C.thumbHalf - self.C.pos - 1));

            if ( self.C.width > self.C.thumbsTotalWidth + self.C.thumbWidth ) {
                //-shift = parseInt((self.C.width - self.C.thumbsTotalWidth) / -2);
                shift = 0;
                self.V.tArrLeft .addCls('hidden');
                self.V.tArrRight.addCls('hidden');
            } else {
                shift = Math.min(Math.max(0, self.C.pos - self.C.thumbCount/2 + 0.5 + self.C.shiftOn),limit) * self.C.thumbWidth;
                self.V.tArrLeft .remCls('hidden');
                self.V.tArrRight.remCls('hidden');

                /*
                log('self.C.pos: '+self.C.pos);
                log('self.C.thumbCount: '+self.C.thumbCount);
                log('self.C.shiftOn: '+self.C.shiftOn);
                log('limit: '+limit);
                log('self.C.thumbWidth: '+self.C.thumbWidth);
                log('shift: '+shift);
                */
            }
            self.V.thumbContainer.style.marginLeft = -shift + 'px';
        }
        
        
        self.F.buildThumb = function(obj, index) {
            var newNode = self.V.thumbContainer.cr('div');
            newNode.style.backgroundImage = ['url(',obj.thumb,')'].join('');
            
            newNode.onclick = function() {
                self.F.setImage(index);
            }
            
            self.C.thumbs.push(newNode);
        }

        self.F.getFullscreenImageDimensions = function() {
            var result = {
                width: EVENT.data.windowSize.x - self.C.arrowWidth * 2,
                height: self.C.previewHeight
            };
            return result;
        }
        self.F.setTransforms = function(originalSize) {
            function endTransition() {                
                self.V.image.addCls('gallery-original');
                //- animate the opacity to 1
                self.V.image.style.opacity = 1;
                //- and once that's done..
                self.F.onEndTransition(self.V.image, function() {
                    self.V.cloneImg.style.opacity = 0;
                    self.V.cloneImg.style.WebkitTransform = 'translate3d(0,0,0) scale3d(1,1,1)';
                    self.V.cloneImg.style.transform = 'translate3d(0,0,0) scale3d(1,1,1)';

                    self.C.isAnimating = false;
                    self.V.cloneImg.detach();
                });
            }
            if ( EVENT.data.windowSize.x >= %wrapperS5 ) {
                var dx = EVENT.data.windowSize.x/2 - self.C.targetImgOffset.left - 0.5 * self.C.targetImgOffset.width,
                    dy = self.C.previewHeight/2 - self.C.targetImgOffset.top - 0.5 * self.C.targetImgOffset.height + self.C.topMargin,
                    renderedWidth = Math.min(originalSize.width, self.V.imgContent.naturalWidth),
                    renderedHeight = Math.min(originalSize.height, self.V.imgContent.naturalHeight),
                    z = Math.min(renderedWidth / self.C.targetImgOffset.width, renderedHeight / self.C.targetImgOffset.height);
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

        //-self.F._setFull = function() {
        //-    self.C.shiftOn = 0;
        //-    self.F.setImage();
        //-    self.F.doResize();
        //-}
        self.F.onImageLoad = function() {            
            self.F.doResize();
            //- set the clone image
            self.F.setClone(self.C.targetUrl, {
                width : self.C.targetImgOffset.width,
                height : self.C.targetImgOffset.height,
                left : self.C.targetImgOffset.left,
                top : self.C.targetImgOffset.top
            });
            self.addCls('full');
            self.addCls('preview--open');
            insBefore(self.V.placeholder, self);
            document.body.attach(self);
            clearEvents(self.V.image);
            self.V.image.style.opacity = 0;
            
            self.F.calcSizes();
            var dimensions = self.F.getFullscreenImageDimensions();
            self.F.setTransforms(dimensions);
            self.V.closeFull.style.display = 'block';

            evtDel(self.V.imgContent, 'load', self.F.onImageLoad);
        }
        self.F._setImageEvent = function() {
            self.V.image.onclick = function() {
                if ( !self.C.isAnimating && !self.C.full ) {
                    self.C.targetImgOffset = self.V.imgContent.getBoundingClientRect();
                    self.C.isAnimating = true;
                    self.C.full = true;
                    self.C.shiftOn = 0;
                    self.F.setImage(null, true);
                }
                return 0;
            }
        }
        self.F.close = function() {
            if ( !self.C.full || self.C.isAnimating ) return 0;
            self.C.full = false;
            self.C.isAnimating = true;
            self.remCls('preview--open');
            self.V.placeholder.style.height = self.C.placeholderHeight+'px';
            self.V.image.addCls('animate');

            self.style.opacity = 0;
            self.F.onEndTransition(self, function() {
                self.detach();
                self.V.closeFull.style.display = 'none';
                self.V.cloneImg.detach();
                insBefore(self, self.V.placeholder);
                self.V.placeholder.detach();
                self.remCls('full');
                self.C.shiftOn = 0;
                self.F.setImage();
                self.F.doResize();
                self.F._setImageEvent();
                //-self.C.isAnimating = false;
                self.V.image.remCls('gallery-original');
                self.remCls('preview--open');
                self.V.image.remCls('animate');
                tm(function(){self.style.opacity = 1;}, 10);
            });
        }
        
        self.F.buildDom = function() {
            SVG.newArrLeft(self.V.pArrLeft);
            SVG.newArrRight(self.V.pArrRight);
            SVG.newArrLeft(self.V.tArrLeft);
            SVG.newArrRight(self.V.tArrRight);
            //-SVG.move2(self.V.btnFull);
            SVG.closeGallery(self.V.closeFull);

            self.V.pArrLeft.onclick = function() {
                self.F.setImage(self.C.pos - 1);
            }
            self.V.pArrRight.onclick = function() {
                self.F.setImage(self.C.pos + 1);
            }
            self.V.tArrLeft.onclick = function() {
                self.F.adjustThumbs(self.C.shiftOn - self.C.thumbCount);
            }
            self.V.tArrRight.onclick = function() {
                self.F.adjustThumbs(self.C.shiftOn + self.C.thumbCount);
            }
            self.V.closeFull.onclick = function() {
                self.F.close();
            }
            self.F._setImageEvent();
        }
        
        self.F.buildDom();
    }
})

























