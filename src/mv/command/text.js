
bingo.command('bg-text', function () {

    return ['$attr', '$node', function ($attr, $node) {
        var _set = function (val) {
            $node.text(bingo.toStr(val));
        };
        $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
            _set(newValue);
        });

        $attr.$init(function () { return $attr.$context() }, function (value) {
            _set(value);
        });

    }];
});
