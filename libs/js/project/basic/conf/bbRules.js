
CONF.project.bbRules = {
    in: {
        'tag': function(self, node, attrs, done, fail) {
            var newNode = cr('a', 'bold').attr({href:'#'});
            newNode.val = '#'+attrs[0];
            done(newNode);
        },
        'image': f(self, node, attrs, done, fail) {
            var t = cr('div');
            getRawData('/_view/'+PAGE.lang+'/contentimage/'+attrs.join('/')+'/', function(nhtml) {
                t.innerHTML = nhtml;
                done(S('img',t)[0]);
            }, fail);
        },
        'langcontent': f(self, node, attrs, done, fail) {
            var newNode = cr('img').attr({
                'data-imagetype' : 'lc',
                'data-media' : attrs.join('/'),
                'src' : 'about:blank',
                'alt' : PAGE.ld('langcontent')
            });
            done(newNode);
        },
        'html': f(self, node, attrs, done, fail) {
            var oid = attrs[0];
            ORM.prep('htmlblock_'+oid, f(obj) {
                var newNode = cr('img').attr({
                    'data-imagetype' : 'html',
                    'data-media' : oid,
                    'src' : ENGINE.path.static+'/images/empty_disabled.png',
                    'alt' : 'html "'+ORM.getVisName(obj)+'"'
                });
                done(newNode);
            }, fail);
        }
    },
    out: {
        'a': function(self, node) {
            if ( node.val[0] == '#' ) {
                var tagName = node.val.sl([1]);
                self.bb_entities.tags = self.bb_entities.tags || [];
                self.bb_entities.tags.push(tagName);
                return ['tag', tagName];
            }
        },
        'img': function(self, node) {
            _jO(node);
            if ( node.D.imagetype == "gallery-image" && node.D.media ) {
                return ['image', node.D.media, ( (node.D.isfull == '1') && 1 || 0 )];
            }
            if ( node.D.imagetype == 'lc' ) {
                var data = node.D.media.split('/');
                data.splice(0,0,'langcontent');
                return data;
            }
            if ( node.D.imagetype == 'html' ) {
                var data = node.D.media.split('/');
                data.splice(0,0,'html');
                return data;
            }
        }
    }
}

