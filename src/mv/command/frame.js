
/*
    使用方法:
    bg-frame="view/system/user/list"

    连接到view/system/user/list, 目标:main
    <a href="#view/system/user/list" bg-target="main">在main加载连接</a>
    设置frame:'main'
    <div bg-frame="" bg-frame-name="main"></div>
*/
bingo.command('bg-frame', function () {
    return {
        priority: 1000,
        replace: false,
        view: true,
        compileChild: false,
        compile: ['$tmpl', '$node', '$attr', '$location', function ($tmpl, $node, $attr, $location) {
            var _lastTmpl = null;
            $location.onChange(function (url) {
                _lastTmpl && _lastTmpl.stop();
                _lastTmpl = $tmpl.fromUrl(url).appendTo($node).compilePre(function () {
                    $node.html('');
                }).compile(function () {
                    _lastTmpl = null;
                    $node.trigger('bg-frame-loaded', [url]);
                });
            });
            var url = $attr.$prop();
            url && $location.href(url);
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
