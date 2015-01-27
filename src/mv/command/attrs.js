/*
    使用方法:
    bg-attr="{src:'text.html', value:'ddd'}"
    bg-prop="{disabled:false, checked:true}"
    bg-checked="true" //直接表达式
    bg-checked="helper.checked" //绑定到变量, 双向绑定
*/
bingo.each('attr,prop,src,checked,disabled,readonly,class'.split(','), function (attrName) {
    bingo.command('bg-' + attrName, function () {

        return ['$view', '$attr', '$node', function ($view, $attr, $node) {

            var _set = function (val) {
                switch (attrName) {
                    case 'attr':
                        //bg-attr="{src:'text.html', value:'ddd'}"
                        $node.attr(val);
                        break;
                    case 'prop':
                        $node.prop(val);
                        break;
                    case 'disabled':
                    case 'readonly':
                    case 'checked':
                        $node.prop(attrName, val);
                        break;
                    default:
                        $node.attr(attrName, val);
                        break;
                }

            };

            $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
                _set(newValue);
            }, (attrName == 'attr' || attrName == 'prop'));

            $attr.$init(function () { return $attr.$context() }, function (value) {
                _set(value);
            });

            if (attrName == 'checked') {
                //如果是checked, 双向绑定
                $node.click(function () {
                    var value = $node.prop('checked');
                    $attr.$value(value);
                    $view.$update();
                });
            }

        }];

    });
});
