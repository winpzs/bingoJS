
bingo.command('bg-node', function () {

    return ['$attr', '$node', function ($attr, $node) {
        $attr.$datavalue($node[0]);
    }];
});
