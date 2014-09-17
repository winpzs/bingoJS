
bingo.command('bg-frame', function () {
    return {
        priority: 1000,
        replace: false,
        view: true,
        compileChild: false,
        compile: ['$tmpl', '$node', '$attr', '$location', function ($tmpl, $node, $attr, $location) {
            var url = $attr.$getValue();
            var _href = function (url) {
                $node.html('');
                var router = bingo.route(url);
                if (router) {
                    var tmplUrl = router.tmplUrl;
                    if (!bingo.isNullEmpty(tmplUrl))
                        $tmpl.formUrl(tmplUrl).appendTo($node).compile();
                }
            };
            _href(url);
            $location.change(function (url) {
                _href(url);
            });
        }]
    };
});

$(function () {
    $(document.documentElement).on('click', '[href]', function () {
        if (!bingo.location) return;
        var jo = $(this);
        var href = jo.attr('href');
        if (href.indexOf('#') >= 0) {
            var $location = bingo.location(this);
            var target = jo.attr('bg-target');
            href = href.split('#');
            href = href[href.length - 1];
            $location.href(href, target);
        }
    });
});
