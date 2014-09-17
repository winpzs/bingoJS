
bingo.command('bg-if', function () {
    return {
        view: false,
        compileChild: false,
        compilePre: ['$attr', '$node', '$subscribe', '$tmpl', function compile($attr, $node, $subscribe, $tmpl) {
            var jo = $($node);
            var html = jo.html();
            jo.html(''); jo = null;
            $subscribe(function () { return $attr.$getContext(); }, function (newValue) {
                if ($attr.$filter(newValue)) {
                    $tmpl.formHtml(html).appendTo($node).compile();
                } else
                    $($node).html('');
                //console.log('if ', newValue, html);
            });
        }]
    };
});
