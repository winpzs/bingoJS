
bingo.each('attr,src,checked,disabled,class'.split(','), function (attrName) {
    bingo.command('bg-' + attrName, function () {

        return ['$attr', '$node', '$subscribe', function ($attr, $node, $subscribe) {

            var _set = function (val) {
                val = $attr.$filter(val);
                switch (attrName) {
                    case 'style':
                        //bg-attr="{src:'text.html', value:'ddd'}"
                        $node.attr(val);
                        break;
                    case 'disabled':
                    case 'checked':
                        $node.prop(attrName, val);
                        break;
                    default:
                        $node.attr(attrName, val);
                        break;
                }

            };

            $subscribe(function () { return $attr.$getContext(); }, function (newValue) {
                _set(newValue);
            }, (attrName == 'attr'));

            _set($attr.$getContext());

        }];

    });
});
