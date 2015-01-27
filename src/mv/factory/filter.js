(function (bingo) {
    //version 1.0.1
    "use strict";


    var _filter = {
        _filterRegex: /[|]+[ ]?([^|]+)/g,
        hasFilter: function (s) {
            this._filterRegex.lastIndex = 0;
            return this._filterRegex.test(s);
        },
        //将filte内容删除
        removerFilterString: function (s) {
            if (bingo.isNullEmpty(s) || !this.hasFilter(s)) return s;
            this._filterRegex.lastIndex = 0;
            var str = s.replace(this._filterRegex, function (find, content) { if (find.indexOf('||') == 0) return find; else return ''; });
            return bingo.trim(str);
        },
        getFilterStringList: function (s) {
            if (bingo.isNullEmpty(s) || !this.hasFilter(s)) return [];
            var filterList = [];
            this._filterRegex.lastIndex = 0;
            s.replace(this._filterRegex, function (find, content) {
                if (find.indexOf('||') != 0) filterList.push(content);
            });
            return filterList;
        },
        //取得filter参数, 'date:"yyyyMMdd"' 或 filter:{p1:1, p2:'aaa'}
        getContextObjectFun: function (attrValue) {

            var fn = null;
            var attT = ['{', attrValue, '}'].join('');
            var retScript = ['return ', attT, ';'].join('');
            fn = new Function('$view', '$data', '$withData', ' return (function(){ try{ with($view){ if (!$withData){ ' + retScript + '} else { with($withData){' + retScript + ' }} }}catch(e){if (bingo.isDebug) console.error(e.message);}}).call($data)');

            return fn;
        },
        //是否有参数
        hasFilterParam: function (s) { return (s.indexOf(':') >= 0) },
        //如果有参数, 取得参数名称
        getFilterParamName: function (s) {
            var sL = s.split(':');
            return bingo.trim(sL[0]);
        },
        //根据view取得filter器
        getFilterByView: function ($view, name) {
            var filter = null;//$view && $view.getFilter(name);
            return filter || bingo.filter(name);
        },
        //生成filter对象
        getFilterObjList: function ($view, $domnode, s) {
            var sList = this.getFilterStringList(s);
            if (sList.length == 0) return [];
            var list = [];
            bingo.each(sList, function (item) {
                item = bingo.trim(item);
                if (bingo.isNullEmpty(item)) return;
                var obj = {
                    name: null, paramFn: null, fitlerFn: null
                };
                var ftO = null;
                if (_filter.hasFilterParam(item)) {
                    obj.name = _filter.getFilterParamName(item);
                    ftO = _filter.getFilterByView($view, obj.name);
                    if (!ftO) return;
                    ftO = bingo.inject(ftO, $view, $domnode);
                    obj.paramFn = _filter.getContextObjectFun(item);
                } else {
                    obj.name = item;
                    ftO = _filter.getFilterByView($view, obj.name);
                    if (!ftO) return;
                    ftO = bingo.inject(ftO, $view, $domnode);
                }
                obj.fitlerFn = ftO;
                obj.fitler = function (val, $view, withData) {
                    if (!this.fitlerFn) return val;
                    var para = null;
                    if (this.paramFn) {
                        para = this.paramFn($view, val, withData);
                        para && (para = para[this.name]);
                    }
                    return this.fitlerFn(val, para);
                };
                list.push(obj);
            });
            return list;
        },
        createFilterObject: function ($view, $domnode, s) {
            var filter = {};
            var hasFilter = _filter.hasFilter(s);
            filter._filters = hasFilter ? _filter.getFilterObjList($view, $domnode, s) : [];
            if (filter._filters.length > 0) {
                filter.filter = function (val, withData) {
                    //过滤
                    var res = bingo.variableOf(val);
                    bingo.each(this._filters, function () {
                        res = this.fitler(res, $view, withData);
                    });
                    return res;
                };
            } else {
                filter.filter = function (val) { return val; };
            }
            return filter;
        }
    };

    bingo.factory('$filter', ['$view', '$domnode', '$withData', function ($view, $domnode, $withData) {
        //$domnode可选
        var _filterObj = null;
        var flt = function (context, withData) {
            withData && ($withData = withData);
            _filterObj = _filter.createFilterObject($view, $domnode, context);
            return {
                context:_filter.removerFilterString(context),
                filter: function (value, withData) {
                    return _filterObj.filter(value, withData || $withData);
                }
            };
        };
        return flt;
    }]);

    bingo.filter('eq', function () {
        return function (value, para) {
            return value == para;
        };
    });

    bingo.filter('neq', function () {
        return function (value, para) {
            return value != para;
        };
    });

    bingo.filter('not', function () {
        return function (value, para) {
            return !value;
        };
    });

    bingo.filter('gt', function () {
        return function (value, para) {
            return value > para;
        };
    });

    bingo.filter('gte', function () {
        return function (value, para) {
            return value >= para;
        };
    });

    bingo.filter('lt', function () {
        return function (value, para) {
            return value < para;
        };
    });

    bingo.filter('lte', function () {
        return function (value, para) {
            return value <= para;
        };
    });

    bingo.filter('text', function () {
        return function (value, para) {
            return bingo.htmlEncode(value);
        };
    });

    //sw:[0, 'active', ''] //true?'active':''
    bingo.filter('sw', function () {
        return function (value, para) {

            var len = para.length;
            var hasElse = (len % 2) == 1; //如果单数, 有else值
            var elseVal = hasElse ? para[len - 1] : '';
            hasElse && (len--);

            //sw:[1, '男', 2, '女', '保密'], '保密'为else值
            var r = null, ok = false, item;
            for (var i = 0; i < len; i += 2) {
                item = para[i];
                if (value == item) {
                    r = para[i + 1], ok = true;
                    break;
                }
            }
            return ok ? r : elseVal;
        };
    });

})(bingo);