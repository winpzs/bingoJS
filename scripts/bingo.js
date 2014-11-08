
(window.console && window.console.log) || (window.console = { log: function () { }, error: function () { }, info: function () { }, table: function () { } });
(function () {
    //version 1.0.1
    "use strict";

    var stringEmpty = "",
        toString = Object.prototype.toString,
        noop = function () { },
        undefined;

    var _htmlDivTarget = null,
    _getHtmlDivTarget = function () {
        if (_htmlDivTarget == null)
            _htmlDivTarget = $('<div style="display:none"></div>').appendTo(document.body);
        return _htmlDivTarget;
    };

    var _makeAutoIdTemp = 0, _makeAutoIdTempPointer = 0;

    var bingo = window.bingo = window.bingo = {
        isDebug: false,
        prdtVersion: '',
        stringEmpty: stringEmpty,
        noop: noop,
        newLine: "\r\n",
        isType: function (typename, value) {
            //typename:String, Array, Boolean, Object, RegExp, Date, Function,Number //兼容
            //typename:Null, Undefined,Arguments    //IE不兼容
            return toString.apply(value) === '[object ' + typename + ']';
        },
        isUndefined: function (obj) {
            ///<summary>是否定义</summary>

            return (typeof (obj) === "undefined" || obj === undefined);
        },
        isNull: function (obj) {
            ///<summary>是否Null</summary>

            return (obj === null || this.isUndefined(obj));
        },
        isBoolean: function (obj) {
            return this.isType("Boolean", obj);
        },
        isNullEmpty: function (s) {
            return (this.isNull(s) || s === stringEmpty);
        },
        isFunction: function (fun) {
            return this.isType("Function", fun);
        },
        isNumeric: function (n) {
            //return this.isType("Number", n) && !isNaN(n) && isFinite(n);;
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        isString: function (obj) {
            return this.isType("String", obj);
        },
        isObject: function (obj) {
            return !this.isNull(obj) && this.isType("Object", obj);
        },
        isArray: function (value) {
            return Array.isArray ? Array.isArray(value) : this.isType("Array", value);
        },
        isWindow: function (obj) { return !this.isNull(obj) && obj == obj.window; },
        isElement: function (obj) { var t = obj && (obj.ownerDocument || obj).documentElement; return t ? true : false; },
        trim: function (str) {
            return this.isString(str) ? str.replace(/(^\s*)|(\s*$)/g, '') : '';
        },
        isStringEquals: function (str1, str2) {
            ///<summary>字串是否相等, 不分大小写</summary>

            if (str1 == str2) return true;
            if (!this.isString(str1) || !this.isString(str2)) return false;
            return (str1.toUpperCase() == str2.toUpperCase());
        },
        inArray: function (element, list) {
            if (list) {
                //if (list.indexOf) return list.indexOf(element);
                var callback = this.isFunction(element) ? element : null;
                for (var i = 0, len = list.length; i < len; i++) {
                    if (callback) {
                        element = list[i];
                        if (callback.call(element, element, i)) return i;
                    } else if (list[i] === element)
                        return i;
                }
            }
            return -1;
        },
        removeArrayItem: function (element, list) {
            var list1 = [];
            for (var i = 0, len = list.length; i < len; i++) {
                if (list[i] != element)
                    list1.push(list[i]);
            }
            return list1;
        },
        sliceArray: function (args, pos, count) {
            isNaN(pos) && (pos = 0);
            isNaN(count) && (count = args.length);
            return Array.prototype.slice.call(args, pos, pos + count);
        },
        makeAutoId: function () {
            var time = new Date().valueOf();
            _makeAutoIdTempPointer = (time === _makeAutoIdTemp) ? _makeAutoIdTempPointer + 1 : 0;
            _makeAutoIdTemp = time;
            return [time, _makeAutoIdTempPointer].join('_');
        },
        each: function (list, callback) {
            //callback(data, index){this === data;}
            if (this.isNull(list)) return;
            var temp = null;
            for (var i = 0, len = list.length; i < len; i++) {
                temp = list[i];
                if (callback.call(temp, temp, i) === false) break;
            }
        },
        htmlEncode: function (str) {
            if (this.isNullEmpty(str)) return "";
            var jo = _getHtmlDivTarget();
            jo.text(str);
            str = jo.html();
            return str;
        },
        htmlDecode: function (str) {
            if (this.isNullEmpty(str)) return "";
            var jo = _getHtmlDivTarget();
            jo.html(str);
            var hs = jo.text();
            return hs;
        },
        urlEncode: function (str) {
            if (this.isNullEmpty(str)) return "";
            return encodeURI(str);
        },
        urlDecode: function (str) {
            if (this.isNullEmpty(str)) return "";
            return decodeURI(str);
        },
        clearObject: function (obj) {
            for (var i = 0, len = arguments.length; i < len; i++) {
                obj = arguments[i];
                for (var n in obj) {
                    obj[n] = null;
                    //delete obj[n];
                }
            }
        },
        extend: function (obj) {
            var len = arguments.length;
            if (len <= 0) return obj;
            if (len == 1) {
                for (var n0 in obj) {
                    obj.hasOwnProperty(n0) && (this[n0] = obj[n0]);
                }
                return this;
            }
            var ot = null;
            for (var i = 1; i < len; i++) {
                ot = arguments[i];
                if (!this.isNull(ot)) {
                    for (var n in ot) {
                        ot.hasOwnProperty(n) && (obj[n] = ot[n]);
                    }
                }
            }
            return obj;
        },
        clone: function (obj, deep) {
            return _clone.clone(obj, deep);
        }
    };

    var _clone = {
        isCloneObject: function (obj) {
            return bingo.isObject(obj) && !bingo.isWindow(obj) && !bingo.isElement(obj);
        },
        clone: function (obj, deep) {
            if (!obj)
                return obj;
            else if (bingo.isArray(obj))
                return this.cloneArray(obj, deep);
            else if (this.isCloneObject(obj))
                return this.cloneObject(obj, deep);
            else
                return obj;
        },
        cloneObject: function (obj, deep) {
            var to = {};
            var t = null;
            for (var n in obj) {
                if (obj.hasOwnProperty(n)){
                    t = obj[n];
                    if (deep !== false) {
                        t = this.clone(t, deep);
                    }
                    to[n] = t;
                }
            }
            t = null;
            return to;
        },
        cloneArray: function (list, deep) {
            var lt = [];
            var t = null;
            var len = list.length;
            for (var i = 0; i < len; i++) {
                t = list[i];
                if (deep !== false) {
                    t = this.clone(t, deep);
                }
                lt.push(t);
            }
            return lt;
        }
    };


})();
(function (bingo) {
    //version 1.0.1
    "use strict";

    var _getDataAttrRegex = /[\[\.]?[\'\"]?([^\[\]\.\'\"]+)[\'\"]?[\]\.]?/g;
    var _getAttrList = function (name) {
        _getDataAttrRegex.lastIndex = 0;
        var attrList = [];
        name.replace(_getDataAttrRegex, function (find, attrName, findPos, allText) {
            if (_isArrayAttr(find) && attrList.length > 0)
                attrList[attrList.length - 1].isArray = true;
            attrList.push({ attrname: attrName, isArray: false });
        });
        return attrList;
    };
    var _setDataValue = function (data, name, value) {
        if (!data || bingo.isNullEmpty(name)) return;
        if (name.indexOf('.') < 0 && name.indexOf(']') < 0) { data[name] = value; }

        var attrList = _getAttrList(name);

        var to = data, item = null;
        var len = attrList.length - 1;
        var nameItem = null;
        for (var i = 0; i < len; i++) {
            item = attrList[i];
            nameItem = item.attrname;
            if (bingo.isNull(to[nameItem])) {
                to[nameItem] = item.isArray ? [] : {};
            }
            to = to[nameItem];
        }
        nameItem = attrList[len].attrname;
        to[nameItem] = value;

    }, _isArrayAttr = function (find) { return find.indexOf(']') >= 0 && (find.indexOf('"') < 0 && find.indexOf("'") < 0); };

    var _getDataValue = function (data, name) {
        if (!data || bingo.isNullEmpty(name)) return;
        if (name.indexOf('.') < 0 && name.indexOf(']') < 0) return data[name];

        var attrList = _getAttrList(name);

        var to = data, item = null;
        var len = attrList.length - 1;
        var nameItem = null;
        for (var i = 0; i < len; i++) {
            item = attrList[i];
            nameItem = item.attrname;
            if (bingo.isNull(to[nameItem])) {
                return to[nameItem];
            }
            to = to[nameItem];
        }
        nameItem = attrList[len].attrname;
        return to[nameItem];
    };

    bingo.extend({
        datavalue: function (data, name, value) {
            if (arguments.length >= 3) {
                _setDataValue(data, name, value);
            } else {
                return _getDataValue(data, name);
            }
        }
    });

})(bingo);
; (function (bingo) {
    //version 1.0.1
    "use strict";

    bingo.Event = function (owner, eList) {

        var eventList = eList || [];
        var $this = owner;
        var eventF = function (callback) {
            $this || ($this = this);
            callback && eventF.on(callback);
            return arguments.length == 0 ? eventF : $this;
        };

        bingo.extend(eventF, {
            on: function (callback) {
                callback && eventList.push({ one: false, callback: callback });
                return this;
            },
            one: function (callback) {
                callback && eventList.push({ one: true, callback: callback });
                return this;
            },
            off: function (callback) {
                if (callback) {
                    var list = [];
                    bingo.each(eventList, function () {
                        if (this.callback != callback)
                            list.push(this);
                    });
                    eventList = list;
                } else { eventList = []; }
                return this;
            },
            trigger: function () {
                var list = eventList, ret = null, eventObj = null, reList = null;
                for (var i = 0, len = list.length; i < len; i++) {
                    eventObj = list[i];
                    if (eventObj.one === true) {
                        reList || (reList = eventList);
                        reList = bingo.removeArrayItem(eventObj, reList);
                    }
                    if ((ret = eventObj.callback.apply($this, arguments)) === false) break;
                }
                reList && (eventList = reList);
                return this;
            },
            triggerHandler: function () {
                var list = eventList, eventObj = null;
                if (list.length == 0) return;
                eventObj = list[0];
                var ret = eventObj.callback.apply($this, arguments);
                if (eventObj.one === true)
                    eventList = bingo.removeArrayItem(eventObj, eventList);
                return ret;
            },
            clone: function () {
                return bingo.Event(owner, eventList);
            },
            owner: function () { return $this;}
        });



        return eventF;
    };

})(bingo);

(function (bingo) {
    //version 1.0.1
    "use strict";

    //bingo.Class=============================================
    var _NewObject_define_String = "NewObject_define";
    var _defineClass = function (define, baseDefine) {
        this._define = define;
        if (baseDefine) this._Base(baseDefine);
    };
    _defineClass.prototype._Base = function (baseDefine) {
        var define = this._define;
        define.prototype = new baseDefine(_NewObject_define_String);
        define.prototype.constructor = define;
        var _property = define.prototype._property;
        if (_property) {
            define.prototype._property = {};
            //_extendObj(define.prototype._property, _property);
            _extendObj2(define.prototype._property, _property, define.prototype);
        }
        define.prototype.base = function () {
            this.base = bingo.noop;
            baseDefine.prototype._Initialization.apply(this, arguments);
        };
        //return new baseDefine(_NewObject_define_String);
    };
    _defineClass.prototype.Property = function (o) {
        var define = this._define;
        if (!define.prototype._property) define.prototype._property = {};
        //_extendObj(define.prototype._property, o);
        _extendObj2(define.prototype._property, o, define.prototype);
        return this;
    };
    _defineClass.prototype.Define = function (o) {
        var define = this._define;
        _extendObj(define.prototype, o);
        return this;
    };
    _defineClass.prototype.Extend = function (o) {
        var define = this._define;
        _extendObj(define.prototype, o);
        return this;
    };
    _defineClass.prototype.Initialization = function (callback) {
        var define = this._define;
        define.prototype._Initialization = callback;
        return this;
    };
    _defineClass.prototype.Static = function (o) {
        var define = this._define;
        _extendObj(define, o);
        return this;
    };
    _defineClass.prototype.Variable = function (o) {
        var define = this._define.prototype;
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                define[n] = _makeVarFn(o[n], n);
            }
        }
        return this;
    };

    var _makeVarFn = function (defaultValue, n) {
        var fn = function (value) {
            var _variable = this._variable;
            if (!(n in _variable)) _variable[n] = defaultValue;
            if (arguments.length == 0)
                return _variable[n];
            else {
                _variable[n] = arguments[0];
                return this;
            }
        };
        return fn;
    }

    var _extendObj = function (src, dest) {
        for (var n in dest) {
            if (dest.hasOwnProperty(n)) {
                src[n] = dest[n];
            }
        }
    }, _extendObj2 = function (src, dest, srcDefine) {
        for (var n in dest) {
            if (dest.hasOwnProperty(n)) {
                if (bingo.isObject(dest[n]) || bingo.isArray(dest[n]))
                    src[n] = dest[n];
                else
                    srcDefine[n] = dest[n];
            }
        }
    };

    var _makeDefine = function (defineName, define) {
        var list = defineName.split('.');
        var ot = window;
        var n = "";
        var len = list.length - 1;
        for (var i = 0; i < len; i++) {
            n = list[i];
            if (!bingo.isNullEmpty(n)) {
                if (bingo.isNull(ot[n]))
                    ot[n] = {};
                ot = ot[n];
            }
        }

        //将原来的了级定义复制到新
        if (ot[list[len]])
            _copyDefine(ot[list[len]], define);

        return ot[list[len]] = define;
    },
    _copyDefine = function (source, target) {
        for (var n in source)
            if (source.hasOwnProperty(n) && !target.hasOwnProperty(n))
                target[n] = source[n];
    };


    bingo.Class = function (defineName, baseDefine, func) {
        if (arguments.length <= 2) {
            if (this.isFunction(defineName)) {
                if (this.isFunction(baseDefine)) {
                    func = baseDefine;
                    baseDefine = defineName;
                } else {
                    func = defineName;
                    baseDefine = null;
                }
                defineName = this.stringEmpty;
            }
        }

        var define = function () { if (arguments[0] != _NewObject_define_String) return define.NewObject.apply(window, arguments); };
        //var initFun = $pcode.noop;
        define.prototype._Initialization = bingo.noop;
        define.extend = function (obj) {
            _extendObj(define.prototype, obj);
        };
        define.NewObject = function () {
            var obj = new define(_NewObject_define_String);
            if (obj._property) {
                var propertys = bingo.clone(obj._property);
                _extendObj(obj, propertys);
            }
            obj._variable = {};
            obj._Initialization.apply(obj, arguments);
            obj._Initialization = bingo.noop;
            return obj;
        };
        //define.prototype.prop = function (props) {
        //    if (arguments.length == 0) {
        //        var props = this._property;
        //        var obj = {};
        //        for (var n in props) {
        //            if (props.hasOwnProperty(n)) {
        //                obj[n] = this[n];
        //            }
        //        }
        //        return obj;
        //    } else {
        //        _extendObj(this, propertys);
        //        return this;
        //    }
        //};

        define.prototype.on = function (name, callback) {
            if (name && callback) {
                this.__events__ || (this.__events__ = {});
                var events = this.__events__;
                events[name] || (events[name] = bingo.Event(this));
                events[name].on(callback);
            }
            return this;
        };
        define.prototype.trigger = function (name) {
            if (this.__events__) {
                var events = this.__events__;
                var argLists = arguments.length > 1 ? arguments[1] : [];
                events[name] && events[name]().trigger.apply(this, argLists);
            }
            return this;
        };

        //define.prototype.clone = function () {
        //    var obj = define.NewObject.apply(window, arguments);
        //    var prop = this.prop();
        //    obj.prop(prop);
        //    return obj;
        //};

        define.prototype.isDisposed = false;
        define.prototype.dispose = function () {
            if (!this.isDisposed) {
                try{
                    this.__onDispose_131113 && this.__onDispose_131113().trigger();
                } finally {
                    //this._property && bingo.clearObject(this._property);
                    bingo.clearObject(this);
                    this.isDisposed = true;
                    this.dispose = bingo.noop;
                }
            }
        };
        define.prototype.onDispose = function (callback) {
            this.__onDispose_131113 || (this.__onDispose_131113 = bingo.Event());
            return this.__onDispose_131113.apply(this, arguments);
        };
        define.prototype.disposeByOther = function (obj) {
            if (obj.dispose && !obj.isDisposed) {
                var that = this;

                var oDisp = function () { that.dispose(); };
                obj.onDispose(oDisp);
                this.onDispose(function () {
                    obj.isDisposed || (obj.onDispose().off(oDisp));
                });
            }
            return this;
        };

        var defineObj = new _defineClass(define, baseDefine);
        func && func.call(defineObj);
        defineObj = null;

        if (!bingo.isNullEmpty(defineName))
            _makeDefine(defineName, define);
        return define;
    };

    bingo.Class.makeDefine = function (defineName, define) { _makeDefine(defineName, define); };


})(bingo);
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

(function (bingo) {
    //version 1.0.1
    "use strict";

    var doc = window.document;
    var head = doc.head ||
      doc.getElementsByTagName('head')[0] ||
      doc.documentElement;
    var baseElement = head.getElementsByTagName('base')[0];

    var READY_STATE_RE = /loaded|complete|undefined/i;
    var isSCRIPT = /SCRIPT/i;

    var fetch = function (url, callback, id, charset) {

        //如果是css创建节点 link  否则 则创建script节点
        var node = doc.createElement('script');
        node.importurl = url;
        node.imporid = id || bingo.makeAutoId();
        node.async = 'async';
        node.src = url;

        if (charset) {
            var cs = bingo.isFunction(charset) ? charset(url) : charset;
            cs && (node.charset = cs);
        }

        //scriptOnload执行完毕后执行callback ，如果自定义callback为空，则赋予noop 为空函数
        scriptOnload(node, callback || bingo.noop);


        // For some cache cases in IE 6-9, the script executes IMMEDIATELY after
        // the end of the insertBefore execution, so use `currentlyAddingScript`
        // to hold current node, for deriving url in `define`.
        // 之下这些代码都是为了兼容ie 
        // 假如A页面在含有base标签，此时A页面有个按钮具有请求B页面的功能，并且请求过来的内容将插入到A页面的某个div中
        // B页面有一些div，并且包含一个可执行的script
        // 其他浏览器都会在异步请求完毕插入页面后执行该script 但是 ie 不行，必须要插入到base标签前。
        //currentlyAddingScript = node;

        // ref: #185 & http://dev.jquery.com/ticket/2709 
        // 关于base 标签 http://www.w3schools.com/tags/tag_base.asp

        baseElement ?
            head.insertBefore(node, baseElement) :
            head.appendChild(node);

        return id;
    },
    scriptOnload = function (node, callback) {
        // onload为IE6-9/OP下创建CSS的时候，或IE9/OP/FF/Webkit下创建JS的时候  
        // onreadystatechange为IE6-9/OP下创建CSS或JS的时候

        var loadedFun = function () {
            if (!node) return;
            //正则匹配node的状态
            //readyState == "loaded" 为IE/OP下创建JS的时候
            //readyState == "complete" 为IE下创建CSS的时候 -》在js中做这个正则判断略显多余
            //readyState == "undefined" 为除此之外浏览器
            if (READY_STATE_RE.test(node.readyState)) {

                // Ensure only run once and handle memory leak in IE
                // 配合 node = undefined 使用 主要用来确保其只被执行一次 并 处理了IE 可能会导致的内存泄露
                node.onload = node.onerror = node.onreadystatechange = null;

                // Remove the script to reduce memory leak
                // 在存在父节点并出于isDebug移除node节点
                if (!bingo.isDebug && node.parentNode) {
                    node.parentNode.removeChild(node);
                }

                setTimeout(function () {
                    if (!node) return;
                    try {
                        //执行回调
                        callback && callback(node.importurl, node.imporid, node);
                    } finally {

                        // Dereference the node
                        // 废弃节点，这个做法其实有点巧妙，对于某些浏览器可能同时支持onload或者onreadystatechange的情况，只要支持其中一种并执行完一次之后，把node释放，巧妙实现了可能会触发多次回调的情况
                        node = undefined;
                        callback = null;
                    }
                }, 5);
            }
        };

        node.onload = node.onerror = node.onreadystatechange = function () {
            loadedFun();
        };

    };

    bingo.extend({
        fetch: function (url, callback, id, charset) {
            /// <summary>
            /// callback(url, node);
            /// </summary>
            /// <param name="url"></param>
            /// <param name="callback"></param>
            /// <param name="charset"></param>
            return fetch(url, callback, id, charset);
            callback = null;
        }
    });

})(bingo);
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
        !bingo.isNumeric(pos) && (pos = bingo.env.Normal);

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
    _pathAbs = bingo.getRelativePath(window.location + bingo.stringEmpty),
    _makeNeedList = function (jsList) {
        var pathAbs = _pathAbs;
        var pathTemp = bingo.stringEmpty;
        bingo.each(jsList, function (pathItem) {
            if (bingo.isNull(pathItem)) return;
            pathTemp = bingo.path(pathItem);
            if (bingo.isRootPath(pathTemp)) {
                //如果是相对根目录, 保存
                pathAbs = pathTemp;
            } else {
                //如果不是相对根目录, 相对于上一个目录
                pathTemp = bingo.getRelativePath(pathAbs, pathTemp);
            }

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
            path = bingo.path(path);
            mapPath = bingo.path(mapPath);
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
        }
    });


    //define========================================================

    var _extendObj = function (obj, extObj) {
        for (var n in extObj) {
            if (extObj.hasOwnProperty(n)) {
                obj[n] = extObj[n];
            }
        }
    };

    var _DEFINE = "bingo_define_91";
    bingo.extend({
        isDefine: function (define) { return define._DEFINE === _DEFINE; },
        define: function () {
            var baseDefineFn = null;
            var defineFn = null;
            var defineName = null;

            var item = null;
            for (var i = 0, len = arguments.length; i < len; i++) {
                item = arguments[i];
                if (item) {
                    if (this.isDefine(item))
                        baseDefineFn = item;
                    else if (this.isFunction(item))
                        defineFn = item;
                    else if (this.isString(item))
                        defineName = item;
                }
            }

            var define = function () {

                var envObj = _defineClass.NewObject(defineName);
                envObj.base = function () {
                    if (baseDefineFn && baseDefineFn._DEFINE_FN) {
                        baseDefineFn._DEFINE_FN.apply(envObj, arguments);
                    }
                };

                defineFn && defineFn.apply(envObj, arguments);
                if (define._EXTEND)
                    _extendObj(envObj, define._EXTEND);


                return envObj;
            };
            define._DEFINE = _DEFINE;
            define._DEFINE_FN = defineFn;

            define.extend = function (obj) {
                define._EXTEND || (define._EXTEND = {});
                _extendObj(define._EXTEND, obj || {});
            }

            defineName && this.Class.makeDefine(defineName, define);
            return define;
        },
        env: function (callback, priority) {
            if (!this.isFunction(callback)) return;

            bingo.using(function () {
                var envObj = _defineClass.NewObject('_env_');
                callback && callback.call(envObj);
            },  this.isNumeric(priority) ? priority : this.envPriority.Normal);

        }
    });

    var _defineClass = bingo.Class(function () {

        this.Initialization(function (defineName) {
            this.$defineName = defineName;
        });
    });


    bingo.envPriority = {
        First: 0,
        NormalBefore: 45,
        Normal: 50,
        NormalAfter: 55,
        Last: 100
    };

})(bingo);

; (function (bingo) {
    //version 1.0.1
    "use strict";

    var _equals = function (p1, p2) {
        if ((bingo.isNull(p1) || bingo.isNull(p2)) && p1 !== p2)
            return false;
        if (bingo.isArray(p1)) {
            return _ArrayEquals(p1, p2);
        } else if (p1 instanceof RegExp) {
            return _RegExpEquals(p1, p2);
        } else if (bingo.isFunction(p1)){
            return (bingo.isFunction(p2) && p1.valueOf() === p2.valueOf());
        } else if (bingo.isObject(p1)) {
            return _ObjectEquals(p1, p2);
        } else {
            return ((typeof (p1) === typeof (p2)) && (p1 === p2));
        }
    }

    var _RegExpEquals = function (reg1, reg2) {
        return (reg2 instanceof RegExp) &&
         (reg1.source === reg2.source) &&
         (reg1.global === reg2.global) &&
         (reg1.ignoreCase === reg2.ignoreCase) &&
         (reg1.multiline === reg2.multiline);
    };

    var _ArrayEquals = function (arr1, arr2) {
        if (arr1 === arr2) { return true; }
        if (!bingo.isArray(arr2) || arr1.length != arr2.length) { return false; } // null is not instanceof Object.
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (!_equals(arr1[i], arr2[i])) return false;
        }
        return true;
    };

    var _ObjectEquals = function (obj1, obj2) {
        if (obj1 === obj2) { return true; }
        if (!bingo.isObject(obj2)) { return false; }
        var count = 0;
        for (var n in obj1) {
            count++;
            if (!_equals(obj1[n], obj2[n])) return false;
        }
        for (var nn in obj2) count--;
        return (count === 0);
    };

    bingo.extend({
        equals: function (o1, o2) {
            return _equals(o1, o2);
        }
    });
//    var o = { a: 1, b: 1, c: [1, { a: 22 }, 2], d:1, f:new Date(1, 2, 3), e:/ab/g};
//    var o1 = { a: 1, b: 1, c: [1, { a: 22}, 2], d:1, f:new Date(1, 2,3), e:/a/g};
//    console.log("equals", bingo.equals(o, o1));

})(bingo);
(function (bingo) {
    //version 1.0.1
    "use strict";

    bingo.extend({
        linkToDom: function (jSelector, callback) {
            return _addLink(jSelector, callback);
        },
        isUnload: false
    });
    bingo.linkToDom.LinkToDomClass = bingo.Class(function () {

        this.Define({
            linkToDom: function (jqSelector) {
                this.unlinkToDom();
                var $this = this;
                this._linkToDomObject = bingo.linkToDom(jqSelector, function () {
                    try{
                        $this.dispose && $this.dispose();
                    } finally {
                        jqSelector = $this._linkToDomObject = null;
                        $this = null;
                    }
                });
                return this;
            },
            unlinkToDom: function () {
                this._linkToDomObject && this._linkToDomObject.unlink();
                this._linkToDomObject = null;
                return this;
            }
        });

        this.Initialization(function () {

            this.onDispose(function () {
                this.unlinkToDom();
            });

        });
    });


    //断开连接， 但不确发callback
    var _unlink = function () {
        this.callback = bingo.noop;
        if (this.target) {
            this.target.removeData(this.id);
            this.target.off("linkRemove.linkdom");
            this.target = null;
        }
    };
    //断开连接， 并确发callback
    var _disconnect = function () {
        _disconnectByLink(this);
    };

    var _disconnectByLink = function (link) {
        if (link && link.target) {
            var callback = link.callback;
            _unlink.call(link);
            callback();
        }
    };


    var _cleanData = $.cleanData;
    $.cleanData = function (elems) {
        //console.log(elems);
        for (var i = 0, elem; (elem = elems[i]) != null; i++) {
            try {
                $(elem).triggerHandler("linkRemove.linkdom");
            } catch (e) { }
        }
        _cleanData.apply($, arguments);
    };
    

    var _autoId = 0;
    var _addLink = function (jSelector, callback) {
        if (bingo.isFunction(callback)) {
            var jTarget = $(jSelector);
            if (!bingo.isUnload && jTarget.length > 0) {
                if (_autoId > Number.MAX_VALUE) _autoId = 0;
                _autoId++;
                var link = { id: "linkToDom_130102_" + _autoId, target: jTarget, callback: callback, unlink: _unlink, disconnect: _disconnect };
                jTarget.data(link.id, "T");
                jTarget.one("linkRemove.linkdom", function (e) { _disconnectByLink(link); });
                return link;
            } else {
                callback();
            }
        }
        return null;
    };

    $(window).unload(function () {
        bingo.isUnload = true;
    });

})(bingo);//todo:
; (function (bingo) {
    //version 1.0.1
    "use strict";

    var _factory = {}, _factoryExtend = [], _service = {}, _command = {}, _filter = {}, _module = {};
    var _rootView = null;
    
    var _injectNoop = function () { };
    _injectNoop.$injects = [];

    var _makeInjectAttrRegx = /^\s*function[^(]*?\(([^)]+?)\)/i,
    _makeInjectAttrs = function (p) {
        if (p && p.$injects) return p;
        var fn = _injectNoop;
        if (bingo.isArray(p)) {
            fn = p.pop();
            fn.$injects = p;
        } else if (bingo.isFunction(p)) {
            fn = p;
            var s = fn.toString();
            var list = [];
            s.replace(_makeInjectAttrRegx, function (findText, find0) {
                if (find0) {
                    bingo.each(find0.split(','), function (item) {
                        item = bingo.trim(item);
                        item && list.push(item);
                    });
                }
            });
            fn.$injects = list;
        };
        return fn;
    },
    //取得注入: _inject('$view', $view, $domnode, $attr, node, {}, {}); //$view为必要, 其它为可选
    _inject = function (p, view, domnode, attr, node, para, injectObj) {

        injectObj = injectObj || {};
        var fn = null;
        if (bingo.isString(p)) {
            //如果是字串
            if (p in injectObj) {
                //如果已经存在
                return injectObj[p];
            }
            injectObj[p] = {};
            fn = bingo.factory(p);
            (!bingo.isFunction(fn)) && (fn = bingo.service(p));
            if (!fn) return {};
        } else
            fn = p;

        var $injects = fn.$injects;
        var injectParams = [];
        if ($injects && $injects.length > 0) {
            if (!injectObj.$view) {
                injectObj.$view = view || bingo.rootView();
                injectObj.$module = injectObj.$view._module;
                injectObj.$domnode = domnode;
                injectObj.node = node ? node : (domnode ? domnode.node : view.node);
                injectObj.$attr = attr;
                injectObj.$injectParam = para;
                injectObj.$command = attr ? attr.command : null;
            }
            //bingo.isString(p) && (injectObj[p] = {});

            var pTemp = null;
            bingo.each($injects, function (item) {
                if (item in injectObj) {
                    pTemp = injectObj[item];
                } else {
                    //injectObj[item] = {};//防止循环引用
                    pTemp = injectObj[item] = _inject(item, view, domnode, attr, node, para, injectObj);
                }
                injectParams.push(pTemp);
            });
        }

        var ret = fn.apply(injectObj.$module || injectObj.$view, injectParams) || {};
        bingo.isString(p) && (injectObj[p] = ret);

        //如果injectObj为null, 扩展
        injectObj || _injectExtend(view, domnode, attr, node, para, injectObj);
        return ret;
    },
    _injectExtend = function (view, domnode, attr, node, para, injectObj) {
        bingo.each(_factoryExtend, function (item) {
            _inject(item, view, domnode, attr, node, para, injectObj);
        });
    };

    //console.log(_makeInjectAttrs(function ($ddd, asdf, aaaa) { }));
    //console.log(_makeInjectAttrs(function ($ddd, userServer, $http) { }));

    bingo.extend({
        //工厂
        factory: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            if (arguments.length == 1)
                return _factory[name];
            else
                _factory[name] = _makeInjectAttrs(fn);
        },
        //工厂扩展
        factoryExtend: function (fn) {
            bingo.isFunction(fn) & _factoryExtend.push(_makeInjectAttrs(fn));
        },
        //过滤器
        filter: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            if (arguments.length == 1)
                return _filter[name];
            else
                _filter[name] = _makeInjectAttrs(fn);
        },
        //标签指令
        command: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            name = name.toLowerCase();
            if (arguments.length == 1)
                return _command[name];
            else
                _command[name] = _makeInjectAttrs(fn);
        },
        //模块
        module: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            var module = null;
            if (arguments.length == 1)
                module = _module[name];
            if (!module) {
                module = _module[name] = function (view) {
                    var obj = _moduleClass.NewObject();
                    obj.disposeByOther(view);
                    bingo.extend(obj._controllers, module._controllers);
                    view._module = obj;
                    bingo.inject(module._injectFn, view);
                    return obj;
                };
                module._injectFn = _makeInjectAttrs(fn);
                module._controllers = {};
                module.controller = function (name, fn) {
                    if (arguments.length == 1)
                        return this._controllers[name];
                    this._controllers[name] = _makeInjectAttrs(fn);
                    return this;
                }
            }
            return module;

        },
        //业务服务
        service: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            if (arguments.length == 1)
                return _service[name];
            else
                _service[name] = _makeInjectAttrs(fn);
        },
        inject: function (p, view, domnode, attr, node, para) {
            return _inject(p, view, domnode, attr, node, para);
        },
        start: function () {
            var node = document.documentElement;
            _rootView = _viewClass.NewObject(node);
            //_compiles.setCompileNode(node);
            _templateClass.NewObject().formNode(node).compile();
            //_compiles.traverseNodes({ node: node, parentDomnode: null, view: _rootView });
        },
        rootView: function () { return _rootView; }
    });

    var _moduleClass = bingo.Class(function () {
        this.Property({
            _controllers: {}
        });

        this.Define({
            controller: function (name, fn) {
                if (arguments.length == 1)
                    return this._controllers[name];
                this._controllers[name] = _makeInjectAttrs(fn);
                return this;
            }
        });
    });



    var _compiles = {
        compiledAttrName: ['bg_cpl', bingo.makeAutoId()].join('_'),
        isCompileNode: function (node) {
            return node[this.compiledAttrName] == "1";
        },
        setCompileNode: function (node) {
            node[this.compiledAttrName] = "1";
        },
        domNodeName: ['bg_cpl_domnode', bingo.makeAutoId()].join('_'),
        //向node及node父层搜索domnoe
        getDomnode: function (node) {
            if (node) {
                if (this.isDomnode(node))
                    return $(node).data('__domnode140907__');
                return this.getDomnode(node.parentNode);
            } else {
                return null;
            }
        },
        setDomnode: function (node, domnode) {
            node[this.domNodeName] = "1";
            $(node).data('__domnode140907__', domnode);
        },
        isDomnode: function (node) {
            return node[this.domNodeName] == "1";
        },
        _textTagRegex: /\{\{([^}]+?)\}\}/gi,
        hasTextTag: function (text) {
            this._textTagRegex.lastIndex = 0;
            return this._textTagRegex.test(text);
        },
        _isCompileTextTag: function (node, pNode) {
            var list = (node.parentNode || pNode)._isCompileTextTags_;
            if (!list) return false;
            return bingo.inArray(node, list) >= 0;
        },
        _setCompileTextTag: function (node, pNode) {
            var list = (node.parentNode || pNode)._isCompileTextTags_ || ((node.parentNode || pNode)._isCompileTextTags_ = []);
            list.push(node);
        },
        _removeCompileTextTag: function (node) {
            var list = node.parentNode && node.parentNode._isCompileTextTags_;
            list && (node.parentNode._isCompileTextTags_ = bingo.removeArrayItem(node, list));
        },
        _makeCommand: function (command, view, node) {
            command = bingo.inject(command, view, null, null, node);
            var opt = {
                priority: 50,
                tmpl: '',
                tmplUrl: '',
                replace: false,
                include: false,
                view: false,
                compileChild: true
                //controller: null,
                //compilePre: null,
                //compile: null,
                //link: null
            };
            if (bingo.isFunction(command) || bingo.isArray(command)) {
                opt.link = command;
            } else
                opt = bingo.extend(opt, command);

            opt.compilePre || (opt.compilePre = _injectNoop);
            opt.compile || (opt.compile = _injectNoop);
            opt.controller || (opt.controller = _injectNoop);
            opt.link || (opt.link = _injectNoop);

            if (!bingo.isNullEmpty(opt.tmplUrl)) {
                bingo.inject('$ajax', view)(opt.tmplUrl).dataType('text').cache(true).async(false).success(function (rs) { opt.tmpl = rs; }).get();
            }

            opt.compilePre = _makeInjectAttrs(opt.compilePre);
            bingo.inject(opt.compilePre, view, null, null, node);

            return opt;
        },
        //hasAttr: function (node, attrName) { return node.hasAttribute ? node.hasAttribute(attrName) : !bingo.isNullEmpty(node.getAttribute(attrName)); },
        traverseNodes: function (p) {
            /// <summary>
            /// 遍历node
            /// </summary>
            /// <param name="p" value='{ node: null, parentDomnode: null, view: null, data:null }'></param>

            //元素element 1
            //属性attr 2
            //文本text 3
            //注释comments 8
            //文档document 9

            var node = p.node;
            if (node.nodeType === 1) {

                if (!this.isCompileNode(node)) {
                    this.setCompileNode(node);

                    //如果不编译下级, 退出
                    if (!this.analyzeNode(node, p)) return;

                };

                this.traverseChildrenNodes(node.childNodes, p);

                //var next = null, pDomnode = p.parentDomnode, pView = p.view, withData = p.withData;
                //if (node = node.firstChild) {
                //    do {
                //        p.node = node;
                //        this.traverseNodes(p);
                //        p.parentDomnode = pDomnode, p.view = pView, p.withData = withData;
                //        next = node.nextSibling;
                //    } while (node = next);
                //}
            } else if (node.nodeType === 3) {
                if (!this._isCompileTextTag(node, p.node)) {
                    this._setCompileTextTag(node, p.node);

                    //收集textNode
                    var text = node.nodeValue;
                    //console.log('_setCompileTextTag', text);
                    if (_compiles.hasTextTag(text)) {
                        //console.warn('_compiles.hasTextTag====>', text);
                        _textTagClass.NewObject(p.view, p.parentDomnode, node, node.nodeName, text, p.withData);
                    }
                }
            }
            node = p = null;
        },
        traverseChildrenNodes: function (nodes, p, withDataList) {
            var list = [];
            //复制新的数组, 防止删除文档节点时, 遍历不全
            bingo.each(nodes, function () { list.push(this); });

            var node, pDomnode = p.parentDomnode, pView = p.view, withData = p.withData;
            var tmplIndex = -1;
            for (var i = 0, len = list.length; i < len; i++) {
                node = list[i];
                tmplIndex = this.getTmplIndex(node);
                //tmplIndex > 0 && console.log('tmplIndex', tmplIndex);
                if (tmplIndex < 0) {
                    //如果没有找到injectRenderItemHtml的index, 按正常处理
                    p.node = node;
                    this.traverseNodes(p);
                    p.parentDomnode = pDomnode, p.view = pView, p.withData = withData;
                } else {
                    //如果找到injectRenderItemHtml的index, 取得index值为当前值, 删除injectRenderItemHtml节点
                    p.withData = withData = withDataList ? withDataList[tmplIndex] : null;
                    //console.log('p.withData', tmplIndex, p.withData);
                    node.parentNode.removeChild(node);
                }
            }
            node = pDomnode = pView = withData = nodes = p = null;
        },
        //取得injectRenderItemHtml的index
        getTmplIndex: function (node) {
            if (node.nodeType == 8) {
                var nodeValue = node.nodeValue;
                if (!bingo.isNullEmpty(nodeValue) && nodeValue.indexOf('bingo_complie_') >= 0) {
                    return parseInt(nodeValue.replace('bingo_complie_', ''), 10);
                }
            }
            return -1;
        },
        analyzeNode: function (node, p) {
            /// <summary>
            /// 分析node
            /// </summary>
            /// <param name="node" value='document.body'></param>
            /// <param name="p" value='{ node: null, parentDomnode: null, view: null, data:null }'></param>
            var tagName = node.tagName, command = null;
            command = bingo.command(tagName);
            var attrList = [], textTagList = [], compileChild = true;
            var tmpl = null, replace = false, include = false, isNewView = false;
            if (command) {
                //node
                command = _compiles._makeCommand(command, p.view, node);
                replace = command.replace;
                include = command.include;
                tmpl = command.tmpl;
                isNewView = command.view;
                compileChild = command.compileChild;
                attrList.push({ aName: tagName, aVal: null, type: 'node', command: command });
            } else {
                //attr
                var attributes = node.attributes;
                if (attributes && attributes.length > 0) {

                    var aVal = null, aT = null, aName = null;
                    for (var i = 0, len = attributes.length; i < len; i++) {
                        aT = attributes[i];
                        if (aT) {
                            aVal = aT.nodeValue;
                            aName = aT.nodeName;
                            if (aName.indexOf('frame')>=0) console.log(aName);
                            command = bingo.command(aName);
                            if (command) {
                                command = _compiles._makeCommand(command, p.view, node);
                                replace = command.replace;
                                include = command.include;
                                tmpl = command.tmpl;
                                if (replace || include) break;
                                isNewView || (isNewView = command.view);
                                (!compileChild) || (compileChild = command.compileChild);
                                attrList.push({ aName: aName, aVal: aVal, type: 'attr', command: command });
                            } else {
                                //是否有text标签{{text}}
                                if (_compiles.hasTextTag(aVal)) {
                                    textTagList.push({ node: aT, aName: aName, aVal: aVal });
                                }
                            }

                        }
                    }
                }
            }

            if (attrList.length > 0) {

                //替换 或 include
                if (replace || include) {
                    var jNode = $(node);

                    if (!bingo.isNullEmpty(tmpl)) {
                        var jNewNode = $(['<div>', tmpl, '</div>'].join(''));
                        //include
                        if (include && tmpl.indexOf('bg-include') >= 0) {
                            jNewNode.find('[bg-include]').each(function () { $(this).append(jNode.clone()); });
                        }
                        var pView = p.view;
                        jNewNode.children().each(function () {
                            $(this).insertBefore(jNode);
                            //新view
                            isNewView && (p.view = _viewClass.NewObject(this, pView));
                            p.node = this;
                            _compiles.traverseNodes(p);
                        });
                    }
                    jNode.remove();

                    //不编译子级
                    compileChild = false;
                } else {

                    if (!bingo.isNullEmpty(tmpl))
                        $(node).html(tmpl);

                    //新view
                    isNewView && (p.view = _viewClass.NewObject(node, p.view));

                    var parentDomnode = p.parentDomnode;
                    var domnode = _domnodeClass.NewObject(p.view, node, isNewView ? null : parentDomnode, p.withData);
                    p.parentDomnode = domnode;
                    this.setDomnode(node, domnode);
                    //console.log('p.withData', p.withData);
                    isNewView && (p.withData = null);

                    //处理attrList
                    var attrItem = null;
                    bingo.each(attrList, function () {
                        //如果新view特性的command, inject时是上级view
                        attrItem = _domnodeAttrClass.NewObject(p.view, domnode, this.type, this.aName, this.aVal, this.command);
                    });
                }
            }

            if (!replace && !include && textTagList.length > 0) {
                var textItem = null;
                bingo.each(textTagList, function () {
                    //如果新view特性的command, inject时是上级view
                    textItem = _textTagClass.NewObject(p.view, domnode, this.node, this.aName, this.aVal);
                });
            }


            return compileChild;
            //return attrList;
        }
    };

    var _templateClass = bingo.Class(function () {

        //编译, parentNode暂时无用
        var _comp = function (node, parentNode, parentDomnode, view, withData) {
            //_compiles.traverseChildrenNodes(nodes, { node: parentNode, parentDomnode: parentDomnode, view: view, withData: withData });
            _compiles.traverseNodes({ node: node, parentDomnode: parentDomnode, view: view, withData: withData });
        }, _traverseChildrenNodes = function (nodes, parentDomnode, view, withDataList) {
            //编译一组nodes.
            _compiles.traverseChildrenNodes(nodes, { node: null, parentDomnode: parentDomnode, view: view, withData: null }, withDataList);
        };

        this.Define({
            formNode: function (node) { return this.formJquery(node); },
            formHtml: function (html) { this._html = html; return this; },// this.formJquery(html); },
            //注入renderItemHtml
            injectRenderItemHtml: function (itemName, html) {
                return bingo.isNullEmpty(html) ? '' : ['<!--bingo_complie_${', itemName, '_index}-->', html].join('');
            },
            formUrl: function (url) { this._url = bingo.path(url); return this; },
            formId: function (id) { return this.formJquery($('#' + id)); },
            formJquery: function (jqSelector) { this._jo = $(jqSelector); return this; },
            withData: function (data) { this._withData = data; return this; },
            withDataList: function (datas) { this._withDataList = datas; return this; },
            appendTo: function (node) { this._parentNode = $(node)[0]; return this; },
            compile: function (callback) {
                try {
                    //初始parentNode, parentDomnode, view
                    var parentNode = this._parentNode;
                    var parentDomnode = parentNode ? _compiles.getDomnode(parentNode) : null;
                    var view = this._view;

                    //检查parentDomnode, 如果有view并, view不等于parentDomnode.view, 将parentDomnode清空(新view)
                    if (view && parentDomnode && parentDomnode.view != view)
                        parentDomnode = null;
                    //检查view, 如果没有view, view取parentDomnode.view
                    view || (view = parentDomnode ? parentDomnode.view : _rootView);

                    //初始withData
                    var withData = this._withData;
                    var withDataList = this._withDataList;

                    //_compile
                    if (this._jo) {
                        if (!parentNode) {
                            //如果没parentNode, 根据当前node取得parentDomnode
                            //一般用于处理已经插入新节点后编译
                            if (this._jo.size() > 0) {
                                parentDomnode = _compiles.getDomnode(this._jo[0]);
                            } else
                                return this;
                        }
                        if (parentNode) {
                            this._jo.appendTo(parentNode);
                        }

                        this._jo.each(function () {
                            _comp(this, parentNode, parentDomnode, view, withData);
                        });
                        //console.log(list, parentNode);

                        view._compile();


                        view._controller();
                        view._link();
                        callback && callback.call(this, this._jo[0]);
                    } else if (parentNode && this._url) {
                        //以url方式加载, 必须先指parentNode;
                        var url = this._url;
                        var ajax = bingo.inject('$ajax', view)(url).success(function (rs) {
                            _templateClass.NewObject(view).formHtml(rs)
                                .withData(withData).withDataList(withDataList)
                                .appendTo(parentNode).compile(function (jo) {
                                    callback && callback.call(this, jo);
                                    this.dispose();
                                });
                            //var jo = $(rs);
                            //jo.each(function () {
                            //    _comp(this, parentDomnode, view, withData);
                            //});
                            //view._compile();
                            //jo.appendTo(parentNode);
                            //view._controller();
                            //view._link();
                            //callback && callback(jo);
                        }).dataType('text').cache(true).get();
                    } else if (parentNode && '_html' in this) {
                        var jo = $(this._html).appendTo(parentNode);
                        //console.time('_comp');
                        if (withDataList)
                            _traverseChildrenNodes(jo, parentDomnode, view, withDataList);
                        else
                            jo.each(function () {
                                _comp(this, parentNode, parentDomnode, view, withData);
                            });
                        //console.timeEnd('_comp');

                        view._compile();
                        //jo.appendTo(parentNode);

                        view._controller();

                        view._link();
                        callback && callback.call(this, jo[0]);
                        return this;
                    }
                }
                finally {
                    this._jo = this._url = this._html = this._parentNode = this._view = this._data = null;
                    return this;
                }
            }
        });

        this.Initialization(function (view) {
            this._view = view;
        });

    });

    bingo.factory('$tmpl', ['$view', function ($view) {
        if ($view.__tmpl__) return $view.__tmpl__;
        var tmpl = _templateClass.NewObject($view);
        $view.__tmpl__ = tmpl;
        tmpl.disposeByOther($view);
        return tmpl;
    }]);

    var _viewClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Property({
            node: null,
            parentView: null,
            domnodeList: [],
            textList: [],
            children: [],
            _module: null,
            _controllerFn: null,
            _isControllerFn: false
        });

        this.Define({
            _setParent: function (view) {
                if (view) {
                    this.parentView = view;
                    view._addChild(this);
                }
            },
            _addDomnode: function (domnode) {
                this.domnodeList.push(domnode);
            },
            _removeDomnode: function (domnode) {
                var list = this.domnodeList;
                list = bingo.removeArrayItem(domnode, list);
                this.domnodeList = list;
            },
            _addChild: function (view) {
                this.children.push(view);
            },
            _removeChild: function (view) {
                var list = this.children;
                list = bingo.removeArrayItem(view, list);
                this.children = list;
            },
            _getWatch: function () {
                if (this.__watch__) return this.__watch__;
                var watch = _watchClass.NewObject();
                watch.setScope(this);
                this.__watch__ = watch;
                watch.disposeByOther(this);
                return watch;
            },
            _compile: function () {
                bingo.each(this.domnodeList, function () {
                    if (!this.isDisposed) {
                        this._compile();
                    }
                });
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._compile();
                    }
                });
            },
            _controller: function () {
                var controllerFn = this._controllerFn;
                if (controllerFn && this._isControllerFn != controllerFn) {
                    this._isControllerFn = controllerFn;

                    //controllerFn如果controllerFn是字串
                    if (bingo.isString(controllerFn) && this._module) {
                        controllerFn = this._module.controller(controllerFn);
                    }
                    bingo.inject(controllerFn, this);
                    var $this = this;
                    setTimeout(function () {
                        $this.trigger('ready');
                        $this.$update();
                    });
                }
                bingo.each(this.domnodeList, function () {
                    if (!this.isDisposed) {
                        this._controller();
                    }
                });
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._controller();
                    }
                });
            },
            _link: function () {
                bingo.each(this.domnodeList, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
                bingo.each(this.textList, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
            },
            setModule: function (moduleName) {
                this._module = bingo.module(moduleName)(this);
            },
            setController: function (controller) {
                this._controllerFn = bingo.isFunction(controller) ?
                    _makeInjectAttrs(controller) : controller;
            },
            $update: function () { return this.$publish(); },
            $publish: function () {
                this.$observer().publish(); return this;
            },
            $observer: function () {
                return this.__observer__ ? this.__observer__ : (this.__observer__ = bingo.inject('$observer', this));
            },
            $subscribe: function (p, callback, deep, disposer) {
                this.$observer().subscribe(p, callback, deep, disposer);
            }
        });

        this.Initialization(function (node, parentView) {
            this.base();
            this.linkToDom(node);
            this.node = node;
            this.parentView = parentView;

            parentView && this._setParent(parentView);
            this.onDispose(function () {
                //console.log('dispose view');


                bingo.each(this.textList, function (item) {
                    if (item) item.dispose();
                });


                //处理父子
                var parentView = this.parentView;
                if (parentView && !parentView.isDisposed)
                    parentView._removeChild(this);

                this.children = this.domnodeList = this.textList = [];
            });

        });
    });

    var _domnodeClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Property({
            view: null,
            node: null,
            //jNode:null,
            parentDomnode: null,
            attrList: [],
            textList: [],
            children: [],
            __withData__: null,
            _isCompiled: false,
            _isLinked: false,
            _isController: false
        });

        this.Define({
            _addChild: function (domnode) {
                this.children.push(domnode);
            },
            _removeChild: function (domnode) {
                var list = this.children;
                list = bingo.removeArrayItem(domnode, list);
                this.children = list;
            },
            _sortAttrs: function () {
                if (this.attrList.length > 1) {
                    // 根据优先级(priority)排序， 越大越前,
                    this.attrList = this.attrList.sort(function (item1, item2) { return item1.priority == item2.priority ? 0 : (item1.priority > item2.priority ? -1 : 1) });
                }
            },
            _compile: function () {
                if (!this._isCompiled) {
                    this._isCompiled = true;
                    bingo.each(this.attrList, function () {
                        if (!this.isDisposed) {
                            this._compile();
                        }
                    });
                }
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._compile();
                    }
                });
            },
            _controller: function () {
                if (!this._isController) {
                    this._isController = true;
                    bingo.each(this.attrList, function () {
                        if (!this.isDisposed) {
                            this._controller();
                        }
                    });
                }
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._controller();
                    }
                });
            },
            _link: function () {
                if (!this._isLinked) {
                    this._isLinked = true;
                    bingo.each(this.attrList, function () {
                        if (!this.isDisposed) {
                            this._link();
                        }
                    });
                }
                bingo.each(this.textList, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
            },
            getWithData: function () {
                return this.__withData__;
            },
            $getAttr: function (name) {
                name = name.toLowerCase();
                var item = null;
                bingo.each(this.attrList, function () {
                    if (this.attrName == name) { item = this; return false; }
                });
                return item;
            }
        });

        this.Initialization(function (view, node, parentDomnode, withData) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="view">_viewClass</param>
            /// <param name="node">dom element</param>
            /// <param name="attrList">属性</param>
            /// <param name="parentDomnode">父节点_domnodeClass</param>

            this.base();
            this.linkToDom(node);

            this.__withData__ = withData;
            if (parentDomnode) {
                this.parentDomnode = parentDomnode;
                //继承父层withData
                withData || (this.__withData__ = parentDomnode.__withData__);
                parentDomnode._addChild(this);
            }

            this.view = view;
            //如果没有父节点时, 添加到view
            parentDomnode || view._addDomnode(this);

            this.node = node;
            //this.jNode = $(node);

            this.onDispose(function () {

                //console.log('attrLst D', this.attrList());
                //释放attrLst
                bingo.each(this.attrList, function (item) {
                    if (item) item.dispose();
                });

                bingo.each(this.textList, function (item) {
                    if (item) item.dispose();
                });

                //处理父子
                var parentDomnode = this.parentDomnode;
                if (parentDomnode) {
                    (!parentDomnode.isDisposed) && parentDomnode._removeChild(this);
                } else {
                    var view = this.view
                    (!view.isDisposed) && view._removeDomnode(this);
                }

                this.attrList = this.children = this.textList = [];
                //console.log('dispose domnode');
            });

        })
    });

    var _domnodeAttrClass = bingo.Class(function () {

        this.Property({
            view: null,
            domnode: null,
            command: null,
            attrName: '',
            attrValue: '',
            type: '',
            _filter:null
        });

        var _priS = {
            evalScriptContextFun: function (attr) {
                return _priS.getScriptContextFun(attr, false, '__contextFun_eval');
            },
            getScriptContextFun: function (attr, hasReturn, cacheName) {
                cacheName || (cacheName = '__contextFun');
                if (attr[cacheName]) return attr[cacheName];
                hasReturn = (hasReturn !== false);
                var attrValue = attr.$getValue();
                try {
                    var data = attr.getWithData();
                    var retScript = !data ? [hasReturn ? 'return ' : '', attrValue, ';'].join('') : ['with($withData){ ', (hasReturn ? 'return ' : ''), attrValue, '; }'].join('');
                    return attr[cacheName] = (new Function('$view', '$node', '$withData', 'event', ' return (function(){ try{ with($view){' + retScript + ' }}catch(e){if (bingo.isDebug) console.error(e.message);return window.undefined;}}).call($node)'));
                } catch (e) {
                    if (bingo.isDebug)
                        console.error(e.message);
                    return attr[cacheName] = function ($view, $node, event) { return attrValue; };
                }
            }
        };


        this.Define({
            _compile: function () {
                var command = this.command;
                var compile = command.compile;
                if (compile) {
                    bingo.inject(compile, this.view, this.domnode, this);
                }
            },
            _controller: function () {
                var command = this.command;
                var controller = command.controller;
                if (controller) {
                    bingo.inject(controller, this.view, this.domnode, this);
                }
            },
            _link: function () {
                var command = this.command;
                var link = command.link;
                if (link) {
                    bingo.inject(link, this.view, this.domnode, this);
                }
            },
            _makeCommand: function (command) {
                var opt = command;
                opt.compile = _makeInjectAttrs(opt.compile);
                opt.controller = _makeInjectAttrs(opt.controller);
                opt.link = _makeInjectAttrs(opt.link);
                this.command = command
            },
            getWithData: function () {
                return this.domnode.getWithData();
            },
            //属性原值
            $getValue: function () { return this.attrValue; },
            $setValue: function (value) { this.attrValue = value; },
            //执行内容, 不会报出错误
            $eval: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return _priS.evalScriptContextFun(this)(view || this.view, this.domnode.node, this.getWithData(), event);
            },
            //执行内容, 并返回结果, 不会报出错误
            $getContext: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return _priS.getScriptContextFun(this)(view || this.view, this.domnode.node, this.getWithData(), event);
            },
            $datavalue: function (value) {
                var name = this.attrValue;
                var tname = name, tobj = this.getWithData();
                var val;
                if (tobj) {
                    val = bingo.datavalue(tobj, tname);
                }
                if (bingo.isUndefined(val)) {
                    tobj = this.view;
                    val = bingo.datavalue(tobj, tname);
                }
                if (bingo.isUndefined(val)) {
                    tobj = window;
                    val = bingo.datavalue(tobj, tname);
                }

                if (arguments.length > 0) {
                    if (bingo.isUndefined(val))
                        bingo.datavalue(this.getWithData() || this.view, tname, value);
                    else
                        bingo.datavalue(tobj, tname, value);
                    return this;
                } else {
                    return val;
                }

            },
            $filter: function (val) {
                return this._filter.filter(val);
            }
        });

        this.Initialization(function (view, domnode, type, attrName, attrValue, command) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="domnode">属性名称</param>
            /// <param name="attrName">属性名称</param>
            /// <param name="attrValue">属性名称</param>
            /// <param name="command">指令定义</param>

            //this.base();


            this.domnode = domnode;
            domnode.attrList.push(this);

            this.view = view;

            this.type = type;
            this.attrName = attrName.toLowerCase();

            var $filter = bingo.inject('$filter', view, domnode, this);
            this._filter = $filter(attrValue, this.getWithData());
            this.attrValue = this._filter.context;

            this._makeCommand(command);
            //console.log('this._filter', this._filter);
            //this.onDispose(function () {
            //    console.log('dispose attr:' + this.attrName);
            //});
        })
    });

    var _textTagClass = bingo.Class(function () {

        this.Property({
            view: null,
            domnode: null,
            node: null,
            attrName: '',
            attrValue: '',
            __withData__: null,
            _isLinked: false
        });

        var _priS = {
            getScriptContextFun: function (attr, attrValue) {
                var cacheName = ['__contextFun', attrValue].join('_');
                if (attr[cacheName]) return attr[cacheName];
                try {
                    var data = attr.getWithData();
                    var retScript = !data ? ['return ', attrValue, ';'].join('') : ['with($withData){ return ', attrValue, '; }'].join('');
                    return attr[cacheName] = (new Function('$view', '$node', '$withData', ' return (function(){ try{ with($view){' + retScript + ' }}catch(e){if (bingo.isDebug) console.error(e.message);return window.undefined;}}).call($node)'));
                } catch (e) {
                    if (bingo.isDebug)
                        console.error(e.message);
                    return attr[cacheName] = function ($view, $node, event) { return attrValue; };
                }
            }
        };


        this.Define({
            _link: function () {
                if (!this._isLinked) {
                    this._isLinked = true;

                    var nodeValue = this.attrValue;
                    var tagList = [];
                    var $this = this;

                    var s = this.node.nodeValue = nodeValue.replace(_compiles._textTagRegex, function (findText, textTagContain, findPos, allText) {
                        var item = { };
                        var flt = bingo.inject('$filter', $this.view, $this.domnode, null, $this.node);
                        flt = flt(textTagContain, $this.getWithData());
                        textTagContain = flt.context;
                        item.text = findText, item.tag = textTagContain, item.flt = flt;
                        tagList.push(item);
                        var value = $this.$getContext(textTagContain);
                        return value ? flt.filter(value) : '';
                    });
                    bingo.each(tagList, function (item) {
                        var tag = item.tag, text = item.text, filter = this.flt;

                        $this.view.$subscribe(function () { return $this.$getContext(tag); }, function (newValue) {
                            if ($this._isRemvoe()) {
                                $this._remove(); this.dispose(); return;
                            }
                            var value = bingo.isNull(newValue) ? '' : filter.filter(newValue);
                            $this.node.nodeValue = nodeValue.replace(text, value);
                        }, false, $this.domnode);
                    });
                };
            },
            _isRemvoe: function () {
                return !this.node || !this.node.parentNode || !this.node.parentNode.parentNode || !this.node.parentNode.parentElement;
            },
            _remove: function () {
                if (this.isDisposed) return;
                //处理text node
                if (this.node.nodeType == 3) {
                    var pObj = this.domnode || this.view;
                    if (pObj && !pObj.isDisposed) {
                        pObj.textList && (pObj.textList = bingo.removeArrayItem(this, pObj.textList));
                    }
                }
                this.dispose();
            },
            getWithData: function () {
                return this.__withData__ || (this.domnode ? this.domnode.getWithData() : null);
            },
            //执行内容, 并返回结果, 不会报出错误
            $getContext: function (tag, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="view">可选, 默认本域</param>
                return _priS.getScriptContextFun(this, tag)(view || this.view, this.node, this.getWithData());
            }
        });

        this.Initialization(function (view, domnode, node, attrName, attrValue, withData) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="domnode">属性名称</param>
            /// <param name="attrName">属性名称</param>
            /// <param name="attrValue">属性名称</param>
            /// <param name="command">指令定义</param>
            //console.log('textTag', node.nodeType);

            this.view = view;
            this.domnode = domnode;
            this.node = node;
            this.__withData__ = withData;

            if (domnode)
                domnode.textList.push(this);
            else
                view.textList.push(this);


            this.attrName = attrName.toLowerCase();
            //this._filter = _filter.createFilterObject(view, domnode, domnode.node, attrValue);
            //this.attrValue = _filter.removerFilterString(attrValue);
            this.attrValue = attrValue;


            this.onDispose(function () {

                _compiles._removeCompileTextTag(this.node);
                //console.log('dispose textTag:' + this.attrName);
            });
        })
    });

    $(function () {
        bingo.start();
    });



})(bingo);(function (bingo) {
    //version 1.0.1
    "use strict";

    //路由
    bingo.route = function (p, $view) {
        if (this.isString(p))
            return _routes.getRoute(p, $view);
        else
            p && _routes.add(p);
    };

    var _routes = {
        datas: [],
        defaultRoute: null,
        add: function (p) {
            if (p.isDefault === true) {
                this.defaultRoute = p;
            } else
                this.datas.push(p);
        },
        getRoute: function (url, $view) {
            var route = null;
            bingo.each(this.datas, function () {
                this.regx.lastIndex = 0;
                if (this.regx.test(url)) {
                    route = this;
                    return false;
                }
            });
            route || (route = this.defaultRoute);
            if (route && bingo.isFunction(route.fn))
                route.fn(url, $view);
            return route;
        }
    };


    bingo.route({
        regx: /.+/i,
        tmplId: '',
        tmplUrl: '',
        script: '',
        module: '',
        controller: '',
        isDefault: true,
        fn: function (url, $view) {
            if (bingo.isNullEmpty(url)) return;
            var nameList = url.split('/');
            this.controller = nameList.pop();
            this.module = nameList.pop();
            var t = nameList.join('/');
            this.tmplUrl = [t, 'view', this.module, (this.controller + '.html')].join('/');
            this.tmplUrl = bingo.getRelativeFile(this.tmplUrl);
            this.script = [t, 'controller', (this.module + '.js')].join('/');
            this.script = bingo.getRelativeFile(this.script);
        }
    });


    bingo.factory('$route', ['$view', function ($view) {
        return function (url) {
            return bingo.route(url, $view);
        };
    }]);

})(bingo);
bingo.factory('$node', ['node', function (node) {
    return $(node);
}]);
(function (bingo) {
    //version 1.0.1
    "use strict";


    var _ajaxClass = bingo.Class(function () {

        var _disposeEnd = function (servers) {
            servers._view && servers._view.$update();
            setTimeout(function () {
                servers.dispose();
            }, 10);
        };

        var _cacheObj = {};

        var _loadServer = function (servers, type) {
            /// <param name="servers" value='_ajaxClass.NewObject()'></param>
            var view = servers._view;
            if (servers.isDisposed && view.isDisposed) return;
            var datas = bingo.clone(servers.param() || {});
            var cacheKey = null;
            var isCache = servers.cache();
            if (isCache) {
                cacheKey = servers._url.toLowerCase();
                if (cacheKey in _cacheObj) {
                    if (servers.async())
                        setTimeout(function () { servers.isDisposed || view.isDisposed || servers.getDTD().resolveWith(servers, [_cacheObj[cacheKey]]); });
                    else
                        servers.getDTD().resolveWith(servers, [_cacheObj[cacheKey]]);
                    return;
                }
            }

            $.ajax({
                type: type,
                url: servers._url,
                data: datas,
                async: servers.async(),
                cache: false,
                dataType: servers.dataType(),
                success: function (response) {
                    if (isCache)
                        _cacheObj[cacheKey] = response;

                    if (servers.isDisposed && view.isDisposed) return;
                    try {
                        var _dtd = servers.getDTD();
                        _dtd.resolveWith(servers, [response]);
                    } finally { _disposeEnd(servers); }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (servers.isDisposed && view.isDisposed) return;
                    try {
                        var _dtd = servers.getDTD();
                        _dtd.rejectWith(servers, [xhr, textStatus, errorThrown]);
                    } finally { _disposeEnd(servers); }
                }
            });
        };

        this.Property({
            _url: '',
            _view: null
        });

        this.Variable({
            async: true,
            dataType: 'json',
            param: {},
            cache: false
        });

        this.Define({
            getDTD: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns value='$.Deferred()'></returns>
                this._dtd || (this._dtd = $.Deferred());
                return this._dtd;
            },
            success: function (callback) {
                this.getDTD().done(callback);
                return this;
            },
            error: function (callback) {
                this.getDTD().fail(callback);
                return this;
            },
            alway: function (callback) {
                this.getDTD().always(callback);
                return this;
            },
            post: function () {
                _loadServer(this, 'post');
                return this;
            },
            get: function () {
                _loadServer(this, 'get');
                return this;
            }
        });

        this.Initialization(function (url, view) {
            this._url = bingo.path(url);
            this._view = view || { isDisposed: false };
        });
    });

    bingo.factory('$ajax', ['$view', function ($view) {
        return function (url) {
            return _ajaxClass.NewObject(url, $view);
        };
    }]);


})(bingo);(function (bingo) {
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

})(bingo);//todo:_subsVarClass的edit等

(function (bingo) {
    //version 1.0.1
    "use strict";

    var _observerClass = bingo.Class(function () {
        var _newItem = function (watch, context, callback, deep, disposer) {
            var _isFn = bingo.isFunction(context),
                _getValue = function () {
                    var val;
                    if (_isFn) {
                        if (disposer && disposer.isDisposed) { setTimeout(function () { item.dispose(); }); return; }
                        val = context.call(item);
                    }
                    else {
                        var scope = watch._view;
                        val = bingo.datavalue(scope, context);
                        if (bingo.isUndefined(val))
                            val = bingo.datavalue(scope, context);
                    }
                    return val;
                },
                _oldValue = _getValue();
            if (deep) _oldValue = bingo.clone(_oldValue);
            var item = {
                check: function () {
                    if (disposer && disposer.isDisposed) { setTimeout(function () { item.dispose(); }); return; }
                    var newValue = _getValue();
                    if (newValue instanceof _subsVarClass) {
                        _oldValue = newValue;
                        if (newValue.$obsCheck()) {
                            callback.call(this, newValue.get());
                            return true;
                        }
                    } else {
                        if (deep ? (!bingo.equals(newValue, _oldValue)) : (newValue != _oldValue)) {
                            _oldValue = deep ? bingo.clone(newValue) : newValue;
                            callback.call(this, newValue);
                            return true;
                        }
                    }
                    return false;
                },
                dispose: function () { watch._remove(this); this.check = this.dispose = bingo.noop; }
            };
            return item;
        };

        this.Property({
            _timeId: null,
            _view: bingo.rootView(),
            _isPause: false,
            _subscribes: []
        });

        this.Define({
            subscribe: function (context, callback, deep, disposer) {
                var item = _newItem(this, context, callback, deep, disposer);
                this._subscribes.push(item);
                return item;
            },
            publish: function () {
                if (this._timeId)
                    clearTimeout(this._timeId);
                var $this = this;
                this._timeId = setTimeout(function () {
                    $this._timeId = null;
                    $this._publish && $this._publish();
                }, 50);
            },
            _publish: function () {
                var isChange = false;
                bingo.each(this._subscribes, function () {
                    if (this.check())
                        isChange = true;
                });
                if (isChange) {
                    var $this = this;
                    setTimeout(function () { $this.isDisposed || $this.publish(); });
                }
            },
            _remove: function (item) {
                this._subscribes = bingo.removeArrayItem(item, this._subscribes);
            }
        });

        this.Initialization(function (view) {
            this.view = view;
            this.disposeByOther(view);
            //this.onDispose(function () { console.log('dispose Observer'); });
        });

    });

    bingo.factory('$observer', ['$view', function ($view) {
        return $view.__observer__ || ($view.__observer__ = _observerClass.NewObject($view));
    }]);

    bingo.each(['$subscribe', '$subs'], function (name) {
        bingo.factory(name, ['$observer', '$attr', function ($observer, $attr) {
            return function (p, callback, deep) {
                return $observer.subscribe(p, callback, deep, $attr);
            };
        }]);
    });

    var _subsVarClass = bingo.Class(function () {

        this.Define({
            //插入元素到数据最后
            push: function (p) {
                this._datas = this._datas.concat(bingo.isArray(p) ? p : [p]);
                return this._triggerChange();
            },
            //删除最后一个元素
            pop: function () {
                var index = this.count() - 1;
                var r = this.get(index);
                this.removeIndex(index);
                return r;
            },
            indexOf: function (p) {
                /// <summary>
                /// 查找第一个位置
                /// indexOf(data)<br />
                /// indexOf(function(item, index){ return item.max > 0; })
                /// </summary>
                /// <param name="p">数组元素/function(item, index)</param>
                return bingo.inArray(p, this._datas);
            },
            remove: function (p) {
                /// <summary>
                /// 删除第一个元素
                /// remove(data)<br />
                /// remove(function(item, index){ return item.max > 0; })
                /// </summary>
                /// <param name="p">数组元素/function(item, index)</param>
                var index = this.indexOf(p);
                if (index >= 0) {
                    this.removeIndex(index);
                    return this._triggerChange();
                }
                return this;
            },
            //删除index元素
            removeIndex: function (index) {
                return this.filter(function (item, inx) {
                    return inx != index;
                });
            },
            removeAll: function () {
                this._datas = [];
                return this._triggerChange();
            },
            //index, 可选, 如果没有index, 返回所有数据, 有则返回index元素值
            'get': function (index) {
                this._isChanged = false;
                return arguments.length == 0 ? this._datas : this._datas[index];
            },
            //index, 可选, 如果没有index, 设置数据源, 有则设置index元素值
            'set': function (p, index) {
                if (arguments.length == 1)
                    this._datas = p;
                else
                    this._datas[index] = p;
                return this._triggerChange();
            },
            //删除第一个元素
            shift: function () {
                var r = this.get(0);
                this.removeIndex(0);
                return r;
            },
            //插入到数组第一个元素
            unshift: function (p) {
                this._datas = [p].concat(this._datas);
                return this._triggerChange();
            },
            toString: function () { return this._datas.toString(); },
            length:0,
            _triggerChange: function () {
                this._isChanged = true;
                this.length = this._datas.length;
                //this.trigger('change');
                return this;
            },
            //设置修改状态
            $change: function () { return this._triggerChange(); },
            //用于observer检查
            $obsCheck: function () {
                var isChanged = this._isChanged;
                this._isChanged = false;
                return isChanged;
            },
            each: function (fn) {
                bingo.each(this._datas, fn);
                return this;
            },
            filter: function (fn) {
                /// <summary>
                /// 过滤<br />
                /// filter(function(item, index){ return item.max > 0 ;});
                /// </summary>
                /// <param name="fn" type="function(item, index)"></param>
                if (!this.isArray(this._datas)) return this;
                var list = [];
                this.each(function (item, index) {
                    if (fn.call(item, item, index)) list.push(item);
                });
                this._datas = list;
                return this._triggerChange();
            },
            map: function (fn, isMerge) {
                /// <summary>
                /// 映射(改造)<br />
                /// filter(function(item, index){ return {a:item.__a, b:item.c+item.d} ;});
                /// </summary>
                /// <param name="fn" type="function(item, index)"></param>
                /// <param name="isMerge">是否合并数组</param>
                if (!this.isArray(this._datas)) return this;
                var list = [];
                this.each(function (item, index) {
                    if (isMerge === true)
                        list = list.concat(fn.call(item, item, index));
                    else
                        list.push(fn.call(item, item, index));
                });
                this._datas = list;
                return this._triggerChange();
            },
            isArray: function () { return bingo.isArray(this._datas);},
            sort: function (fn) {
                /// <summary>
                /// 排序, sort(function(item1, item2){return item1-item2;})<br />
                /// item1 - item2:从小到大排序<br />
                /// item2 - item1:从大到小排序<br />
                /// item1 大于 item2:从小到大排序<br />
                /// item1 小于 item2:从大到小排序
                /// </summary>
                /// <param name="fn" type="function(item1, item2)"></param>
                if (!this.isArray(this._datas)) return this;
                this._datas = this._datas.sort(function (item1, item2) {
                    var n = fn(item1, item2);
                    return n > 0 || n === true ? 1 : (n < 0 || n === false ? -1 : 0);
                });
                return this._triggerChange();
            },
            sortAsc: function (p) {
                /// <summary>
                /// 从小到大排序<br />
                /// sortAsc('max')<br />
                /// sortAsc(function(item){ return item.max; })
                /// </summary>
                /// <param name="p">属性名称/function(item)</param>
                var isFn = bingo.isFunction(p);
                return this.sort(function (item1, item2) {
                    if (isFn)
                        return p.call(item1, item1) - p.call(item2, item2);
                    else
                        item1[p] - item2[p];
                });
            },
            sortDesc: function (p) {
                /// <summary>
                /// 从大到小排序<br />
                /// sortDesc('max')<br />
                /// sortDesc(function(item){ return item.max; })
                /// </summary>
                /// <param name="p">属性名称/function(item)</param>
                var isFn = bingo.isFunction(p);
                return this.sort(function (item1, item2) {
                    if (isFn)
                        return p.call(item2, item2) - p.call(item1, item1);
                    else
                        item2[p] - item1[p];
                });
            },
            unique: function (fn) {
                /// <summary>
                /// 去除重复<br />
                /// unique()<br />
                /// unique(function(item, index){ return item['prop']; });
                /// </summary>
                /// <param name="fn" type="function(item, index)">可选</param>
                if (!this.isArray(this._datas)) return this;
                var list = [], hasList = [];
                fn || (fn = function (item, index) { return item; });
                this.each(function (item, index) {
                    var o = fn.call(item, item, index);
                    if (bingo.inArray(o, hasList) < 0) {
                        list.push(item);
                        hasList.push(o);
                    }
                });
                this._datas = list;
                return this._triggerChange();
            },
            count: function () { return this._datas.length; },
            first: function () {
                if (!this.isArray(this._datas)) return this;
                this._datas = this._datas[0];
                return this._triggerChange();
            },
            last: function () {
                if (!this.isArray(this._datas)) return this;
                this._datas = this._datas[this.count() - 1];
                return this._triggerChange();
            },
            contain: function () {
                this._datas = (!bingo.isNull(this.first().get()));
                return this;
            },
            sum: function (callback) {
                if (!this.isArray(this._datas)) return this;
                var n = 0;
                this.each(function (item, index) {
                    n += (callback ? callback.call(this, this, index) : item);
                });
                this._datas = n;
                return this._triggerChange();
            },
            avg: function (callback) {
                if (!this.isArray(this._datas)) return this;
                var n = 0;
                this.each(function (item, index) {
                    n += (callback ? callback.call(this, this, index) : item);
                });
                this._datas = (n == 0 ? 0 : n / this._datas.length);
                return this._triggerChange();
            },
            min: function (callback) {
                if (!this.isArray(this._datas)) return this;
                var n = -1, val, temp;
                this.each(function (item, index) {
                    val = (callback ? callback.call(item, item, index) : item);
                    if (index == 0 || n > val) {
                        n = val; temp = item;
                    }
                });
                this._datas = temp;
                return this._triggerChange();
            },
            max: function (callback) {
                if (!this.isArray(this._datas)) return this;
                var n = -1, val, temp;
                this.each(function (item, index) {
                    val = (callback ? callback.call(item, item, index) : item);
                    if (index == 0 || n < val) {
                        n = val; temp = item;
                    }
                });
                this._datas = temp;
                return this._triggerChange();
            },
            take: function (pos, count) {
                if (!this.isArray(this._datas)) return this;
                if (isNaN(count) || count < 0)
                    count = this._list.length;
                this._datas = bingo.sliceArray(this._datas, pos, count);
                return this._triggerChange();
            },
            toPage: function (page, pageSize) {
                if (!this.isArray(this._datas)) return this;
                var list = this.get();
                var currentPage = 1, totalPage = 1, pageSize = pageSize, totals = list.length, list = list;
                if (list.length > 0) {
                    totalPage = parseInt(totals / pageSize) + (totals % pageSize != 0 ? 1 : 0);
                    currentPage = page > totalPage ? totalPage : page < 1 ? 1 : page;
                    list = this.take((currentPage - 1) * pageSize, pageSize).get();
                }
                this._datas = {
                    currentPage: currentPage, totalPage: totalPage, pageSize: pageSize,
                    totals: totals, list: list
                };
                return this._triggerChange();
            },
            _getGroupByValue: function (value, rList, groupName) {
                for (var i = 0, len = rList.length; i < len; i++) {
                    if (rList[i][groupName] == value)
                        return rList[i];
                }
                return null;
            },
            group: function (callback, groupName, itemName) {
                groupName || (groupName = 'group');
                itemName || (itemName = 'items');
                var rList = [];
                var len = list.length;
                var iT = null;
                var rT = null;
                var vT = null;
                for (var i = 0; i < len; i++) {
                    iT = list[i];
                    vT = callback.call(iT, iT, i);
                    rT = this._getGroupByValue(vT, rList, groupName);
                    if (rT == null) {
                        rT = {};
                        rT[groupName] = vT;
                        rT[itemName] = [iT];
                        rList.push(rT);
                    } else {
                        rT.items.push(iT);
                    }
                }
                this._datas = rList;
                return this._triggerChange();
            }
        });

        this.Initialization(function (p) {
            this._datas = p;
            this._triggerChange();
        });
    });

    bingo.each(['$subsVar', '$linq'], function (name) {
        bingo.factory(name, function () {
            return function (p) { return _subsVarClass.NewObject(p); };
        });
    });

})(bingo);
(function (bingo) {
    //version 1.0.1
    "use strict";

    /*
        支持js语句, 如: ${item.name} ${document.body.childNodes[0].nodeName}
        支持if语句, 如: ${if item.isLogin} 已登录 ${/if}
        支持过滤器, 如: ${item.name | text}, 请参考过滤器
    */

    var _renderRegx = /\$\{\s*(\/?)(if )*([^}]*)\}/g;   //如果要扩展标签, 请在(if )里扩展如(if |foreach ), 保留以后扩展
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
        s.replace(_renderRegx, function (findText, f1, f2, f3, findPos, allText) {
            //console.log(findText, 'f1:' + f1, 'f2:' + f2, 'f3:' + f3, findPos);
            //return;

            var textItem = _newItem(allText.slice(pos, findPos));
            var isEnd = (f1 == '/');
            var isIf = (f2 == 'if ');
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
                    if (!item.fn(view, data)) return;
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
            _renderRegx.lastIndex = 0;
            var compileList = _renderRegx.test(str) ? _compile(str, $view, $domnode) : null;
            //console.log(compileList);
            return {
                renderItem: function (data, itemName, itemIndex, count) {
                    if (!compileList) return str;
                    return _render(compileList, $view, data, itemName, itemIndex, count);
                },
                render: function (list, itemName) {
                    bingo.isString(itemName) && (itemName = 'item');
                    bingo.isArray(list) || (list = [list]);
                    var that = this, count = list.length;
                    bingo.each(list, function (item, index) {
                        that.renderItem(item, itemName, index, count);
                    });
                }
            };
        };

    }]);


})(bingo);


bingo.factory('$timeout', ['$view', function ($view) {
    return function (callback, time) {
        return setTimeout(function () {
            if (!$view.isDisposed) {
                callback && callback();
                $view.$update();
            }
        }, time || 1);
    };
}]);

bingo.location = function (node) {
    var $node = $(node);
    var frameName = 'bg-frame';
    return {
        href: function (url, target) {
            if (arguments.length == 0)
                return this.toString();
            else {
                var frame = bingo.isNullEmpty(target) ? this.frame() : $('[' + frameName + '][' + frameName + '-name="' + target + '"]');
                if (frame.size() > 0) {
                    frame.attr(frameName, url).trigger(frameName + '-change', [url]);
                }
            }
        },
        change: function (callback) {
            callback && $node.on(frameName + '-change', function (e, url) {
                callback(url);
            });
        },
        frame: function () { return $node.closest('[' + frameName + ']'); },
        toString: function () {
            var frame = this.frame();
            if (frame.size() > 0)
                return frame.attr(frameName);
            else
                return window.location + '';
        }
    };
};

bingo.factory('$location', ['node', function (node) {

    return bingo.location(node);

}]);
bingo.command('bg-controller', function () {
    return {
        priority: 1000,
        tmpl: '',
        tmplUrl: '',
        replace: false,
        include: false,
        view: true,
        compileChild: false,
        compilePre: null,
        controller: null,
        link: null,
        compile: ['$view', '$tmpl', '$node', '$attr', '$route', function ($view, $tmpl, $node, $attr, $route) {
            var val = $attr.$getContext();
            if (bingo.isFunction(val)) {
                $view.setController(val);
                //this.controller = val;
                $tmpl.formNode($node).compile();
            } else {
                val = $attr.$getValue();
                var router = $route(val);
                if (router) {
                    var compileFn = function () {
                        var module = router.module;
                        var controller = router.controller;
                        $view.setModule(module)
                        $view.setController(controller);
                        $tmpl.formNode($node).compile();
                    };
                    var script = router.script;
                    if (bingo.isNullEmpty(script))
                        compileFn();
                    else
                        bingo.using(script, compileFn);
                }
            }
        }]
    };
});

bingo.each('click,blur,dblclick,focus,focusin,focusout,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit'.split(','), function (eventName) {
    bingo.command('bg-' + eventName, function () {

        return ['$view', '$node', '$attr', function ($view, $node, $attr) {
            var fn = $attr.$datavalue();
            if (!bingo.isFunction(fn))
                fn = function (e) { $attr.$eval(e); };
            $node.on(eventName, function () {
                //console.log(eventName);
                fn.apply(this, arguments);
                $view.$update();
            });
        }];

    });
});

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
                            oddRender = evenRender = getRenderObj(jChild.first().html());
                        } else {
                            var jRole = jElement.children('[tmpl-role]');
                            if (jRole.size() > 0) {
                                jRole.each(function () {
                                    var jo = $(this);
                                    var role = jo.attr('tmpl-role');
                                    switch (role) {
                                        case 'body':
                                            oddRender = evenRender = getRenderObj(jo.html());
                                            break;
                                        case 'odd':
                                            oddRender = getRenderObj(jo.html());
                                            break;
                                        case 'even':
                                            evenRender = getRenderObj(jo.html());
                                            break;
                                        case 'empty':
                                            emptyRender = getRenderObj(jo.html());
                                            break;
                                        case 'loading':
                                            loadingRender = getRenderObj(jo.html());
                                            break;
                                        case 'header':
                                            headerRender = getRenderObj(jo.html());
                                            break;
                                        case 'footer':
                                            footerRender = getRenderObj(jo.html());
                                            break;
                                    }
                                });
                            } else {
                                oddRender = evenRender = getRenderObj(jElement.html());
                            }
                        }
                    }

                };

                var _getRenderHtml = function (renderObj, data, index, count) {
                    return renderObj.renderItem(data, _itemName, index, count);
                }, getRenderObj = function (html) {
                    html = $tmpl.injectRenderItemHtml(_itemName, html);
                    //console.log(html);
                    return $render(html);
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
                    //console.time('_renderSimple');
                    //转为数组
                    if (!bingo.isArray(datas)) datas = datas ? [datas] : [];
                    if (datas.length == 0) {
                        if (emptyRender) {
                            html = _getRenderHtml(emptyRender, {}, -1, 0);
                            !bingo.isNullEmpty(html) && $tmpl.formHtml(html).appendTo(jElement).compile();
                        }
                    } else {
                        //console.time('_renderSimpleIn');

                        var countT = datas.length, htmlList = [], withDataList = [];
                        if (headerRender) {
                            html = _getRenderHtml(headerRender, {}, -1, 0);
                            htmlList.push(html);
                            //$tmpl.formHtml(html).appendTo(jElement).compile();
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
                                    htmlList.push(html);
                                    withDataList.push(data);
                                    //$tmpl.formHtml(html).withData(data).appendTo(jElement).compile();
                                }
                            });
                        }
                        if (footerRender) {
                            html = _getRenderHtml(footerRender, {}, -1, 0);
                            htmlList.push(html);
                            //!bingo.isNullEmpty(html) && $tmpl.formHtml(html).appendTo(jElement).compile();
                        }
                        //console.timeEnd('_renderSimpleIn');

                        htmlList.length > 0 && $tmpl.formHtml(htmlList.join('')).withDataList(withDataList).appendTo(jElement).compile();
                    }
                    datas = null;
                    //console.timeEnd('_renderSimple');

                };

                _initTmplObj();
                var _oldValue = $attr.$datavalue();
                //var _oldLen = _oldValue ? _oldValue.length : -1;
                _renderSimple($attr.$filter($attr.$datavalue()));
                $subscribe(function () {
                    return $attr.$datavalue();
                    //var newValue = $attr.$datavalue();
                    //var len = newValue ? newValue.length : -1;
                    //if (newValue != _oldValue || _oldLen != len) {
                    //    _oldValue = newValue;
                    //    _oldLen = len;
                    //    return newValue;
                    //} else
                    //    return _oldValue;

                }, function (newValue) {
                    console.log('change foreach');
                    _renderSimple($attr.$filter(newValue));
                    //_renderSimple($attr.$filter($attr.$datavalue()));
                }, true);


            }]
        };

    });

})(bingo);


bingo.command('bg-frame', function () {
    return {
        priority: 1000,
        replace: false,
        view: true,
        compileChild: false,
        compile: ['$tmpl', '$node', '$attr', '$location', '$route', function ($tmpl, $node, $attr, $location, $route) {
            var url = $attr.$getValue();
            var _href = function (url) {
                $node.html('');
                var router = $route(url);
                if (router) {
                    var tmplUrl = router.tmplUrl;
                    if (!bingo.isNullEmpty(tmplUrl))
                        $tmpl.formUrl(tmplUrl).appendTo($node).compile();
                }
            };
            _href(url);
            $location.change(function (url) {
                _href(url);
            });
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
bingo.command('bg-html', function () {
    return ['$attr', '$node', '$subscribe', function ($attr, $node, $subscribe) {
        $subscribe(function () { return $attr.$getContext(); }, function (newValue) {
            $node.html($attr.$filter(newValue));
        });
        $node.html($attr.$filter($attr.$getContext()));
    }];
});

bingo.command('bg-if', function () {
    return {
        view: false,
        compileChild: false,
        compilePre: ['$attr', '$node', '$subscribe', '$tmpl', function compile($attr, $node, $subscribe, $tmpl) {
            var jo = $($node);
            var html = jo.html();
            jo.html(''); jo = null;
            $subscribe(function () { return $attr.$getContext(); }, function (newValue) {
                if ($attr.$filter(newValue)) {
                    $tmpl.formHtml(html).appendTo($node).compile();
                } else
                    $($node).html('');
                //console.log('if ', newValue, html);
            });
        }]
    };
});
bingo.command('bg-model', function () {

    return ['$view', '$node', '$attr', '$subscribe', function ($view, $node, $attr, $subscribe) {

        var _isRadio = $node.is(":radio");
        var _isCheckbox = $node.is(":checkbox");
        _isCheckbox && $node.data("checkbox_value_02", $node.val());

        var _emptyString = function (val) {
            return bingo.isNullEmpty(val) ? '' : val;
        }, _getElementValue = function () {
            var jT = $node;
            return _isCheckbox ? (jT.prop("checked") ? jT.data("checkbox_value_02") : pxj.stringEmpty) : jT.val();
        }, _setElementValue = function (value) {
            var jo = $node;
            value = _emptyString(value);
            if (_oldValue == value) return;
            _oldValue = value;
            if (_isCheckbox) {
                jo.data("checkbox_value_02", value);
                jo.prop("checked", (jo.val() == value));
            } else if (_isRadio) {
                jo.prop("checked", (jo.val() == value));
            } else
                jo.val(value);

        };
        var _oldValue = null;
        _setElementValue($attr.$datavalue());
        //console.log($attr.$datavalue());

        if (_isRadio) {
            $node.click(function () {
                var value = _getElementValue();
                $attr.$datavalue(value);
                $view.$update();
            });
        } else {
            $node.on('change', function () {
                var value = _getElementValue();
                $attr.$datavalue(value);
                $view.$update();
            });
        }


        $subscribe(function () { return $attr.$datavalue(); }, function (newValue) {
            _setElementValue(newValue);
        });

    }];

});

bingo.command('bg-node', function () {

    return ['$attr', '$node', function ($attr, $node) {
        $attr.$datavalue($node[0]);
    }];
});

bingo.command('bg-text', function () {

    return ['$attr', '$node', '$subscribe', function ($attr, $node, $subscribe) {
        $subscribe(function () { return $attr.$getContext(); }, function (newValue) {
            $node.text($attr.$filter(newValue));
        });
        $node.text($attr.$filter($attr.$getContext()));

    }];
});
