
(function (bingo) {
    //version 1.0.1
    "use strict";

    var _renderReg = /[ ]*([^ ]+)[ ]+in[ ]+([^ ]+)/g;

    /*
        使用方法:
        bg-render="item in user.list"

        例:
        <select bg-render="item in list">
            ${if item.id == 1}
            <option value="${item.id}">text_${item.text}</option>
            ${else}
            <option value="${item.id}">text_${item.text}eee</option>
            ${/if}
        </select>
    */
    bingo.each(['bg-foreach', 'bg-render'], function (cmdName) {

        bingo.command(cmdName, function () {
            return {
                priority: 100,
                compileChild: false,
                link: ['$view', '$tmpl', '$node', '$attr', '$render', '$ajax', function ($view, $tmpl, $node, $attr, $render, $ajax) {

                    var code = $attr.$prop();
                    if (bingo.isNullEmpty(code)) return;
                    var _itemName = '', _dataName = '';
                    _renderReg.lastIndex = 0;
                    //分析item名称, 和数据名称
                    code.replace(/[ ]*([^ ]+)[ ]+in[ ]+([^ ]+)/g, function () {
                        _itemName = arguments[1];
                        _dataName = arguments[2];
                    });
                    if (bingo.isNullEmpty(_itemName) || bingo.isNullEmpty(_dataName)) return;
                    $attr.$prop(_dataName);

                    var renderObj = null;

                    var getRenderObj = function (html) {
                        //数组批量编译时, 要使用injectRenderItemHtml注入索引内容
                        html = $tmpl.injectRenderItemHtml(_itemName, html);
                        //console.log(html);
                        return $render(html);
                    };

                    var _renderSimple = function (datas) {

                        var jElement = $node;
                        var html = '';
                        jElement.html('');
                        if (!bingo.isArray(datas)) datas = datas ? [datas] : [];
                        var withDataList = [];//收集数据
                        html = renderObj.render(datas, _itemName, null, withDataList);
                        //console.log(withDataList);
                        //使用withDataList进行数组批量编译
                        bingo.isNullEmpty(html) || $tmpl.fromHtml(html).withDataList(withDataList).appendTo(jElement).compile();
                    };


                    var initTmpl = function () {
                        $attr.$subs(function () {
                            return $attr.$context();
                        }, function (newValue) {
                            _renderSimple(newValue);
                        }, true);
                        $attr.$init(function () { return $attr.$context() }, function (value) {
                            _renderSimple(value);
                        });
                    };

                    var tmplUrl = $node.attr('tmpl-url'), tmplNode = null;
                    if (!bingo.isNullEmpty(tmplUrl)) {
                        //从url加载
                        $ajax(tmplUrl).success(function (html) {
                            if (!bingo.isNullEmpty(html)) {
                                renderObj = getRenderObj(html);
                                initTmpl();
                            }
                        }).dataType('text').cache(true).get();
                    } else {
                        var tmplId = $node.attr('tmpl-id');
                        var html = '';
                        if (bingo.isNullEmpty(tmplId)) {
                            //从dom id加载
                            var jChild = $node.children();
                            if (jChild.size() === 1 && jChild.is('script'))
                                html = jChild.html();
                            else
                                html = $node.html();
                        } else {
                            html = $('#' + tmplId).html();
                        }
                        if (!bingo.isNullEmpty(html)) {
                            renderObj = getRenderObj(html);
                            initTmpl();
                        }
                    }

                }]
            };

        });

    });

})(bingo);

