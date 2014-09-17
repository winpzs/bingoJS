bingo.command('bg-html', function () {
    return ['$attr', '$node', '$subscribe', function ($attr, $node, $subscribe) {
        $subscribe(function () { return $attr.$getContext(); }, function (newValue) {
            $node.html($attr.$filter(newValue));
        });
        $node.html($attr.$filter($attr.$getContext()));
    }];
});
