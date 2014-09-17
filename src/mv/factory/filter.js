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
        getContextObjectFun: function (attrValue, withData) {

            var fn = null;
            var attT = ['{', attrValue, '}'].join('');
            var retScript = !withData ? ['return ', attT, ';'].join('') : ['with($withData){ return ', attT, '; }'].join('');
            fn = new Function('$view', '$val', '$withData', ' return (function(){ try{ with($view){' + retScript + ' }}catch(e){if (bingo.isDebug) console.error(e.message);return window.undefined;}}).call($val)');

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
        getFilterObjList: function ($view, $domnode, withData, s) {
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
                    obj.paramFn = _filter.getContextObjectFun(item, withData);
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
                        para = this.paramFn($view, bingo.isUndefined(val) ? null : val, withData);
                        para && (para = para[this.name]);
                    }
                    return this.fitlerFn(val, para);
                };
                list.push(obj);
            });
            return list;
        },
        createFilterObject: function ($view, $domnode, withData, s) {
            var filter = {};
            var hasFilter = _filter.hasFilter(s);
            filter._filters = hasFilter ? _filter.getFilterObjList($view, $domnode, withData, s) : [];
            if (filter._filters.length > 0) {
                filter.filter = function (val, withData) {
                    //过滤
                    var res = val;
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

    bingo.factory('$filter', ['$view', '$domnode', function ($view, $domnode) {
        var _widthData = $domnode && $domnode.getWithData();
        var _filterObj = null;
        var flt = function (context, withData) {
            withData && (_widthData = withData);
            _filterObj = _filter.createFilterObject($view, $domnode, _widthData, context);
            return {
                context:_filter.removerFilterString(context),
                filter: function (value, withData) {
                    return _filterObj.filter(value, withData || _widthData);
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

    bingo.filter('lt', function () {
        return function (value, para) {
            return value < para;
        };
    });

    bingo.filter('text', function () {
        return function (value, para) {
            return bingo.html();
        };
    });

    //sw:[0, 'active', ''] //true?'active':''
    bingo.filter('sw', function () {
        return function (value, para) {
            return value == para[0] ? para[1] : para[2];
        };
    });

})(bingo);