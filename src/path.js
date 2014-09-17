/*
//定义方式1
    bingo.path({
        root:"/html",
        pathJS:"/html/js"
    });
//定义方式2
    bingo.path("pathStyle", "%root%/style");

//使用
    var pathDefault = bingo.path("%root%/Default.html");
    var pathJQuery = bingo.path("%pathJS%/jquery.js");
*/
(function (bingo) {
    //version 1.0.1
    "use strict";
    var _rootPathReg = /^\/|\:\/\//;
    var _absPathReg = /\:\/\//;
    var _local = /file\:\/\/\//i;
    var _paths = {};

    var _calcPath = function (url) {
        /// <summary>
        /// 计算路径中的点(.)
        /// </summary>
        /// <param name="path"></param>
        if (_absPathReg.test(url)) return url;
        if (url.indexOf(".") >= 0) {
            var isRoot = _rootPathReg.test(url);
            var pathList = url.split('/');
            var urlList = [];
            var item = "";
            var skip = 0;
            while (!bingo.isNull(item = pathList.pop())) {
                if (bingo.isNullEmpty(item) || item == ".") continue;
                if (item == "..")
                    skip++;
                else {
                    if (skip > 0) {
                        skip--;
                    } else {
                        urlList.push(item);
                    }
                }
            }
            if (urlList.length > 0) {
                url = urlList.reverse().join("/");
                //console.log(url);
                return ((isRoot ? "/" : "") + url);
            }
            return (isRoot ? "/" : "");
        }
        url = url ? url.replace("//", "/") : url;
        return url;
    },
    _makePath = function (path) {
        if (bingo.isNullEmpty(path) || path.indexOf("%") < 0) return path;
        var pathRegx = path.match(/%([^%]*)%/i);
        var pathReturn = bingo.stringEmpty;
        var pathConfig = _paths;
        if (pathRegx) {
            if (pathConfig[pathRegx[1]])
                pathReturn = _makePath(path.replace(pathRegx[0], pathConfig[pathRegx[1]]));
            else
                pathReturn = _makePath(path.replace(pathRegx[0], bingo.stringEmpty));
        }
        pathRegx = null;
        pathConfig = null;
        return pathReturn;
    };

    bingo.extend({
        getRelativePath: function (sUrl, sRelative) {
            //getRelativePath("http://www.aaa.com/html/context/aaa.aspx")   //取得绝对路径,(/html/context/)
            //getRelativePath("/html/context/aaa.aspx")
            //getRelativePath("http://www.aaa.com/html/context/aaa.aspx", "../bbb.aspx")
            //getRelativePath("http://www.aaa.com/html/context/", "../aaa.aspx")
            //getRelativePath("/html/context/", "../aaa.aspx")
            var isLocal = _local.test(sUrl);
            if (this.isNull(sRelative))
                sRelative = "";
            else if (_rootPathReg.test(sRelative)) {
                return _calcPath(sRelative);
            }

            if (!this.isNullEmpty(sUrl))
                sUrl = (isLocal ? sUrl : sUrl.replace(/^.*?\:\/[\/]+[^\/]+/, "")).replace(/[?#].*$/, "").replace(/[^\/]+$/, "");

            if (!/\/$/.test(sUrl)) { sUrl += "/"; }

            var url = sUrl + sRelative;
            url = _calcPath(url);
            if (bingo.isNullEmpty(sRelative) && !/\/$/.test(url)) { url += "/"; }
            return url;
        },
        getRelativeFile:function(url){
            return this.getRelativePath(location+"", url);
        },
        path: function (a) {
            if (this.isObject(a)) {
                this.extend(_paths, a);
            } else {
                if (arguments.length > 1) {
                    _paths[arguments[0]] = arguments[1];
                } else {
                    var urls = a.split('?');
                    a = urls[0];
                    a = _makePath(a);
                    if (urls.length > 1)
                        a += ('?' + bingo.sliceArray(urls, 1).join('?'));
                    return a;
                }
            }
        },
        isRootPath: function (path) {
            return _rootPathReg.test(path);
        }
    });

})(bingo);
