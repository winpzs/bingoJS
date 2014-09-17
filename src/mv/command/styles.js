
bingo.each('style,display,hide,visibility'.split(','), function (attrName) {
    bingo.command('bg-' + attrName, function () {

        return ['$attr', '$node', '$subscribe', function ($attr, $node, $subscribe) {

            var _set = function (val) {
                val = $attr.$filter(val);

                switch (attrName) {
                    case 'style':
                        //bg-style="{display:'none', width:'100px'}"
                        $node.css(val);
                        break;
                    case 'hide':
                        val = !val;
                    case 'display':
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

            $subscribe(function () { return $attr.$getContext(); }, function (newValue) {
                _set(newValue);
            }, (attrName == 'style'));

            _set($attr.$getContext());

        }];

    });
});
