bingo.command('bg-html', function () {
    return ['$attr', '$node', function ($attr, $node) {
        var _set = function (val) {
            $node.html(bingo.toStr(val));
        };
        $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
            _set(newValue);
        });
        $attr.$init(function () { return $attr.$context() }, function (value) {
            _set(value);
        });

    }];
});
