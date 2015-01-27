
(function (bingo) {
    //version 1.0.1
    "use strict";

    /*
        支持js语句, 如: ${item.name} ${document.body.childNodes[0].nodeName}
        支持if语句, 如: ${if item.isLogin} 已登录 ${else} 未登录 ${/if}
        支持foreach, 如: ${foreach item in list tmpl=idAAA} ${item_index}|${item.id}|${item_count}|${item_first}|${item_last} ${/foreach}
        支持tmpl(注释)语句, 如 ${tmpl} ${item.text} ${tmpl}
        支持过滤器, 如: ${item.name | text}, 请参考过滤器
    */

    var _renderRegx = /\$\{\s*(\/?)(if|else|foreach|tmpl)*([^}]*)\}/g;   //如果要扩展标签, 请在(if )里扩展如(if |foreach ), 保留以后扩展
    var _renderForeachRegx = /[ ]*([^ ]+)[ ]+in[ ]+([^ ]+)(?:[ ]+tmpl=([^ ]+))*/g;
    var _newItem = function (context, isIf, isEnd, isTag, $view, $domnode, isElse, isForeach) {
        var item = {
            isIf: isIf === true,
            ifReturn: true,
            isElse: isElse === true,
            isForeach: isForeach === true,
            isEnd: isEnd === true,
            isTag: isTag === true,
            context: context,
            forParam:null,
            filterContext:null,
            fn: bingo.noop,
            flt:null,
            children: []
        };
        if (item.isTag) {
            if (!item.isEnd) {
                item.filterContext = context;
                var flt = bingo.inject('$filter', $view, $domnode);
                flt = flt(context, $domnode && $domnode.getWithData());
                item.context = flt.context;
                item.flt = flt;

                if (item.isForeach) {
                    var code = item.context;
                    _renderForeachRegx.lastIndex = 0;
                    code.replace(_renderForeachRegx, function () {
                        //console.log('code', arguments);
                        var params = item.forParam = {};
                        params.itemName = arguments[1];
                        params.dataName = item.context = arguments[2];
                        params.tmpl = arguments[3];
                    });
                    //console.log('forParam', item.forParam);
                }
                item.fn = _makeCodeFunction(item.context);
            }
        }
        return item;
    };
    var _makeCodeFunction = function (evaltext) {
        if (bingo.isNullEmpty(evaltext)) return bingo.noop;
        var oldEvalText = evaltext;
        try {
            return new Function('$view, $data', [
                'try {',
                    'with ($view) {',
                        'with ($data) {',
                            'return ' + evaltext + ';',
                        '}',
                    '}',
                '} catch (e) {',
                    'return bingo.isDebug ? ("Error: " + (e.message || e)) : e.message;',
                '} finally {',
                    '$data = null;',
                '}'].join(''));
        } catch (e) {
            if (bingo.isDebug) {
                var errorM = ['Error:', e.message || e, ' render:', oldEvalText].join('');
                throw new Error(errorM);
            } else {
                return function () { return e.message; };
            }
        }
    };

    var _compile = function (s, $view, $domnode) {
        var list = [],
            pos = 0, parents = [], _isTmpl = false,
            _last = function (len) { return (len > 0) ? parents[len - 1].children : list },
            _parent = function (len) { return (len > 0) ? parents.pop().children : list };
        s.replace(_renderRegx, function (findText, f1, f2, f3, findPos, allText) {
            //console.log(findText, 'f1:' + f1, 'f2:' + f2, 'f3:' + f3, findPos);
            //return;

            //收集之前的文本
            var textItem = _newItem(allText.slice(pos, findPos));
            //console.log(arguments);

            var len = parents.length;
            //取当前列表
            var curList = _last(len);
            var isEnd = (f1 == '/');
            var isTmpl = (f2 == 'tmpl');

            //处理tmpl标签
            if (!_isTmpl) {
                _isTmpl = isTmpl;
                //curList.push(textItem);
                if (isTmpl) {
                    pos = findPos + findText.length;
                    return;
                }
            } else {
                _isTmpl != (isEnd && isTmpl);
                if (isEnd && isTmpl) {
                    curList.push(textItem);
                    _isTmpl = false;
                } else {
                    curList.push(textItem);
                    curList.push(_newItem(findText));
                }
                pos = findPos + findText.length;
                return;
            }
            //end 处理tmpl标签

            var isSpace = (f3.indexOf(' ') == 0); //第一个是否为空格, 语法空格符
            !bingo.isNullEmpty(f3) && (f3 = bingo.trim(f3));

            //else
            var isElse = (f2 == 'else')
            if (isElse) {
                if (!bingo.isNullEmpty(f3)) {
                    //如果else 有条件内容
                    if (!isSpace)
                        isElse = false;//如果没有空格, 不是else
                    else {
                        f3 = bingo.trim(f3);
                        f3 = bingo.isNullEmpty(f3) ? 'true' : f3;
                    }
                } else
                    f3 = 'true';
            }

            //if
            var isIf = (f2 == 'if' || isElse);
            //foreach
            var isForeach = (f2 == 'foreach');
            var item = _newItem(f3, isIf, isEnd, true, $view, $domnode, isElse, isForeach);


            if (isElse) {
                //返回上一级
                curList = _parent(len);
                //插入之前文本
                curList.push(textItem);
                len = parents.length;
                //取当前列表
                curList = _last(len);
                //插入项
                curList.push(item);
                //设置为父项
                parents.push(item);
            } else if (isEnd) {
                //返回上一级
                curList = _parent(len);
                //插入之前文本
                curList.push(textItem);
            } else {
                //取当前列表
                curList = _last(len);
                //插入之前文本
                curList.push(textItem);
                //插入项
                curList.push(item);
                //如果是if, 设置为父项
                (isIf || isForeach) && parents.push(item);
            }

            pos = findPos + findText.length;
        });
        if (pos < s.length) {
            list.push(_newItem(s.slice(pos)));
        }
        //console.log(JSON.stringify(list));
        return list;
    }, _renderCompile = function (compileList, view, domnode, data) {
        var list = [], perReturn = [];
        bingo.each(compileList, function (item, index) {
            if (!item.isTag)
                //text
                list.push(item.context);
            else if (!item.isEnd) {
                if (item.isForeach) {
                    var forParam = item.forParam;
                    if (!forParam) return;
                    var tmplId = forParam.tmpl;
                    var dataList = item.flt.filter(item.fn(view, data), data);
                    if (!dataList) return;
                    var html = '';
                    if (bingo.isNullEmpty(tmplId)) {
                        html = _render(item.children, view, domnode, dataList, forParam.itemName, data);
                    } else {
                        if (!item.__renderObj) {
                            html = $('#'+tmplId).html();//todo远程加载
                            if (bingo.isNullEmpty(html)) return;
                            var $render = bingo.inject('$render', view, domnode);
                            item.__renderObj = $render(html);
                        }
                        html = __renderObj.render(dataList, forParam.itemName, data);
                    }
                    list.push(html);
                } else if (item.isIf) {
                    //if
                    //console.log('if------------', item.fn(view, data));
                    if (item.isElse) {
                        //如果上一结果成功或执行条件失败跳过children, 并保存执行结果
                        if (compileList[index - 1].ifReturn || !(item.ifReturn = item.flt.filter(item.fn(view, data), data)))
                            return;
                    } else {
                        //如果执行条件失败跳过children, 并保存执行结果
                        if (!(item.ifReturn = item.flt.filter(item.fn(view, data), data))) return;
                    }
                    var str = _renderCompile(item.children, view, domnode, data);
                    list.push(str);
                } else {
                    //tag
                    var val = item.flt.filter(item.fn(view, data), data);
                    list.push(val);
                }
            }
        });
        return list.join('');
    }, _renderItem = function (compileList, view, domnode, data, itemName, itemIndex, count, outWithData) {
        var obj = outWithData;
        obj[[itemName, 'index'].join('_')] = itemIndex;
        obj[[itemName, 'count'].join('_')] = count;
        obj[[itemName, 'first'].join('_')] = (itemIndex == 0);
        obj[[itemName, 'last'].join('_')] = (itemIndex == count - 1);
        var isOdd = (itemIndex % 2 == 0);//单
        obj[[itemName, 'odd'].join('_')] = isOdd;
        obj[[itemName, 'even'].join('_')] = !isOdd;
        obj[itemName] = data;
        
        return _renderCompile(compileList, view, domnode, obj);
    }, _render = function (compileList, view, domnode, list, itemName, parentData, outWithDataList) {
        bingo.isString(itemName) || (itemName = 'item');
        bingo.isArray(list) || (list = [list]);
        var count = list.length;
        var htmls = [];
        bingo.each(list, function (item, index) {
            var outWithData = parentData ? parentData : {};
            htmls.push(_renderItem(compileList, view, domnode, item, itemName, index, count, outWithData));
            outWithDataList && outWithDataList.push(outWithData);
        });
        return htmls.join('');
    };
    //var s = '${ if ifa }1111${if ifb}2222${/if}sf\n\rsd ${/if} ${if ifc} fOK${tag} ${/if}';
    //var list = _compile(s);
    //console.log(list);


    /*
        var render = $render('<div>${item.name}</div>');
        var html = render.render([{name:'张三'}, {name:'李四'}], 'item');
        var html2 = render.render([{name:'王五'}, {name:'小六'}], 'item');
    */
    bingo.factory('$render', ['$view', '$domnode', function ($view, $domnode) {

        return function (str) {
            _renderRegx.lastIndex = 0;
            var compileList = _renderRegx.test(str) ? _compile(str, $view, $domnode) : null;
            //console.log(compileList);
            return {
                renderItem: function (data, itemName, itemIndex, count, outWithData) {
                    if (!compileList) return str;
                    return _renderItem(compileList, $view, $domnode, data, itemName, itemIndex, count, outWithData || {});
                },
                render: function (list, itemName, parentData, outWithDataList) {
                    if (!compileList) return str;
                    return _render(compileList, $view, $domnode, list, itemName, parentData, outWithDataList);
                }
            };
        };

    }]);


})(bingo);

