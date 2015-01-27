﻿
(function (bingo) {
    //version 1.0.1
    "use strict";
    var undefined;

    var _loadedJS = [], //已经加载的js
        _loadingJS = [], //加载中的js
        _squareJS = [], //预备的js
        _loadingCallback = [[],[]]; //加载中的callback

    var _inArray = function (element, list) {
        return bingo.inArray(function (item) { return bingo.isStringEquals(item, element); }, list);
    };

    var _hasJS = function (js) {
        return (_inArray(js, _loadedJS) >= 0
            || _inArray(js, _loadingJS) >= 0
            || _inArray(js, _squareJS) >= 0);
    };

    var _loadFun = function (jsList, callback, pos) {
        !bingo.isNumeric(pos) && (pos = bingo.usingPriority.Normal);

        _makeNeedList(jsList);

        _loadingCallback[pos] || (_loadingCallback[pos] = []);

        _loadingCallback[pos].push(callback);
        if (_squareJS.length > 0) {
            _loadJS();
        } else {
            //如果没有js, 或js已经加载
            setTimeout(function () {
                if (_isLoadEnd())
                    _endDone();
            }, 1);
        }
        //callback = jsList = null;
    },
    _makeNeedList = function (jsList) {
        var pathTemp = bingo.stringEmpty;
        bingo.each(jsList, function (pathItem) {
            if (bingo.isNull(pathItem)) return;
            pathTemp = bingo.route(pathItem);

            //路由
            pathTemp = _getMapPath(pathTemp);
            //如里有prdtVersion, 添加prdtVersion, query
            if (!bingo.isNullEmpty(bingo.prdtVersion))
                pathTemp = [pathTemp.indexOf('?') ? '&' : '?', prdtVersion, '=', bingo.prdtVersion];

            //js文件是否已经存在
            if (!_hasJS(pathTemp)) {
                _squareJS.push(pathTemp); //加入预备
            }

        });
    };
    //var _isloading = false;
    var _loadJS = function () {
        //console.log("_loadJS", _squareJS, _loadingJS, _loadedJS);
        if (_squareJS.length > 0) {
            var squareJSTemp = _squareJS;
            _squareJS = [];//清空_squareJS
            bingo.each(squareJSTemp, function (path) {
                _loadingJS.push(path);//放入_loadingJS
                bingo.fetch(path, _fetchCallback);
            });
        }
    };
    var _isLoadEnd = function () {
        return (_squareJS.length <= 0 && _loadingJS.length <= 0);
    };
    var _fetchTimeId = undefined;
    var _fetchCallback = function (url, id) {
        _loadedJS.push(url);//放入_loadedJS
        _loadingJS = bingo.removeArrayItem(url, _loadingJS);//从_loadingJS删除

        if (_fetchTimeId != undefined)
            clearTimeout(_fetchTimeId);
        _fetchTimeId = setTimeout(function () {
            _fetchTimeId = undefined;
            if (_isLoadEnd()) {
                _endDone();
            }
        }, 50);

    };
    var _endDone = function () {
        var isAllDone = true;
        bingo.each(_loadingCallback, function (item , pos) {
            var loadingCallbackTemp = _loadingCallback[pos];//.reverse();
            _loadingCallback[pos] = [];
            bingo.each(loadingCallbackTemp, function (callback) {
                if (bingo.isFunction(callback))
                    callback();
            });
            if (_loadingCallback[pos].length > 0) {
                isAllDone = false;
                return false;
            }
        });

        //如果没有全部运行
        if (!isAllDone) {
            //如果加载完成, 没有新的js加载
            if (_isLoadEnd()) {
                _endDone();
            }
        }
    };

    //map========================================
    var _mapList = [],    //{path:"", mapPath:""}
        _createMapItem = function (path, mapPath) {
            return { path: path, mapPath: mapPath };
        },
        _addMap = function (path, mapPath) {
            if (bingo.isNullEmpty(path) || bingo.isNullEmpty(mapPath)) return;
            path = bingo.route(path);
            mapPath = bingo.route(mapPath);
            var oldmap = _getMap(path);
            if (bingo.isNull(oldmap)) {
                _mapList.push(_createMapItem(path, mapPath));
            } else {
                oldmap.mapPath = mapPath;
            }
        },
        _getMap = function (path) {
            var index = bingo.inArray(function (item) { return bingo.isStringEquals(item.path, path); }, _mapList);
            return index >= 0 ? _mapList[index] : null;
        },
        _getMapPath = function (path) {
            var mapItem = _getMap(path);
            return (mapItem && mapItem.mapPath) || path;
        };

    
    bingo.extend({
        using: function () {
            if (arguments.length <= 0) return;
            var jsList = [];
            var callback = null;
            var pos = 0;

            var item = null;
            for (var i = 0, len = arguments.length; i < len; i++) {
                item = arguments[i];
                if (item) {
                    if (bingo.isFunction(item))
                        callback = item;
                    else if (bingo.isNumeric(item))
                        pos = item;
                    else
                        jsList.push(item);
                }
            }
            _loadFun(jsList, function () {
                callback && callback();
            }, pos);
        },
        usingMap: function (path, mapPath) {
            var len = arguments.length;
            if (len < 2) return;
            mapPath = arguments[0];
            var pathList = bingo.sliceArray(arguments, 1);
            //console.log(mapPath, pathList);
            bingo.each(pathList, function (item, index) {
                if (bingo.isNullEmpty(item)) return;
                _addMap(item, mapPath);
            });
        },
        usingPriority: {
            First: 0,
            NormalBefore: 45,
            Normal: 50,
            NormalAfter: 55,
            Last: 100
        }
    });


})(bingo);
