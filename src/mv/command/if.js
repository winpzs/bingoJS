
bingo.command('bg-if', function () {
    return {
        compileChild: false,
        compile: ['$attr', '$node', '$tmpl', function compile($attr, $node, $tmpl) {
            var jo = $($node);
            var html = jo.html();
            jo.html(''); jo = null;
            $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
                if (newValue) {
                    $node.show();
                    $tmpl.fromHtml(html).appendTo($node).compile();
                } else
                    $node.html('').hide();
                //console.log('if ', newValue, html);
            });

        }]
    };
});
