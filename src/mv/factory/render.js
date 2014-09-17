
(function (bingo) {
    //version 1.0.1
    "use strict";

    var _ifRegx = /\$\{\s*(\/?)(if)*([^}]*)\}/g;
    var _newItem = function (context, isIf, isEnd, isTag, $view, $domnode) {
        var item = {
            isIf: isIf === true,
            isEnd: isEnd === true,
            isTag: isTag === true,
            context: context,
            filterContext:null,
            fn: bingo.noop,
            flt:null,
            children: []
        };
        if (item.isTag) {
            if (!item.isEnd) {
                if (!item.isIf) {
                    item.filterContext = context;
                    var flt = bingo.inject('$filter', $view, $domnode);
                    flt = flt(context, $domnode && $domnode.getWithData());
                    item.context = flt.context;
                    item.flt = flt;
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
        var list = [];
        var pos = 0, parents = [];
        s.replace(_ifRegx, function (findText, f1, f2, f3, findPos, allText) {
            //console.log(findText, 'f1:' + f1, 'f2:' + f2, 'f3:' + f3, findPos);
            //return;

            var textItem = _newItem(allText.slice(pos, findPos));
            var isEnd = (f1 == '/');
            var isIf = (f2 == 'if');
            var item = _newItem(f3, isIf, isEnd, true, $view, $domnode);

            var len = parents.length;

            var curList = null;
            if (isEnd) {
                if (len > 0) {
                    curList = parents.pop().children;
                    len--;
                } else
                    curList = list;
                curList.push(textItem);
                !isIf && curList.push(item);
            } else {
                var curList = (len > 0) ? parents[len - 1].children : list;
                curList.push(textItem);
                curList.push(item);
                isIf && parents.push(item);
            }

            pos = findPos + findText.length;
        });
        if (pos < s.length) {
            list.push(_newItem(s.slice(pos)));
        }
        return list;
    }, _renderCompile = function (compileList, view, data) {
        var list = [];
        bingo.each(compileList, function (item) {
            if (!item.isTag)
                //text
                list.push(item.context);
            else if (!item.isEnd) {
                if (item.isIf) {
                    //if
                    //console.log('if------------', item.fn(view, data));
                    if (!item.fn(view, data)) return false;
                    var str = _renderCompile(item.children, view, data);
                    list.push(str);
                } else {
                    //tag
                    var val = item.flt.filter(item.fn(view, data), data);
                    list.push(val);
                }
            }
        });
        return list.join('');
    }, _render = function (compileList, view, data, itemName, itemIndex, count) {
        var obj = {
            $index: itemIndex,
            $count: count
        };
        obj[[itemName, 'index'].join('_')] = itemIndex;
        obj[[itemName, 'count'].join('_')] = count;
        obj[itemName] = data;
        return _renderCompile(compileList, view, obj);
    };
    //var s = '${ if ifa }1111${if ifb}2222${/if}sf\n\rsd ${/if} ${if ifc} fOK${tag} ${/if}';
    //var list = _compile(s);
    //console.log(list);

    bingo.factory('$render', ['$view', '$domnode', function ($view, $domnode) {

        return function (str) {
            _ifRegx.lastIndex = 0;
            var compileList = _ifRegx.test(str) ? _compile(str, $view, $domnode) : null;
            return {
                render: function (data, itemName, itemIndex, count) {
                    if (!compileList) return str;
                    return _render(compileList, $view, data, itemName, itemIndex, count);
                }
            };
        };

    }]);


})(bingo);

