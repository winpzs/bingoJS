/*
    使用方法:
    bg-include="helper.url"   //与变量绑定
    bg-include="#nodeid"   //以#开始, $('#nodeid').html()为内容
    bg-include="view/system/user/list"   //从url加载内容
*/
bingo.command('bg-include', function () {
    return ['$attr', '$domnode', '$ajax', function ($attr, $domnode, $ajax) {
        var _prop = $attr.$prop();
        //如果值为空不处理
        if (bingo.isNullEmpty(_prop)) return;

        //是否绑定变量
        var _html = function (src) {
                //src如果有#开头, 认为ID, 如:'$div1; 否则认为url, 如:tmpl/add.html
                var isPath = (src.indexOf('#') != 0);
                var html = '';
                if (isPath)
                    $ajax(src).dataType('text').cache(true).async(false).success(function (rs) { html = rs; }).get();
                else
                    html = $(src).html();

                //用$html方法, 设置html, 并自动编译
                $domnode.$html(html);
            };


        $attr.$init(function () { return $attr.$context() }, function (value) {
            var isLinkVal = !bingo.isUndefined(value);
            if (isLinkVal) {
                //如果绑定变量, 观察变量变化
                $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
                    _html(newValue);
                });
                _html(value);
            } else
                _html(_prop);//如果没有绑定变量,直接取文本
        });

    }];
});
