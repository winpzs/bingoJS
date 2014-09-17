
(function (bingo) {
    //version 1.0.1
    "use strict";

    bingo.command('bg-foreach', function () {
        return {
            priority: 100,
            tmpl: '',
            tmplUrl: '',
            compileChild: false,
            link: ['$view', '$tmpl', '$node', '$attr', '$render', '$subscribe', function ($view, $tmpl, $node, $attr, $render, $subscribe) {

                var code = $attr.$getValue();
                if (bingo.isNullEmpty(code)) return;
                var _itemName = '', _dataName = '';
                //分析item名称, 和数据名称
                code.replace(/[ ]*([^ ]+)[ ]+in[ ]+([^ ]+)/g, function () {
                    _itemName = arguments[1];
                    _dataName = arguments[2];
                });
                if (bingo.isNullEmpty(_itemName) || bingo.isNullEmpty(_dataName)) return;
                $attr.$setValue(_dataName);

                var _tmplObj = null;
                var headerRender = null, footerRender = null, emptyRender = null;
                var oddRender = null, evenRender = null;
                var loadingRender = null;
                var _initTmplObj = function () {
                    var jElement = $node;

                    var jChild = jElement.children();
                    if (jChild.size() > 0) {
                        //只有一个script子节点时
                        if (jChild.size() === 1 && jChild.first().is('script')) {
                            oddRender = evenRender = $render(jChild.first().html());
                        } else {
                            var jRole = jElement.children('[tmpl-role]');
                            if (jRole.size() > 0) {
                                jRole.each(function () {
                                    var jo = $(this);
                                    var role = jo.attr('tmpl-role');
                                    switch (role) {
                                        case 'body':
                                            oddRender = evenRender = $render(jo.html());
                                            break;
                                        case 'odd':
                                            oddRender = $render(jo.html());
                                            break;
                                        case 'even':
                                            evenRender = $render(jo.html());
                                            break;
                                        case 'empty':
                                            emptyRender = $render(jo.html());
                                            break;
                                        case 'loading':
                                            loadingRender = $render(jo.html());
                                            break;
                                        case 'header':
                                            headerRender = $render(jo.html());
                                            break;
                                        case 'footer':
                                            footerRender = $render(jo.html());
                                            break;
                                    }
                                });
                            } else {
                                oddRender = evenRender = $render(jElement.html());
                            }
                        }
                    }

                };
                var _getRenderHtml = function (renderObj, data, index, count) {
                    return renderObj.render(data, _itemName, index, count);
                };

                var _renderSimple = function (datas) {
                    var jElement = $node;
                    var html = '';
                    jElement.html('');
                    if (loadingRender && !datas) {
                        //如果有loadingRender, 并数据为空
                        html = _getRenderHtml(loadingRender, {}, -1, 0);
                        !bingo.isNullEmpty(html) && $tmpl.formHtml(html).appendTo(jElement).compile();
                        return;
                    };
                    //转为数组
                    if (!bingo.isArray(datas)) datas = datas ? [datas] : [];
                    if (datas.length == 0) {
                        if (emptyRender) {
                            html = _getRenderHtml(emptyRender, {}, -1, 0);
                            !bingo.isNullEmpty(html) && $tmpl.formHtml(html).appendTo(jElement).compile();
                        }
                    } else {

                        var countT = datas.length;
                        if (headerRender) {
                            html = _getRenderHtml(headerRender, {}, -1, 0);
                            $tmpl.formHtml(html).appendTo(jElement).compile();
                        }
                        if (oddRender && evenRender) {
                            bingo.each(datas, function (item, index) {
                                if (index%2== 0)
                                    html = _getRenderHtml(oddRender, item, index, countT);//单
                                else
                                    html = _getRenderHtml(evenRender, item, index, countT);//双

                                if (!bingo.isNullEmpty(html)) {
                                    var data = {
                                        $index: index,
                                        $count: countT
                                    };
                                    data[[_itemName, 'index'].join('_')] = index;
                                    data[[_itemName, 'count'].join('_')] = countT;
                                    data[_itemName] = item;
                                    $tmpl.formHtml(html).withData(data).appendTo(jElement).compile();
                                }
                            });
                        }
                        if (footerRender) {
                            html = _getRenderHtml(footerRender, {}, -1, 0);
                            !bingo.isNullEmpty(html) && $tmpl.formHtml(html).appendTo(jElement).compile();
                        }

                    }
                    datas = null;
                };

                _initTmplObj();
                var _oldValue = $attr.$datavalue();
                var _oldLen = _oldValue ? _oldValue.length : -1;
                _renderSimple($attr.$filter(_oldValue));
                $subscribe(function () {
                    var newValue = $attr.$datavalue();
                    var len = newValue ? newValue.length : -1;
                    if (newValue != _oldValue || _oldLen != len) {
                        _oldValue = newValue;
                        _oldLen = len;
                        return true;
                    } else
                        return false;

                }, function (newValue) {
                    _renderSimple($attr.$filter(_oldValue));
                });


            }]
        };

    });

})(bingo);

