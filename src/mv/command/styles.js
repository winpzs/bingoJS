
/*
    使用方法:
    bg-style="{display:'none', width:'100px'}"
    bg-show="true"
    bg-show="res.show"
*/
bingo.each('style,show,hide,visibility'.split(','), function (attrName) {
    bingo.command('bg-' + attrName, function () {

        return ['$attr', '$node', function ($attr, $node) {

            var _set = function (val) {

                switch (attrName) {
                    case 'style':
                        //bg-style="{display:'none', width:'100px'}"
                        $node.css(val);
                        break;
                    case 'hide':
                        val = !val;
                    case 'show':
                        if (val) $node.show(); else $node.hide();
                        break;
                    case 'visibility':
                        val = val ? 'visible' : 'hidden';
                        $node.css(attrName, val);
                        break;
                    default:
                        $node.css(attrName, val);
                        break;
                }
            };

            $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
                _set(newValue);
            }, (attrName == 'style'));

            $attr.$init(function () { return $attr.$context() }, function (value) {
                _set(value);
            });

        }];

    });
});
