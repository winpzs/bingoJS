
bingo.command('bg-text', function () {

    return ['$attr', '$node', '$subscribe', function ($attr, $node, $subscribe) {
        $subscribe(function () { return $attr.$getContext(); }, function (newValue) {
            $node.text($attr.$filter(newValue));
        });
        $node.text($attr.$filter($attr.$getContext()));

    }];
});
