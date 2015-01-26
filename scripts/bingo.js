
(window.console && window.console.log) || (window.console = { log: function () { }, error: function () { }, info: function () { }, table: function () { } });
(function () {
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
        //主版本号.子版本号.修正版本号
        version: { major: 1, minor: 0, rev: 0, toString: function () { return [this.major,this.minor,this.rev ].join('.') } },
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
        replaceAll: function (s, str, repl, flags) {
            if (this.isNullEmpty(s) || this.isNullEmpty(str)) return s;
            str = str.replace(/([^A-Za-z0-9])/g, "\\$1");
            s = s.replace(new RegExp(str, flags || "g"), repl);
            return s;
        },
        inArray: function (element, list, index, rever) {
            var callback = this.isFunction(element) ? element : null;
            var indexRef = -1;
            //debugger;
            this.each(list, function (item, i) {
                if (callback) {
                    if (callback.call(item, item, i)) {
                        indexRef = i; return false;
                    }
                } else if (item === element) {
                    indexRef = i; return false;
                }
            }, index, rever);
            return indexRef;
        },
        toStr: function (p) { return this.isUndefined(p) ? '' : p.toString(); },
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
        each: function (list, callback, index, rever) {
            //callback(data, index){this === data;}
            if (this.isNull(list) || !bingo.isNumeric(list.length)) return;
            var temp = null;
            var sT = bingo.isNumeric(index) ? index : 0;
            if (sT < 0) sT = list.length + sT;
            if (sT < 0) sT = 0;

            var end = rever ? (sT - 1) : list.length;
            var start = rever ? list.length - 1 : sT;
            if ((rever && start <= end) || (!rever && start >= end)) return;

            var step = rever ? -1 : 1;
            for (var i = start; i != end; i += step) {
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

        var eventList = eList || [],
            $this = owner,
            _end = false,
            eventF = function (callback) {
                $this || ($this = this);
                callback && eventF.on(callback);
                return arguments.length == 0 ? eventF : $this;
            };

        bingo.extend(eventF, {
            on: function (callback) {
                callback && eventList.push({ one: false, callback: callback });

                _end && eventF.trigger().off();
                return this;
            },
            one: function (callback) {
                callback && eventList.push({ one: true, callback: callback });

                _end && eventF.trigger().off();
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
            //结束事件, 先解除绑定事件, 以后绑定事件马上自动确发, 用于ready之类的场景
            end: function (isEnd) {
                _end = (isEnd !== false);//默认为true

                _end && eventF.off();
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
                    if ((ret = eventObj.callback.apply($this, arguments[0])) === false) break;
                }
                reList && (eventList = reList);
                return this;
            },
            triggerHandler: function () {
                var list = eventList, eventObj = null;
                if (list.length == 0) return;
                eventObj = list[0];
                var ret = eventObj.callback.apply($this, arguments[0]);
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

        define.prototype.getEvent = function (name) {
            if (name) {
                this.__events__ || (this.__events__ = {});
                var events = this.__events__;
                return events[name] || (events[name] = bingo.Event(this));
            }
            return null;
        };
        define.prototype.on = function (name, callback) {
            if (name && callback) {
                this.getEvent(name).on(callback);
            }
            return this;
        };
        define.prototype.one = function (name, callback) {
            if (name && callback) {
                this.getEvent(name).one(callback);
            }
            return this;
        };
        define.prototype.off = function (name, callback) {
            if (name) {
                this.getEvent(name).off(callback);
            }
            return this;
        };
        define.prototype.end = function (name, isEnd) {
            if (name) {
                this.getEvent(name).end(isEnd);
            }
            return this;
        };
        define.prototype.trigger = function (name) {
            if (this.__events__) {
                var events = this.__events__;
                var argLists = arguments.length > 1 ? arguments[1] : [];
                events[name] && events[name]().trigger(argLists);
            }
            return this;
        };
        define.prototype.triggerHandler = function (name) {
            if (this.__events__) {
                var events = this.__events__;
                var argLists = arguments.length > 1 ? arguments[1] : [];
                return events[name] && events[name]().triggerHandler(argLists);
            }
        };
        define.prototype.hasEvent = function (name) {
            return this.__events__ && this.__events__[name];
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

; (function (bingo) {
    //version 1.0.1
    "use strict";

    var _equals = function (p1, p2) {
        if (bingo.isNull(p1) || bingo.isNull(p2))
            return p1 === p2;
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
                this._linkToDomObject = bingo.linkToDom(jqSelector, function (isRemoveDom) {
                    try {
                        //console.log('isRemoveDom', isRemoveDom);
                        isRemoveDom && $this.trigger && $this.trigger('domRemoved');
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

    var _disconnectByLink = function (link, isRemoveDom) {
        if (link && link.target) {
            var callback = link.callback;
            _unlink.call(link);
            callback(isRemoveDom);
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
                if (_autoId >= Number.MAX_VALUE) _autoId = 0;
                _autoId++;
                var link = { id: "linkToDom_130102_" + _autoId, target: jTarget, callback: callback, unlink: _unlink, disconnect: _disconnect };
                jTarget.data(link.id, "T");
                jTarget.one("linkRemove.linkdom", function (e) { _disconnectByLink(link, true); });
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

    bingo.mvc = {};

    var _factory = {}, _service = {}, _command = {}, _filter = {};
    var _rootView = null;
    
    var _injectNoop = function () { };
    _injectNoop.$injects = [];

    var _makeInjectAttrRegx = /^\s*function[^(]*?\(([^)]+?)\)/i,
    _makeInjectAttrs = bingo._makeInjectAttrs = function (p) {
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
        }
        return fn;
    },
    //取得注入: _inject('$view', $view, $domnode, $attr, node, {}, {}); //$view为必要, 其它为可选
    _inject = function (p, view, domnode, attr, node, para, injectObj) {

        injectObj = injectObj || {};
        //var $view = injectObj.$view || view || bingo.rootView();
        //var $module = injectObj.$module || $view._module;
        var fn = null;
        if (bingo.isString(p)) {
            //如果是字串
            if (p in injectObj) {
                //如果已经存在
                return injectObj[p];
            }
            injectObj[p] = {};
            fn = bingo.factory(p);
            //(!bingo.isFunction(fn)) && (fn = ($module ? $module.service(p) : bingo.service(p)));
            (!bingo.isFunction(fn)) && (fn = bingo.service(p));
            if (!fn) return {};
        } else
            fn = p;

        var $injects = fn.$injects;
        var injectParams = [];
        if ($injects && $injects.length > 0) {
            if (!injectObj.$view) {
                injectObj.$view = view || bingo.rootView();
                //injectObj.$module = $module;
                injectObj.$domnode = domnode;
                injectObj.$withData = (para && para.withData) || (domnode ? domnode.getWithData() : null);
                injectObj.node = node ? node : (domnode ? domnode.node : (view && view.node));
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

        return ret;
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
        inject: function (p, view, domnode, attr, node, para) {
            return _inject(p, view, domnode, attr, node, para);
        },
        start: function () {
            bingo.using(function () {
                var node = document.documentElement;
                _rootView = _viewClass.NewObject(node);
                _templateClass.NewObject().fromNode(node).compile();
            });
        },
        getView: function (jqSelector) {
            var jo = $(jqSelector);
            return (jo.size() == 0) ? null : _compiles.getView(jo[0]);
        },
        rootView: function () { return _rootView; }
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
        removeDomnode: function (domnode) {
            var node = domnode.node;
            node[this.domNodeName] == "0";
            $(node).removeData('__domnode140907__');
        },
        isDomnode: function (node) {
            return node[this.domNodeName] == "1";
        },
        getView: function (node) {
            var domnode = this.getDomnode(node);
            return domnode ? domnode.view : null;
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
                compileChild: true,
                readyAuto: true
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

                }
                var next = node.firstChild;
                if (next) {
                    var childNodes = [];
                    do {
                        childNodes.push(next);
                    } while (next = next.nextSibling);
                    this.traverseChildrenNodes(childNodes, p);
                }

            } else if (node.nodeType === 3) {
                if (!this._isCompileTextTag(node, p.node)) {
                    this._setCompileTextTag(node, p.node);

                    //收集textNode
                    var text = node.nodeValue;
                    if (_compiles.hasTextTag(text)) {
                        _textTagClass.NewObject(p.view, p.parentDomnode, node, node.nodeName, text, p.withData);
                    }
                }
            }
            node = p = null;
        },
        traverseChildrenNodes: function (nodes, p, withDataList) {
            var list = [];

            var node, pBak = bingo.clone(p, false);
            var tmplIndex = -1;
            for (var i = 0, len = nodes.length; i < len; i++) {
                node = nodes[i];
                tmplIndex = this.getTmplIndex(node);
                //tmplIndex > 0 && console.log('tmplIndex', tmplIndex);
                if (tmplIndex < 0) {
                    //如果没有找到injectRenderItemHtml的index, 按正常处理
                    p.node = node;
                    this.traverseNodes(p);
                    p = bingo.clone(pBak, false);
                } else {
                    //如果找到injectRenderItemHtml的index, 取得index值为当前值, 添加injectRenderItemHtml节点到list
                    p.withData = pBak.withData = withDataList ? withDataList[tmplIndex] : null;
                    //console.log('p.withData', tmplIndex, p.withData);
                    list.push(node);
                }
            }
            //删除injectRenderItemHtml节点
            while (list.length) {
                node = list.pop();
                node.parentNode.removeChild(node);
            }
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
            var tmpl = null, replace = false, include = false, isNewView = false, readyAuto = false;
            if (command) {
                //node
                command = _compiles._makeCommand(command, p.view, node);
                replace = command.replace;
                include = command.include;
                tmpl = command.tmpl;
                isNewView = command.view;
                readyAuto = command.readyAuto;
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
                            //if (aName.indexOf('frame')>=0) console.log(aName);
                            command = bingo.command(aName);
                            if (command) {
                                command = _compiles._makeCommand(command, p.view, node);
                                replace = command.replace;
                                include = command.include;
                                tmpl = command.tmpl;
                                isNewView || (isNewView = command.view);
                                readyAuto || (readyAuto = command.readyAuto);
                                (!compileChild) || (compileChild = command.compileChild);
                                attrList.push({ aName: aName, aVal: aVal, type: 'attr', command: command });
                                if (replace || include) break;
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

            var domnode = null;
            if (attrList.length > 0) {

                //替换 或 include
                if (replace || include) {
                    var jNode = $(node);
                    if (!bingo.isNullEmpty(tmpl)) {
                        var jNewNode = $($.parseHTML(tmpl));
                        if (include && tmpl.indexOf('bg-include') >= 0) {
                            jNewNode.find('[bg-include]').add(jNewNode.filter('[bg-include]')).each(function () {
                                var jo = $(this);
                                if (bingo.isNullEmpty(jo.attr('bg-include'))) {//如果空才执行
                                    var jT = jNode.clone();
                                    //将新节点设置为已编译, 防止死循环
                                    _compiles.setCompileNode(jT[0]);
                                    jo.append(jT);
                                    //jo.removeAttr('bg-include');
                                }
                            });
                        }
                        var pView = p.view, pDomnode = p.parentDomnode, pBak = bingo.clone(p, false);
                        jNewNode.each(function () {
                            $(this).insertBefore(jNode);
                            if (this.nodeType === 1) {
                                //_compiles.setCompileNode(this);
                                //新view
                                if (isNewView) {
                                    p.view = _viewClass.NewObject(this, pView, readyAuto);
                                    if (p.controller) {
                                        p.view.$addController(p.controller);
                                        p.controller = null;
                                    }
                                }
                                //本节点
                                domnode = _domnodeClass.NewObject(p.view, this, isNewView ? null : pDomnode, p.withData);
                                //设置父节点
                                p.parentDomnode = domnode;
                                //连接node
                                //_compiles.setDomnode(this, domnode);
                                //清空p.withData
                                isNewView && (p.withData = null);

                                var attr = attrList[attrList.length - 1];
                                _domnodeAttrClass.NewObject(p.view, domnode, attr.type, attr.aName, attr.aVal, attr.command);
                            }
                            if (compileChild) {
                                p.node = this;
                                _compiles.traverseNodes(p);
                            }
                            p = bingo.clone(pBak, false);
                        });
                    }
                    jNode.remove();

                    //不编译子级
                    compileChild = false;
                } else {

                    if (!bingo.isNullEmpty(tmpl))
                        $(node).html(tmpl);

                    //新view
                    if (isNewView) {
                        p.view = _viewClass.NewObject(node, p.view, readyAuto);
                        if (p.controller) {
                            p.view.$addController(p.controller);
                            p.controller = null;
                        }
                    }
                    //父节点
                    var parentDomnode = p.parentDomnode;
                    //本节点
                    domnode = _domnodeClass.NewObject(p.view, node, isNewView ? null : parentDomnode, p.withData);
                    //设置父节点
                    p.parentDomnode = domnode;
                    //连接node
                    //this.setDomnode(node, domnode);
                    //清空p.withData
                    isNewView && (p.withData = null);

                    //处理attrList
                    var attrItem = null;
                    bingo.each(attrList, function () {
                        //如果新view特性的command, inject时是上级view
                        attrItem = _domnodeAttrClass.NewObject(p.view, domnode, this.type, this.aName, this.aVal, this.command);
                    });
                }
            }

            if (!(replace || include) && textTagList.length > 0) {
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

    //模板==负责编译======================
    var _templateClass = bingo.mvc.templateClass = bingo.Class(function () {

        //编译, parentNode暂时无用
        var _comp = function (node, parentNode, parentDomnode, view, withData, controller) {
            //_compiles.traverseChildrenNodes(nodes, { node: parentNode, parentDomnode: parentDomnode, view: view, withData: withData });
            _compiles.traverseNodes({ node: node, parentDomnode: parentDomnode, view: view, withData: withData, controller: controller });
        }, _traverseChildrenNodes = function (nodes, parentDomnode, view, withDataList, controller) {
            //编译一组nodes.
            _compiles.traverseChildrenNodes(nodes, { node: null, parentDomnode: parentDomnode, view: view, withData: null, controller: controller }, withDataList);
        };

        this.Define({
            //给下一级新的View注入controller
            controller: function (controller) { this._controller = controller; return this;},
            fromNode: function (node) { return this.fromJquery(node); },
            fromHtml: function (html) { return this.fromJquery($.parseHTML(html)); },// this.fromJquery(html); },
            //注入renderItemHtml
            injectRenderItemHtml: function (itemName, html) {
                return bingo.isNullEmpty(html) ? '' : ['<!--bingo_complie_${', itemName, '_index}-->', html].join('');
            },
            fromUrl: function (url) { this._url = url; return this; },
            fromId: function (id) { return this.fromJquery($('#' + id)); },
            fromJquery: function (jqSelector) {
                this._jo = $(jqSelector); return this;
            },
            withData: function (data) { this._withData = data; return this; },
            withDataList: function (datas) { this._withDataList = datas; return this; },
            appendTo: function (node) { this._parentNode = $(node)[0]; return this; },
            //是否缓存, 默认true
            cache: function (cache) { this._cache = cache; return this; },
            stop: function (stop) { this._stop = (stop !== false); return this; },
            compilePre: function (compilePre) { this._compilePre = compilePre; return this; },
            compile: function (callback) {
                if (this._stop) {
                    this._stop = false;
                    this.clearProp();
                    return this;
                }
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
                var controller = this._controller;
                var compilePre = this._compilePre;

                //_compile
                if (this._jo) {
                    var jo = this._jo;
                    this.clearProp();
                    if (!parentNode) {
                        //如果没parentNode, 根据当前node取得parentDomnode
                        //一般用于处理已经插入新节点后编译
                        if (jo.size() > 0) {
                            parentDomnode = _compiles.getDomnode(jo[0]);
                        } else
                            return this;
                    }
                    compilePre && compilePre.call(this);
                    if (parentNode) {
                        jo.appendTo(parentNode);
                    }
                    if (withDataList)
                        _traverseChildrenNodes(jo, parentDomnode, view, withDataList, controller);
                    else
                        jo.each(function () {
                            _comp(this, parentNode, parentDomnode, view, withData, controller);
                        });

                    //处理
                    view._handel();
                    callback && callback.call(this, jo[0]);
                } else if (parentNode && this._url) {
                    //以url方式加载, 必须先指parentNode;
                    var url = this._url, $this = this;
                    var ajax = bingo.inject('$ajax', view)(url).success(function (rs) {
                        if ($this._stop) {
                            $this._stop = false;
                            $this.clearProp();
                            return;
                        }

                        _templateClass.NewObject(view).fromHtml(rs).controller(controller)
                            .withData(withData).withDataList(withDataList)
                            .appendTo(parentNode).compilePre(compilePre).compile(function (jo) {
                                callback && callback.call(this, jo);
                                this.dispose();
                            });
                    }).error(function () { callback && callback(); }).dataType('text').cache(this.cache()).get();
                    this.clearProp();
                }
                return this;
            },
            clearProp: function () {
                this._jo = this._url = this._compilePre = this._controller = this._html = this._parentNode = this._view = this._withDataList = this._withData = null;
                this.cache(true);
                return this;
            }
        });

        this.Initialization(function (view) {
            this._view = view; this.cache(true);
        });

    });

    bingo.factory('$tmpl', ['$view', function ($view) {
        if ($view.__tmpl__) return $view.__tmpl__;
        var tmpl = _templateClass.NewObject($view);
        $view.__tmpl__ = tmpl;
        tmpl.disposeByOther($view);
        return tmpl;
    }]);

    //view==提供视图==================
    var _viewClass = bingo.mvc.viewClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Property({
            node: null,
            $parentView: null,
            $domnodeList: [],
            $textList: [],
            $children: [],
            _module: null,
            _readyAuto:true,
            //_controllerFn: null,
            //_isControllerFn: false,


            _controllers:[]
        });

        this.Define({
            _setParent: function (view) {
                if (view) {
                    this.$parentView = view;
                    view._addChild(this);
                }
            },
            _addDomnode: function (domnode) {
                this.$domnodeList.push(domnode);
            },
            _removeDomnode: function (domnode) {
                var list = this.$domnodeList;
                list = bingo.removeArrayItem(domnode, list);
                this.$domnodeList = list;
            },
            _addChild: function (view) {
                this.$children.push(view);
            },
            _removeChild: function (view) {
                var list = this.$children;
                list = bingo.removeArrayItem(view, list);
                this.$children = list;
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
                bingo.each(this.$domnodeList, function () {
                    if (!this.isDisposed) {
                        this._compile();
                    }
                });
            },
            _controller: function () {
                if (this._controllers.length > 0) {
                    var conList = this._controllers;
                    this._controllers = [];

                    var $this = this;
                    bingo.each(conList, function () {
                        bingo.inject(this, $this);
                    });

                    if (this._readyAuto)
                        setTimeout(function () {
                            $this.$sendReady();
                        });
                }

                bingo.each(this.$domnodeList, function () {
                    if (!this.isDisposed) {
                        this._controller();
                    }
                });
            },
            _link: function () {
                bingo.each(this.$domnodeList, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
            },
            _handel: function () {

                this._compile();//编译指令
                this._controller();//根据controller做初始
                this._link();//连接指令

                this._handleChild();//处理子级
            },
            _handleChild: function () {
                bingo.each(this.$children, function () {
                    if (!this.isDisposed) {
                        this._handel();
                    }
                });
            },
            _isReady_:false,
            $sendReady: function () {
                if (this.hasEvent('initdata')) {
                    var $this = this;
                    bingo.inject('$ajax', this).syncAll(function () {

                        $this.trigger('initdata').end('initdata');

                    }).success(function () {
                        //所有$axaj加载成功
                        $this.trigger('ready').end('ready');
                        $this._isReady_ = true;
                        $this.$update();
                    });
                } else {
                    this.trigger('ready').end('ready');
                    this._isReady_ = true;
                    this.$update();
                }
            },
            $setModule: function (module) {
                this._module = module;
            },
            $getModule: function () {
                return this._module;
            },
            //$setModule: function (moduleName) {
            //    //this._module = bingo.module(moduleName)(this);
            //    this._moduleName = moduleName;

            //    this._module = bingo.inject('$module', this);


            //    //var module = bingo.module(moduleName);
            //    //if (module) module._inject(this);
            //},
            //setController: function (controller) {
            //    this._controllerFn = bingo.isFunction(controller) || bingo.isArray(controller) ?
            //        _makeInjectAttrs(controller) : controller;
            //},


            $addController: function (controller) {
                var fn = bingo.isFunction(controller) || bingo.isArray(controller) ?
                    _makeInjectAttrs(controller) : controller;
                this._controllers.push(fn);
            },
            $getDomnode: function (node) {
                //node可选
                return _compiles.getDomnode(node || this.node);
            },
            $getNode: function (jqSelector) {
                var jo = this._$node_ || (this._$node_ = $(this.node));
                return arguments.length == 0 ? jo : jo.find(jqSelector);
            },
            $update: function () { return this.$publish(); },
            $updateAsync: function () {
                if (this._isReady_ === true) {
                    this.$observer().publishAsync();
                }
                return this;
            },
            $apply: function (callback, thisArg) {
                if (callback) {
                    //this.$update();
                    callback.apply(thisArg || this);
                    this.$update();
                }
                return this;
            },
            $proxy: function (callback, thisArg) {
                var $view = this;
                return function () {
                    //$view.$update();
                    callback.apply(thisArg || this, arguments);
                    $view.$update();
                };
            },
            $publish: function () {
                if (this._isReady_ === true) {
                    this.$observer().publish();
                }
                return this;
            },
            $observer: function () {
                return bingo.inject('$observer', this);
            },
            $subscribe: function (p, callback, deep, disposer) {
                this.$observer().subscribe(p, callback, deep, disposer);
            },
            $subs: function (p, callback, deep, disposer) {
                this.$subscribe.apply(this, arguments);
            }
        });

        this.Initialization(function (node, parentView, readyAuto) {
            this.base();
            this.linkToDom(node);
            this.node = node;
            this.$parentView = parentView;
            this._readyAuto = (readyAuto !== false);

            parentView && this._setParent(parentView);
            this.onDispose(function () {
                //console.log('dispose view');


                bingo.each(this.$textList, function (item) {
                    if (item) item.dispose();
                });


                //处理父子
                var parentView = this.$parentView;
                if (parentView && !parentView.isDisposed)
                    parentView._removeChild(this);

                this.$children = this.$domnodeList = this.$textList = [];

            });

        });
    });

    //domnode==管理与node节点连接====================
    var _domnodeClass = bingo.mvc.domnodeClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Property({
            view: null,
            node: null,
            //jNode:null,
            parentDomnode: null,
            attrList: [],//command属性
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
                    this.attrList = this.attrList.sort(function (item1, item2) { return item1.priority == item2.priority ? 0 : (item1.priority > item2.priority ? -1 : 1); });
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
            },
            $html: function (html) {
                if (arguments.length > 0) {
                    $(this.node).html('');
                    bingo.inject('$tmpl', this.view, this).fromHtml(html).withData(this.getWithData()).appendTo(this.node).compile();
                    return this;
                } else
                    return $(this.node).html();
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
            //连接node
            _compiles.setDomnode(node, this);

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

            var isDomRemoved = false;
            this.on('domRemoved', function () {
                isDomRemoved = true;
            });

            this.onDispose(function () {

                if (!isDomRemoved) {
                    _compiles.removeDomnode(this);
                }
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

        });
    });

    //domnode attr====管理与指令连接================
    var _domnodeAttrClass = bingo.mvc.domnodeAttrClass = bingo.Class(function () {

        this.Property({
            view: null,
            domnode: null,
            command: null,
            attrName: '',
            _bindContext:null,
            type: ''//attr|node
        });

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
                    this._init();
                }
            },
            _makeCommand: function (command) {
                if (command) {
                    var opt = command;
                    opt.compile = _makeInjectAttrs(opt.compile);
                    opt.controller = _makeInjectAttrs(opt.controller);
                    opt.link = _makeInjectAttrs(opt.link);
                }
                this.command = command || {};
            },
            getWithData: function () {
                return this.domnode.getWithData();
            },
            //属性原值
            $prop: function (p) {
                if (arguments.length==0)
                    return this._bindContext.$prop();
                else 
                    this._bindContext.$prop(p);
                return this;
            },
            //执行内容, 不会报出错误
            $eval: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return this._bindContext.$eval(event, view);
            },
            //执行内容, 并返回结果, 不会报出错误
            $context: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return this._bindContext.$context(event, view);
            },
            //返回withData/$view/window属性值
            $value: function (value) {
                if (arguments.length == 0)
                    return this._bindContext.$value();
                else
                    return this._bindContext.$value(value);
                return this;
            },
            $subs: function (p, p1, deep) {
                if (arguments.length == 1) {
                    p1 = p;
                    var $this = this;
                    p = function () { return $this.$context(); };
                }
                this.view.$subs(p, p1, deep, this);
            },
            _init: function () {
                this.__isinit = true;
                var para = this.__initParam;
                if (para) {
                    var p = para.p, p1 = para.p1;
                    this.__initParam = null;
                    var val = bingo.isFunction(p) ? p.call(this) : p;
                    p1.call(this, bingo.variableOf(val));
                }
            },
            $init: function (p, p1) {
                if (arguments.length == 1) {
                    p1 = p;
                    var $this = this;
                    p = function () { return $this.$context(); };
                }
                this.__initParam = { p: p, p1: p1 };
                if (this.__isinit)
                    this._init();
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
            this.__initParam = null;this.__isinit=false,

            this.domnode = domnode;
            domnode.attrList.push(this);

            this.view = view;

            this.type = type;
            this.attrName = attrName.toLowerCase();

            var $bindContext = bingo.inject('$bindContext', view, domnode, this);
            this._bindContext = $bindContext(attrValue);

            this._makeCommand(command);

            this.onDispose(function () {
                this._bindContext.dispose();
                //console.log('dispose attr:' + this.attrName);
            });
        });
    });

    //标签==========================
    var _textTagClass = bingo.mvc.textTagClass = bingo.Class(function () {

        this.Property({
            view: null,
            domnode: null,
            node: null,
            attrName: '',
            attrValue: '',
            __withData__: null,
            _isLinked: false
        });

        this.Define({
            _link: function () {
                if (!this._isLinked) {
                    this._isLinked = true;

                    var nodeValue = this.attrValue;
                    var tagList = [];
                    var $this = this;

                    var s = this.node.nodeValue = nodeValue.replace(_compiles._textTagRegex, function (findText, textTagContain, findPos, allText) {
                        var item = { };

                        var $bindContext = bingo.inject('$bindContext', $this.view, $this.domnode, null, $this.node);
                        var context = $bindContext(textTagContain, $this.node, $this.getWithData());

                        item.text = findText, item.context = context;
                        tagList.push(item);

                        var value = context.$context();
                        return item.value = value || '';
                    });
                    //console.log('tagList', tagList);
                    bingo.each(tagList, function (item) {
                        var context = item.context, text = item.text;

                        $this.view.$subs(function () { return context.$context(); }, function (newValue) {
                            if ($this._isRemvoe()) {
                                $this._remove(); this.dispose(); _dispose(); return;
                            }
                            item.value = bingo.toStr(newValue);
                            changeValue();
                        }, false, $this.domnode);
                    });
                    var changeValue = function () {
                        var allValue = nodeValue;
                        bingo.each(tagList, function (item) {
                            var text = item.text;
                            var value = item.value;
                            allValue = allValue.replace(text, value);
                        });
                        $this.node.nodeValue = allValue;
                    };
                    var _dispose = function () {
                        bingo.each(tagList, function (item) {
                            item.context && item.context.dispose();
                        });
                        tagList = null;
                    };

                    this.onDispose(function () {
                        _dispose();
                    });
                }
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
                view.$textList.push(this);


            this.attrName = attrName.toLowerCase();
            //this._filter = _filter.createFilterObject(view, domnode, domnode.node, attrValue);
            //this.attrValue = _filter.removerFilterString(attrValue);
            this.attrValue = attrValue;


            this.onDispose(function () {

                _compiles._removeCompileTextTag(this.node);
                //console.log('dispose textTag:' + this.attrName);
            });
        });
    });

    //绑定内容解释器==========================
    var _bindContextClass = bingo.mvc.bindContextClass = bingo.Class(function () {

        var _priS = {
            _cacheName: '__contextFun__',
            resetContextFun: function (attr) {
                attr[_priS._cacheName] = {};
            },
            evalScriptContextFun: function (attr) {
                return _priS.getScriptContextFun(attr, false, 'eval');
            },
            getScriptContextFun: function (attr, hasReturn, cacheName) {
                cacheName || (cacheName = 'context');

                var contextCache = attr[_priS._cacheName];
                if (contextCache[cacheName]) return contextCache[cacheName];

                var attrValue = attr.$prop();
                hasReturn = (hasReturn !== false);
                try {
                    var retScript = [hasReturn ? 'return ' : '', attrValue, ';'].join('');
                    return attr[cacheName] = (new Function('$view', '$node', '$withData', 'event', ' return (function(){ try{ with($view){ if (!$withData) {' + retScript + '} else { with($withData){' + retScript + '} } }}catch(e){if (bingo.isDebug) console.error(e.message);}}).call($node)'));
                } catch (e) {
                    if (bingo.isDebug)
                        console.error(e.message);
                    return attr[cacheName] = function () { return attrValue; };
                }
            }
        };

        //this.Property({
        //    attrValue: '',
        //    node: null,
        //    view: null,
        //    withData: null,
        //    _filter: null
        //});

        this.Define({
            //属性原值
            $prop: function (p) {
                if (arguments.length == 0)
                    return this.attrValue;
                else {
                    this.attrValue = p;
                    _priS.resetContextFun(this);
                    return this;
                }
            },
            //执行内容, 不会报出错误
            $eval: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return _priS.evalScriptContextFun(this)(view || this.view, this.node, this.withData, event);
            },
            //执行内容, 并返回结果, 不会报出错误
            $context: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                var res = _priS.getScriptContextFun(this)(view || this.view, this.node, this.withData, event);
                return this.$filter(res);
            },
            //返回withData/$view/window属性值
            $value: function (value) {
                var name = this.attrValue;
                var tname = name, tobj = this.withData;
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
                    if (bingo.isVariable(val))
                        val(value);
                    else if (bingo.isUndefined(val))
                        bingo.datavalue(this.withData || this.view, tname, value);
                    else
                        bingo.datavalue(tobj, tname, value);
                    return this;
                } else {
                    return this.$filter(val);
                }

            },
            $filter: function (val, withData) {
                return this._filter.filter(val, withData);
            }
        });

        this.Initialization(function (view, node, attrValue, withData, domnode, attr) {
            /// <param name="view"></param>
            /// <param name="node"></param>
            /// <param name="attrValue"></param>
            /// <param name="withData可选</param>
            /// <param name="domnode">可选</param>
            /// <param name="attr">可选</param>

            _priS.resetContextFun(this);

            this.view = view;
            this.node = node;
            
            this.withData = withData;
            var $filter = bingo.inject('$filter', view, domnode, attr, node, { withData: withData });
            this._filter = $filter(attrValue, this.withData);
            this.attrValue = this._filter.context;

        });
    });


    //绑定内容解释器, var bind = $bindContext('user.id == "1"', document.body); var val = bind.getContext();
    bingo.factory('$bindContext', ['$view', '$domnode', '$attr', '$withData', function ($view, $domnode, $attr, $withData) {
        //$domnode, $attr, $withData为可选
        return function (bindText, node, withData) {
            //node, withData可选
            node || (node = $domnode && $domnode.node);
            withData || (withData = $withData);
            return _bindContextClass.NewObject($view, node, bindText, withData, $domnode, $attr);
        };
    }]);


    //node绑定内容解释器==========================
    var _nodeContextClass = bingo.mvc.bindContextClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Define({
            $getAttr: function (name) {
                var attr = this._attrs[name];
                if (bingo.isUndefined(attr)) {
                    var attrTemp = this.node.attributes[name];
                    attr = this._attrs[name] = attrTemp
                        ? bingo.inject('$bindContext', this.view, this.domnode, null, this.node)(attrTemp.nodeValue, this.node, this.withData)
                        : null;
                }
                return attr;
            },
            $prop: function (name, p) {
                if (arguments.length == 1) {
                    var attr = this.node.attributes[name];
                    return attr ? this.$getAttr(name).$prop() : '';
                } else {
                    var attr = this.$getAttr(name);
                    attr && attr.$prop(p);
                    return this;
                }
            },
            //执行内容, 不会报出错误
            $eval: function (name, event, view) {
                var attr = this.$getAttr(name);
                return attr && attr.$eval(event, view);
            },
            //执行内容, 并返回结果, 不会报出错误
            $context: function (name, event, view) {
                var attr = this.$getAttr(name);
                return attr && attr.$context(event, view);
            },
            //返回withData/$view/window属性值
            $value: function (name, value) {
                var attr = this.$getAttr(name);
                if (!attr) return;
                if (arguments.length == 1)
                    return attr.$value();
                else
                    return attr.$value(value);
            }
        });

        this.Initialization(function (view, node, withData, domnode) {
            /// <param name="view"></param>
            /// <param name="node"></param>
            /// <param name="withData可选</param>
            /// <param name="domnode">可选</param>
            this.base();
            this.view = view;
            this.node = node;
            this.domnode = domnode;
            if (this.node.nodeType == 1) {
                this.linkToDom(this.node);
            }
            this.withData = withData;
            this._attrs = {};
            this.onDispose(function () {
                var attrs = this._attrs;
                for (var n in attrs) {
                    if (attrs.hasOwnProperty(n) && attrs[n].dispose)
                        attrs[n].dispose();
                }
            });
        });
    });

    //绑定属性解释器
    bingo.factory('$nodeContext', ['$view', '$domnode', '$withData', function ($view, $domnode, $withData) {
        //$domnode, $attr, $withData为可选
        return function (node, withData) {
            //node, withData可选
            node || (node = $domnode && $domnode.node);
            withData || (withData = $withData);
            return _nodeContextClass.NewObject($view, node, withData, $domnode);
        };
    }]);

    //启动
    $(function () {
        //等待动态加载js完成后开始
        bingo.using(function () {
            bingo.start();
        });
    });

})(bingo);(function (bingo) {
    //version 1.0.1
    "use strict";

    /*
        //定义action与service:
    
        //定义system/user/list 和 system/user/form 两个action
        bingo.module('system', function () {
    
            //控制器user
            bingo.controller('user', function () {
    
                //action list
                bingo.action('list', function ($view) {
                    //这里开始写业务代码
                    $view.on('ready', function () {
                    });
    
                });
    
                //action form
                bingo.action('form', function ($view) {
                });
            });
    
        });
    
        //定义system/userService服务
        bingo.module('system', function () {
    
            //userService
            bingo.service('userService', function ($ajax) {
                //这里写服务代码
            });
    
        });
    
    */

    var _makeInjectAttrs = bingo._makeInjectAttrs;

    var _serviceFn = function (name, fn) {
        if (arguments.length == 1)
            return this._services[name];
        else
            return this._services[name] = _makeInjectAttrs(fn);
    }, _controllerFn = function (name, fn) {
        var conroller = this._controllers[name];
        if (!conroller)
            conroller = this._controllers[name] = {
                name: name, _actions: {},
                action: _actionFn
            };
        if (bingo.isFunction(fn)) {
            try {
                _lastContoller = conroller;
                fn();
            } finally {
                _lastContoller = null;
            }
        }
        return conroller;
    }, _actionFn = function (name, fn) {
        if (arguments.length == 1)
            return this._actions[name];
        else
            return this._actions[name] = _makeInjectAttrs(fn);
    };

    var _module = {}, _lastModule = null, _lastContoller = null;
    bingo.extend({
        //定义或获取模块
        module: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            var module = null;
            //if (arguments.length == 1)
                module = _module[name];

            if (!module)
                module = _module[name] = {
                    name: name, _services: {}, _controllers: {},
                    service: _serviceFn,
                    controller: _controllerFn
                };

            if (bingo.isFunction(fn)) {
                try {
                    _lastModule = module;
                    fn();
                } finally {
                    _lastModule = null;
                }
            }
            return module;
        },
        //定义服务,没有返回, 只用于定义
        service: function (name, fn) {
            if (this.isNullEmpty(name) || !_lastModule) return null;
            _lastModule.service.apply(_lastModule, arguments);
        },
        //定义ctrl,没有返回, 只用于定义
        controller: function (name, fn) {
            if (this.isNullEmpty(name) || !_lastModule) return;
            _lastModule.controller.apply(_lastModule, arguments);
        },
        //定义action,没有返回, 只用于定义
        action: function (name, fn) {
            if (this.isNullEmpty(name) || !_lastContoller) return;
            _lastContoller.action.apply(_lastContoller, arguments);
        }
    });

    bingo.factory('$service', ['$view', function ($view) {

        return function (name, moduleName) {
            if (bingo.isNullEmpty(name) || $view.isDisposed) return null;
            var service;
            if (arguments.length > 1) {
                service = bingo.module(moduleName).service(name);
            } else {
                var module = $view.$getModule();
                if (!module) return null;
                service = module.service(name);
            }
            if (!service) return null;

            return bingo.inject(service, $view);
        };

    }]);

})(bingo);
(function (bingo) {
    //version 1.0.1
    "use strict";

    /*
        //1. 添加或设置路由'view'
        bingo.route('view', {
            //路由地址
            url: 'view/{module}/{controller}/{action}',
            //路由转发到地址
            toUrl: 'modules/{module}/views/{controller}/{action}.html',
            //默认值
            defaultValue: { module: '', controller: '', action: '' }
        });

        //2. 根据url生成目标url;
            var url = bingo.route('view/system/user/list');
                返回结果==>'modules/system/views/user/list.html'
    */
    //路由
    bingo.route = function (p, context) {
        if (arguments.length == 1)
            return bingo.routeContext(p).toUrl;
        else
            p && context && _routes.add(p, context);
    };

    /*
        //根据url生成routeContext;
        var routeContext = bingo.route('view/system/user/list');
            返回结果==>{
                url:'view/system/user/list',
                toUrl:'modules/system/views/user/list.html',
                params:{ module: 'system', controller: 'user', action: 'list' }
            }
    */
    //
    bingo.routeContext = function (url) {
        return _routes.getRouteByUrl(url);
    };

    /*
        //生成路由地址
        bingo.routeLink('view', { module: 'system', controller: 'user', action: 'list' });
            返回结果==>'view/system/user/list'
    */
    bingo.routeLink = function (name, p) {
        var r = _routes.getRuote(name);
        return r ? _paramToUrl(r.context.url, p, 1) : '';
    };


    var _tranAttrRex = /\{(.+)\}/gi;
    var _urlToParams = function (url, routeContext) {
        //将url转成参数
        // 如'view/{module}/{contrller}/{action}' ==> {module:'', contrller:'', action:''}
        if (!url || !routeContext.url) return null;
        var matchUrl = routeContext.url;
        if (matchUrl.indexOf('*')>=0) {
            routeContext._reg || (routeContext._reg = new RegExp(matchUrl.replace('*', '.*')));
            return routeContext._reg.test(url) ? {} : null;
        }
        var urlParams = url.split('$');
        var urlList = urlParams[0].split('/'), matchUrlList = (routeContext._matchUrlList || (routeContext._matchUrlList = matchUrl.split('/')));
        if (urlList.length != matchUrlList.length) return null;
        var obj = {}, isOk = true, sTemp;
        bingo.each(matchUrlList, function (item, index) {
            sTemp = urlList[index];
            _tranAttrRex.lastIndex = 0;
            if (_tranAttrRex.test(item)) {
                obj[item.replace(_tranAttrRex, '$1')] = decodeURIComponent(sTemp||'');
            } else {
                isOk = (item == sTemp);
                if (!isOk) return false;
            }
        });
        if (isOk && urlParams.length > 1) {
            urlParams = bingo.sliceArray(urlParams, 1);
            bingo.each(urlParams, function (item, index) {
                var list = item.split(':'), name = list[0], val = decodeURIComponent(list[1] || '');
                name && (obj[name] = val);
            });
        }
        return isOk ? obj : null;
    }, _translate = function (url, toUrl, params) {
        //routeContext默认translate
        return { params: params, url: url, toUrl: toUrl };
    }, _paramToUrl = function (url, params, paramType) {
        //_urlToParams反操作, paramType:为0转到普通url参数(?a=1&b=2), 为1转到route参数($a:1$b:2)
        _tranAttrRex.lastIndex = 0;
        if (!url || !_tranAttrRex.test(url) || !params) return url;
        var otherP = '', attr = '', val = '';
        for (var n in params) {
            attr = ['{', n, '}'].join('');
            val = encodeURIComponent(params[n] || '');
            if (url.indexOf(attr) >= 0) {
                url = bingo.replaceAll(url, attr, val);
            } else{
                if (paramType == 1) {
                    otherP = [otherP, '$', n ,':', val].join('');
                } else {
                    otherP = [otherP, '&', n, '=', val].join('');
                }
            }
        }
        if (otherP) {
            if (paramType == 1) {
                url = [url, otherP].join('');
            } else {
                if (url.indexOf('?') >= 0)
                    url = [url, otherP].join('');
                else
                    url = [url, otherP.substr(1)].join('?');

            }
        }

        return url;
    };

    var _routes = {
        datas: [],
        defaultRoute: {
            url: '*',
            translate: function (url, toUrl, params) {
                return { params: {}, url: url, toUrl: url };
            }
        },
        add: function (name, context) {
            context.translate || (context.translate = _translate);
            var route = this.getRuote(name);
            if (route) { route.context = context; return; }
            this.datas.push({
                name: name,
                context: context
            });
        },
        getRuote: function (name) {
            var item = null;
            bingo.each(this.datas, function () {
                if (this.name == name) { item = this; return false; }
            });
            return item;
        },
        getRouteByUrl: function (url) {
            var routeContext = null;
            var params = null;
            bingo.each(this.datas, function () {
                routeContext = this.context;
                params = _urlToParams(url, routeContext)
                if (params) return false;
            });
            if (!params)
                routeContext = _routes.defaultRoute;
            if (params || routeContext.defaultValue)
                params = bingo.extend({}, routeContext.defaultValue, params);
            var toUrl = _paramToUrl(routeContext.toUrl, params);
            return routeContext.translate(url, toUrl, params);
        }
    };

    //设置view资源路由
    bingo.route('view', {
        //路由url, 如: view/system/user/list
        url: 'view/{module}/{controller}/{action}',
        //路由到目标url, 生成:modules/system/views/user/list.html
        toUrl: 'modules/{module}/views/{controller}/{action}.html',
        //变量默认值, 框架提供内部用的变量: module, controller, action, service
        defaultValue: { module: 'system', controller: 'user', action: 'list' }
        //如果toUrl不能满足须要时, 可以使用translate
        /*
        , translate: function (url, toUrl, params) {
            params = bingo.extend({
                module: 'system',
                controller: 'user',
                action: 'list', service: 'user'
            }, params);

            return {
                params: params,
                url: url, toUrl: 'modules/' + params.module + '/' + params.controller
            };
        }
        */
    });

    //设置controller资源路由
    bingo.route('ctrl', {
        url: 'ctrl/{module}/{controller}/{action}',
        toUrl: 'modules/{module}/controllers/{controller}.js',
        defaultValue: { module: 'system', controller: 'user', action: 'list' }
    });

    //设置service资源路由
    bingo.route('service', {
        url: 'service/{module}/{service}',
        toUrl: 'modules/{module}/services/{service}.js',
        defaultValue: { module: 'system', service: 'user' }
    });


    /*
        $route('view/system/user/list')
            结果为: 'modules/system/views/user/list.html'
    */
    bingo.factory('$route', function () {
        return function (url) {
            return bingo.route(url);
        };
    });

})(bingo);
//todo:
(function (bingo) {
    //version 1.0.1
    "use strict";

    /*
        观察模式类
    */
    var _observerClass = bingo.mvc.observerClass = bingo.Class(function () {
        var _newItem = function (watch, context, callback, deep, disposer) {
            var _isFn = bingo.isFunction(context),
                //取值
                _getValue = function () {
                    var val;
                    if (_isFn) {
                        //如果是function
                        if (disposer && disposer.isDisposed) { setTimeout(function () { item.dispose(); }); return; }
                        val = context.call(item);
                    }
                    else {
                        var scope = watch._view;
                        val = bingo.datavalue(scope, context);
                        if (bingo.isUndefined(val))
                            val = bingo.datavalue(window, context);
                    }
                    return val;
                },
                _oldValue = _getValue();
            if (deep) _oldValue = bingo.clone(_oldValue);
            var item = {
                check: function () {
                    if (disposer && disposer.isDisposed) { setTimeout(function () { item.dispose(); }); return; }
                    var newValue = _getValue();
                    if (bingo.isVariable(newValue)) {
                        //如果是Variable变量
                        _oldValue = newValue;
                        //_obsCheck接口
                        if (newValue._obsCheck()) {
                            callback.call(this, newValue());
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


        this.Define({
            subscribe: function (context, callback, deep, disposer) {
                /// <summary>
                /// 订阅
                /// </summary>
                /// <param name="context">
                ///     观察内容:
                ///         $view的属性, 如, $view.title = '标题', subscribe('title'....
                ///         方法如果subscribe(function(){ return $view.title;}, .....
                /// </param>
                /// <param name="callback">
                ///     观察到改变后执行的内容
                /// </param>
                /// <param name="deep">是否深层比较, 默认简单引用比较</param>
                /// <param name="disposer">自动释放对象, 必须是bingo.Class定义对象</param>
                /// <returns value='{check:function(){}, dispose:function(){}}'></returns>
                var item = _newItem(this, context, callback, deep, disposer);
                this._subscribes.push(item);
                return item;
            },
            //发布信息
            publish: function () {
                //计数清0
                this._publishTime = 0;
                this._publish && this._publish();
            },
            publishAsync: function () {
                if (!this._pbAsync_) {
                    var $this = this;
                    this._pbAsync_ = setTimeout(function () {
                        $this._pbAsync_ = null; $this.publish();
                    }, 5);
                }
                return this;
            },
            _publishTime: 0,//发布计数
            _publish: function () {
                var isChange = false;
                bingo.each(this._subscribes, function () {
                    if (this.check())
                        isChange = true;
                });
                if (isChange && this._publishTime < 10) {
                    //最多连接10次, 防止一直发布
                    this._publishTime++;
                    var $this = this;
                    setTimeout(function () { $this.isDisposed || $this.publish(); });
                }
            },
            _remove: function (item) {
                this._subscribes = bingo.removeArrayItem(item, this._subscribes);
            }
        });

        this.Initialization(function (view) {
            this._view = view,
            this._isPause = false,
            this._subscribes = [];

            this.disposeByOther(view);
            this.onDispose(function () {
                bingo.each(this._subscribes, function () {
                    this.dispose()
                });
            });
        });

    });

    bingo.factory('$observer', ['$view', function ($view) {
        return $view.__observer__ || ($view.__observer__ = _observerClass.NewObject($view));
    }]);


    /*
        $view.title = '标题';
        $view.text = '';

        $subs('title', function(newValue){
	        $view.text = newValue + '_text';
        });

        ........
        $view.title = '我的标题';
        $view.$update();
    */
    bingo.each(['$subscribe', '$subs'], function (name) {
        bingo.factory(name, ['$observer', '$attr', function ($observer, $attr) {
            return function (p, callback, deep) {
                return $observer.subscribe(p, callback, deep, $attr);
            };
        }]);
    });


    /*
        观察变量: bingo.variable
        提供自由决定change状态, 以决定是否需要同步到view层
        使用$setChange方法设置为修改状态
    */
    bingo.variable = function (p, owner, view) {
        var value = bingo.variableOf(p);
        var fn = function (p1) {
            p1 = bingo.variableOf(p1);
            var $this = owner || this;
            if (arguments.length == 0) {
                return value;
            } else {
                var change = !bingo.equals(value, p1);
                value = p1;
                if (change)
                    fn.$setChange();
                else
                    fn._onAssign && fn._onAssign().trigger([value]);
                return $this;
            }
        };
        fn._isVar_ = _isVar_;
        fn._isChanged = true;
        fn.size = function () { return value && value.length; };
        fn._triggerChange = function () {
            this._onAssign && this._onAssign().trigger([value]);
            this._onSubscribe && this._onSubscribe().trigger([value]);
            view && view.$updateAsync();
        };
        //赋值事件(当在赋值时, 不理值是否改变, 都发送事件)
        fn.$assign = function (callback) {
            (this._onAssign || (this._onAssign = bingo.Event(fn))).on(callback);
            return this;
        };
        //改变值事件(当在赋值时, 只有值改变了, 才发送事件)
        fn.$subs = function (callback) {
            (this._onSubscribe || (this._onSubscribe = bingo.Event(fn))).on(callback);
            return this;
        };
        //设置修改状态
        fn.$setChange = function (isChanged) {
            this._isChanged = (isChanged !== false);
            if (this._isChanged) {
                this._triggerChange();
            }
            return this;
        };
        //用于observer检查
        fn._obsCheck = function () {
            var isChanged = this._isChanged;
            this._isChanged = false;
            return isChanged;
        };
        //fn.toString = function () { return bingo.toStr(value); };
        return fn;
    };
    var _isVar_ = 'isVar1212', _isModel_ = 'isModel1212';
    bingo.isVariable = function (p) { return p && p._isVar_ == _isVar_; };
    bingo.variableOf = function (p) { return bingo.isVariable(p) ? p() : p; };
    bingo.isModel = function (p) { return p && p._isModel_ == _isModel_; };
    bingo.modelOf = function (p) { p = bingo.variableOf(p);  return bingo.isModel(p) ? p.toObject() : p; };

    var _toObject = function (obj) {
        var o = obj || {}, item, val;
        for (var n in this) {
            if (this.hasOwnProperty(n)) {
                item = this[n];
                if (bingo.isVariable(item)) {
                    val = item();
                    if (bingo.isVariable(o[n]))
                        o[n](val);
                    else
                        o[n] = val;
                }
            }
        }
        return o;

    }, _formObject = function (obj) {
        if (obj) {
            var item;
            for (var n in obj) {
                if (obj.hasOwnProperty(n) && this.hasOwnProperty(n)) {
                    item = this[n];
                    if (bingo.isVariable(item)) {
                        item(obj[n]);
                    }
                }
            }
        }
        return this;
    };
    bingo.model = function (p, view) {
        p = bingo.modelOf(p);
        var o = {}, item;
        for (var n in p) {
            if (p.hasOwnProperty(n)) {
                item = p[n];
                o[n] = bingo.variable(item, o, view);
            }
        }
        o._isModel_ = _isModel_;
        o.toObject = _toObject;
        o.formObject = _formObject;
        return o;
    };

    /*
        $view.datas = {
	        userList:$var([{name:'张三'}, {name:'李四'}])
        };

        var list = $view.datas.userList();
        list.push([{name:'王五'}]);
        $view.datas.userList(list);//重新赋值, 会自动更新到$view
        // $view.datas.userList.$setChange();//或调用$setChange强制更新

        //可以观察值(改变时)
        $view.data.userList.onChange(function(value){ console.log('change:', value); });

        //可以观察值(无论有没改变)
        $view.data.userList.onSubs(function(value){ console.log('change:', value); });

    */
    bingo.factory('$var',['$view', function ($view) {
        return function (p, owner) { return bingo.variable(p, owner, $view); };
    }]);
    /*
        $view.datas = $model({
	        id:'1111',
            name:'张三'
        });

        //设置值, 可以使用链式写法, 并会自动更新到$view
        $view.datas.id('2222').name('张三');
        //获取值
        var id = $view.data.id();

        //可以观察值(改变时)
        $view.data.id.onChange(function(value){ console.log('change:', value); });

        //可以观察值(无论有没改变)
        $view.data.id.onSubs(function(value){ console.log('change:', value); });
    */
    bingo.factory('$model', ['$view', function ($view) {
        return function (p) { return bingo.model(p, $view); };
    }]);

})(bingo);//todo:_linqClass的edit等

(function (bingo) {
    //version 1.0.1
    "use strict";

    var _linqClass = bingo.linqClass = bingo.Class(function () {

        this.Define({
            each: function (fn, index, rever) {
                this._doLastWhere();
                bingo.each(this._datas, fn, index, rever);
                return this;
            },
            where: function (fn, index, count, rever) {
                /// <summary>
                /// 过滤<br />
                /// where(function(item, index){ return item.max > 0 ;});
                /// </summary>
                /// <param name="fn" type="function(item, index)"></param>
                /// <param name="index" type="Number">开始位置, 如果负数从后面算起</param>
                /// <param name="count" type="Number">数量</param>
                /// <param name="rever" type="Boolean">反向</param>

                this._doLastWhere();
                this._lastWhere = {
                    fn: fn, index: index,
                    count: bingo.isNumeric(count) ? count : -1,
                    rever: rever
                };
                return this;
            },
            _lastWhere:null,
            _doLastWhere: function (index, count, rever) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="index" type="Number">开始位置, 如果负数从后面算起</param>
                /// <param name="count" type="Number">数量</param>
                /// <param name="rever" type="Boolean">反向</param>

                var lastWhere = this._lastWhere;
                if (lastWhere) {
                    this._lastWhere = null;
                    var fn = lastWhere.fn,
                        index = bingo.isNumeric(index) ? index : lastWhere.index,
                        count = bingo.isNumeric(count) ? count : lastWhere.count,
                        rever = !bingo.isUndefined(rever) ? rever : lastWhere.rever;

                    var list = [];
                    this.each(function (item, index) {
                        if (fn.call(item, item, index)) {
                            list.push(item);
                            if (count != -1) {
                                count--;
                                if (count == 0) return false;
                            }
                        }
                    }, index, rever);
                    this._datas = list;
                }
                return this;
            },
            select: function (fn, isMerge) {
                /// <summary>
                /// 映射(改造)<br />
                /// select(function(item, index){ return {a:item.__a, b:item.c+item.d} ;});
                /// </summary>
                /// <param name="fn" type="function(item, index)"></param>
                /// <param name="isMerge">是否合并数组</param>
                this._doLastWhere();
                var list = [];
                this.each(function (item, index) {
                    if (isMerge === true)
                        list = list.concat(fn.call(item, item, index));
                    else
                        list.push(fn.call(item, item, index));
                });
                this._datas = list;
                return this;
            },
            sort: function (fn) {
                /// <summary>
                /// 排序, sort(function(item1, item2){return item1-item2;})<br />
                /// item1 - item2:从小到大排序<br />
                /// item2 - item1:从大到小排序<br />
                /// item1 大于 item2:从小到大排序<br />
                /// item1 小于 item2:从大到小排序
                /// </summary>
                /// <param name="fn" type="function(item1, item2)"></param>
                this._doLastWhere();
                this._datas = this._datas.sort(function (item1, item2) {
                    var n = fn(item1, item2);
                    return n > 0 || n === true ? 1 : (n < 0 || n === false ? -1 : 0);
                });
                return this;
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
                    else if (p)
                        return item1[p] - item2[p];
                    else
                        return item1 - item2;
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
                    else if (p)
                        return item2[p] - item1[p];
                    else
                        return item2 - item1;
                });
            },
            unique: function (fn) {
                /// <summary>
                /// 去除重复<br />
                /// 用法1. unique()<br />
                /// 用法2. unique(function(item, index){ return item['prop']; });
                /// </summary>
                /// <param name="fn" type="function(item, index)">可选</param>
                this._doLastWhere();
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
                return this;
            },
            count: function () { this._doLastWhere(); return this._datas.length; },
            first: function (defaultValue) {
                /// <summary>
                /// 查找第一个数据
                /// </summary>
                /// <param name="defaultValue">可选, 默认值, 如果没有查找到时</param>
                this._doLastWhere(0, 1);
                return this._datas[0] || defaultValue;
            },
            last: function (defaultValue) {
                /// <summary>
                /// 查找最后一个数据
                /// </summary>
                /// <param name="defaultValue">可选, 默认值, 如果没有查找到时</param>
                this._doLastWhere(0, 1, true);
                return this._datas[0] || defaultValue;
            },
            contain: function () {
                /// <summary>
                /// 是否存在数据
                /// </summary>
                this._doLastWhere(0, 1);
                return this.count() > 0;
            },
            sum: function (callback) {
                this._doLastWhere();
                var n = 0;
                this.each(function (item, index) {
                    n += (callback ? callback.call(this, this, index) : item);
                });
                return n;
            },
            avg: function (callback) {
                this._doLastWhere();
                var n = 0;
                this.each(function (item, index) {
                    n += (callback ? callback.call(this, this, index) : item);
                });
                return (n == 0 ? 0 : n / this._datas.length);
            },
            min: function (callback) {
                this._doLastWhere();
                var n = -1, val, temp;
                this.each(function (item, index) {
                    val = (callback ? callback.call(item, item, index) : item);
                    if (index == 0 || n > val) {
                        n = val; temp = item;
                    }
                });
                return temp;
            },
            max: function (callback) {
                this._doLastWhere();
                var n = -1, val, temp;
                this.each(function (item, index) {
                    val = (callback ? callback.call(item, item, index) : item);
                    if (index == 0 || n < val) {
                        n = val; temp = item;
                    }
                });
                return temp;
            },
            take: function (pos, count) {
                this._doLastWhere();
                if (isNaN(count) || count < 0)
                    count = this.count();
                return bingo.sliceArray(this._datas, pos, count);
            },
            toArray: function () { this._doLastWhere(); return this._datas;},
            toPage: function (page, pageSize) {
                var list = this.toArray();
                var currentPage = 1, totalPage = 1, pageSize = pageSize, totals = list.length, list = list;
                if (list.length > 0) {
                    totalPage = parseInt(totals / pageSize) + (totals % pageSize != 0 ? 1 : 0);
                    currentPage = page > totalPage ? totalPage : page < 1 ? 1 : page;
                    list = this.take((currentPage - 1) * pageSize, pageSize);
                }
                return {
                    currentPage: currentPage, totalPage: totalPage, pageSize: pageSize,
                    totals: totals, list: list
                };
            },
            _getGroupByValue: function (value, rList, groupName) {
                for (var i = 0, len = rList.length; i < len; i++) {
                    if (rList[i][groupName] == value)
                        return rList[i];
                }
                return null;
            },
            group: function (callback, groupName, itemName) {
                /// <summary>
                /// 分组
                /// </summary>
                /// <param name="callback">function(item index){ return item.type;}</param>
                /// <param name="groupName">可选, 分组值, 默认group</param>
                /// <param name="itemName">可选, 分组内容值, 默认items</param>

                groupName || (groupName = 'group');
                itemName || (itemName = 'items');
                this._doLastWhere();
                var rList = [], list = this._datas;
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
                return this;
            }
        });

        this.Initialization(function (p) {
            this._datas = p || [];
        });
    });

    bingo.linq = function (list) { return _linqClass.NewObject(list); };

    bingo.factory('$linq', function () {
        return function (p) { return bingo.linq(p); };
    });

})(bingo);
bingo.factory('$node', ['node', function (node) {
    return $(node);
}]);
(function (bingo) {
    //version 1.0.1
    "use strict";

    /*
        _ajaxClass.NewObject(url).view($view)
            .async(true).dataType('json').cache(false)
            .param({})
            .success(function(rs){})
            .error(function(rs){})
            .alway(function(rs){})
            .post() //.get()
    */
    var _ajaxClass = bingo.mvc.ajaxClass = bingo.Class(function () {

        var _disposeEnd = function (servers) {
            servers._updateView();
            setTimeout(function () {
                servers.dispose();
            }, 1);
        };

        var _cacheObj = {};

        var _loadServer = function (servers, type) {
            /// <param name="servers" value='_ajaxClass.NewObject()'></param>
            var view = servers.view();
            if (servers.isDisposed && view.isDisposed) return;
            var datas = bingo.clone(servers.param() || {});
            var cacheKey = null, url = bingo.route(servers.url());
            var isCache = servers.cache();
            if (isCache) {
                cacheKey = url.toLowerCase();
                if (cacheKey in _cacheObj) {
                    if (servers.async())
                        setTimeout(function () { servers.isDisposed || view.isDisposed || servers.deferred().resolveWith(servers, [_cacheObj[cacheKey]]); });
                    else
                        servers.deferred().resolveWith(servers, [_cacheObj[cacheKey]]);
                    return;
                }
            }

            $.ajax({
                type: type,
                url: url,
                data: datas,
                async: servers.async(),
                cache: false,
                dataType: servers.dataType(),
                success: function (response) {
                    if (isCache)
                        _cacheObj[cacheKey] = response;

                    if (servers.isDisposed && view.isDisposed) return;
                    try {
                        var _dtd = servers.deferred();
                        _dtd.resolveWith(servers, [response]);
                    } finally { _disposeEnd(servers); }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (servers.isDisposed && view.isDisposed) return;
                    try {
                        var _dtd = servers.deferred();
                        _dtd.rejectWith(servers, [xhr, textStatus, errorThrown]);
                    } finally { _disposeEnd(servers); }
                }
            });
        };

        //this.Property({
        //    _url: '',
        //    _view: null
        //});

        this.Variable({
            async: true,
            dataType: 'json',
            param: {},
            cache: false,
            url:''
        });

        this.Define({
            view: function (v) {
                if (arguments.length == 0) return this._view;
                this._view = v;
                this.disposeByOther(v);
                return this;
            },
            _updateView: function () {
                //如果有sync由它更新view
                if (this._sync_ && this._sync_.view && this._sync_.view()) return;
                var view = this.view();
                view && view.$update && view.$update();
            },
            deferred: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns value='$.Deferred()'></returns>
                this._dtd || (this._dtd = $.Deferred());
                return this._dtd;
            },
            success: function (callback) {
                this.deferred().done(callback);
                return this;
            },
            error: function (callback) {
                this.deferred().fail(callback);
                return this;
            },
            alway: function (callback) {
                this.deferred().always(callback);
                return this;
            },
            //依赖ajaxSync
            _withSync: function () {
                var lastSync = _ajaxSyncClass.lastSync();
                if (!lastSync) return this;
                lastSync.addCount();
                this._sync_ = lastSync;
                return this.success(function () {
                    setTimeout(function () { lastSync.decCount(); }, 1);
                }).error(function () {
                    setTimeout(function () { lastSync.reject(); }, 1);
                });
            },
            post: function () {
                if (this.async()) this._withSync();
                _loadServer(this, 'post');
                this.post = bingo.noop;
                return this;
            },
            get: function () {
                if (this.async()) this._withSync();
                _loadServer(this, 'get');
                this.get = bingo.noop;
                return this;
            }
        });

        this.Initialization(function (url) {
            this.url(bingo.route(url));
        });
    });


    var _ajaxSyncClass = bingo.mvc.ajaxaSyncClass = bingo.Class(function () {

        this.Static({
            syncList: [],
            lastSync: function () {
                var syncList = this.syncList;
                var len = syncList.length;
                return len > 0 ? syncList[len - 1] : null;
            }
        });

        this.Define({
            view: function (v) {
                if (arguments.length == 0) return this._view;
                this._view = v;
                this.disposeByOther(v);
                return this;
            },
            deferred: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns value='$.Deferred()'></returns>
                this._dtd || (this._dtd = $.Deferred());
                return this._dtd;
            },
            success: function (callback) {
                this.deferred().done(callback);
                return this;
            },
            error: function (callback) {
                this.deferred().fail(callback);
                return this;
            },
            alway: function (callback) {
                this.deferred().always(callback);
                return this;
            },
            //解决, 马上成功
            resolve: function () {
                this._count = 0;
                this._dtd && this.deferred().resolve();

                this._updateView();

                this.dispose();
            },
            //拒绝, 马上失败
            reject: function (args) {
                this._count = 0;
                this._dtd && this.deferred().reject();
                this.dispose();
            },
            //依赖另一个ajaxSync
            withSync: function (syncObj) {
                this.addCount();
                var $this = this;
                this._syncObj_ = syncObj;
                syncObj.error(function () {
                    setTimeout(function () { $this.reject(); }, 1);
                }).success(function () {
                    setTimeout(function () { $this.decCount(); }, 1);
                });
                return this;
            },
            _updateView: function () {
                if (this._syncObj_ && this._syncObj_.view && this._syncObj_.view()) return;
                var view = this.view();
                view && view.$update && view.$update();
            },
            //计数加一
            addCount: function () {
                this._count++; return this;
            },
            //计数减一, 计数为0时, 解决所有
            decCount: function () {
                this._count--;
                this._checkResolve();
                return this;
            },
            _checkResolve: function () {
                if (this._count <= 0) { this.resolve(); }
            }
        });

        this.Initialization(function () {
            this._count = 0;
        });
    });


    /*
        //同步syncAll
        $ajax.syncAll(function(){
            
            //第一个请求
            $ajax(url).post()
            //第二个请求, 或更多
            $ajax(url).post()
            .......

        }).success(function(){
	        //所有请求成功后, 
        });
    */
    bingo.factory('$ajax', ['$view', function ($view) {
        var fn = function (url) {
            return _ajaxClass.NewObject(url).view($view);
        };
        fn.syncAll = function (callback) { return _syncAll(callback, $view); };
        return fn;
    }]);

    var _syncAll = function (callback, view) {
        if (!callback) return null;
        var syncList = _ajaxSyncClass.syncList;
        var lastSync = _ajaxSyncClass.lastSync();
        var syncObj = _ajaxSyncClass.NewObject();
        view && syncObj.view(view);
        lastSync && lastSync.withSync(syncObj);
        syncList.push(syncObj);
        callback && callback();
        syncList.pop();
        setTimeout(function () { syncObj._checkResolve && syncObj._checkResolve(); }, 1);
        return syncObj;
    };

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


/*
    //异步执行内容, 并自动同步view数据
    $timeout(function(){
	    $view.title = '我的标题';
    }, 100);
*/
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

/*
    与bg-frame同用, 取bg-frame的url等相关
    $location.href('view/system/user/list');
    var href = $location.href();
    var params = $location.params();


    $location.onChange请参考bg-frame定义
*/

bingo.location = function (node) {
    var $node = $(node || document.documentElement);
    var frameName = 'bg-frame';
    return {
        params: function () {
            var url = this.href();
            var routeContext = bingo.routeContext(url);
            return routeContext.params;
        },
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
        onChange: function (callback) {
            callback && this.frame().on(frameName + '-change', function (e, url) {
                callback.call(this, url);
            });
        },
        onLoaded: function (callback) {
            callback && this.frame().on(frameName + '-loaded', function (e, url) {
                callback.call(this, url);
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

}]);/*
    使用方法:
    bg-controller="function($view){}"   //直接绑定一个function
    bg-controller="ctrl/system/user"    //绑定到一个url
*/
bingo.command('bg-controller', function () {
    return {
        //优先级, 越大越前
        priority: 1000,
        //模板
        tmpl: '',
        //外部模板
        tmplUrl: '',
        //是否替换节点, 默认为false
        replace: false,
        //是否indclude, 默认为false, 模板内容要包函bg-include
        include: false,
        //是否新view, 默认为false
        view: true,
        //新view是否自动发送ready事件, view为true才有效, 默认为true, 这里为false要手动发送
        readyAuto:false,
        //是否编译子节点, 默认为true
        compileChild: false,
        //编译前, 没有$domnode和$attr注入, 即可以用不依懒$domnode和$attr的所有注入, 如$view/node/$node/$ajax...
        compilePre: null,
        //controller
        controller: null,
        //link
        link: null,
        //编译, (compilePre编译前-->compile编译-->controller初始数据-->link连接command)
        compile: ['$view', '$tmpl', '$node', '$attr', function ($view, $tmpl, $node, $attr) {
            var attrVal = $attr.$prop(), val = null;
            if (!bingo.isNullEmpty(attrVal)) {
                val = $attr.$context();
                //如果没有取父域
                if (!val) val = $attr.$context(null, $view.parentView);
            }

            if (bingo.isNullEmpty(attrVal)
                || bingo.isFunction(val) || bingo.isArray(val)) {
                //如果是function或数组, 直接当controller, 或是空值时

                //添加controller
                val && $view.$addController(val);
                //编译
                $tmpl.fromNode($node).compile(function () {
                    if ($view.isDisposed) return;
                    //readyAuto为false, 编译完成后要发送ready事件, 
                    $view.$sendReady();
                });
            } else {
                //使用url方式, 异步加载contorllor, 走mvc开发模式
                var url = attrVal;
                if (!bingo.isNullEmpty(url)) {
                    bingo.using(url, function () {
                        if ($view.isDisposed) return;

                        //route解释url
                        var routeContext = bingo.routeContext(url);
                        //解释出来的urlparam
                        var params = routeContext.params;
                        //取module
                        var module = bingo.module(params.module);
                        //取controller
                        var controller = module ? module.controller(params.controller) : null;
                        //取action
                        var action = controller ? controller.action(params.action) : null;
                        if (!module || !action) return;

                        //设置module
                        $view.$setModule(module);
                        //添加controller
                        $view.$addController(action);
                        //编译
                        $tmpl.fromNode($node).compile(function () {
                            if ($view.isDisposed) return;
                            //readyAuto为false, 编译完成后要发送ready事件, 
                            $view.$sendReady();
                        });
                    });
                }
            }
        }]
    };
});
/*
    使用方法:
    bg-event="{click:function(e){}, dblclick:helper.dblclick}"
    bg-click="helper.click"     //绑定到方法
    bg-click="helper.click()"   //直接执行方法
*/
bingo.each('event,click,blur,dblclick,focus,focusin,focusout,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit'.split(','), function (eventName) {
    bingo.command('bg-' + eventName, function () {

        return ['$view', '$node', '$attr', function ($view, $node, $attr) {

            var bind = function (evName, callback) {
                $node.on(evName, function () {
                    //console.log(eventName);
                    callback.apply(this, arguments);
                    $view.$update();
                });
            };

            if (eventName != 'event') {
                var fn = $attr.$value();
                if (!bingo.isFunction(fn))
                    fn = function (e) { $attr.$eval(e); };
                bind(eventName, fn);
            } else {
                var evObj = $attr.$context();
                if (bingo.isObject(evObj)) {
                    var fn = null;
                    for (var n in evObj) {
                        if (evObj.hasOwnProperty(n)) {
                            fn = evObj[n];
                            if (bingo.isFunction(fn))
                                bind(n, fn);
                        }
                    }
                }
            }

        }];

    });
});

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


/*
    使用方法:
    bg-frame="view/system/user/list"

    连接到view/system/user/list, 目标:main
    <a href="#view/system/user/list" bg-target="main">在main加载连接</a>
    设置frame:'main'
    <div bg-frame="" bg-frame-name="main"></div>
*/
bingo.command('bg-frame', function () {
    return {
        priority: 1000,
        replace: false,
        view: true,
        compileChild: false,
        compile: ['$tmpl', '$node', '$attr', '$location', function ($tmpl, $node, $attr, $location) {
            var _lastTmpl = null;
            $location.onChange(function (url) {
                _lastTmpl && _lastTmpl.stop();
                _lastTmpl = $tmpl.fromUrl(url).appendTo($node).compilePre(function () {
                    $node.html('');
                }).compile(function () {
                    _lastTmpl = null;
                    $node.trigger('bg-frame-loaded', [url]);
                });
            });
            var url = $attr.$prop();
            url && $location.href(url);
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
    return ['$attr', '$node', function ($attr, $node) {
        var _set = function (val) {
            $node.html(bingo.toStr(val));
        };
        $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
            _set(newValue);
        });
        $attr.$init(function () { return $attr.$context() }, function (value) {
            _set(value);
        });

    }];
});
/*
    使用方法:
    bg-attr="{src:'text.html', value:'ddd'}"
    bg-prop="{disabled:false, checked:true}"
    bg-checked="true" //直接表达式
    bg-checked="helper.checked" //绑定到变量, 双向绑定
*/
bingo.each('attr,prop,src,checked,disabled,readonly,class'.split(','), function (attrName) {
    bingo.command('bg-' + attrName, function () {

        return ['$view', '$attr', '$node', function ($view, $attr, $node) {

            var _set = function (val) {
                switch (attrName) {
                    case 'attr':
                        //bg-attr="{src:'text.html', value:'ddd'}"
                        $node.attr(val);
                        break;
                    case 'prop':
                        $node.prop(val);
                        break;
                    case 'disabled':
                    case 'readonly':
                    case 'checked':
                        $node.prop(attrName, val);
                        break;
                    default:
                        $node.attr(attrName, val);
                        break;
                }

            };

            $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
                _set(newValue);
            }, (attrName == 'attr' || attrName == 'prop'));

            $attr.$init(function () { return $attr.$context() }, function (value) {
                _set(value);
            });

            if (attrName == 'checked') {
                //如果是checked, 双向绑定
                $node.click(function () {
                    var value = $node.prop('checked');
                    $attr.$value(value);
                    $view.$update();
                });
            }

        }];

    });
});

/*
    使用方法:
    bg-style="{display:'none', width:'100px'}"
    bg-show="true"
    bg-show="res.show"
*/
bingo.each('style,show,hide,visibility'.split(','), function (attrName) {
    bingo.command('bg-' + attrName, function () {

        return ['$attr', '$node', function ($attr, $node) {

            var _set = function (val) {

                switch (attrName) {
                    case 'style':
                        //bg-style="{display:'none', width:'100px'}"
                        $node.css(val);
                        break;
                    case 'hide':
                        val = !val;
                    case 'show':
                        if (val) $node.show(); else $node.hide();
                        break;
                    case 'visibility':
                        val = val ? 'visible' : 'hidden';
                        $node.css(attrName, val);
                        break;
                    default:
                        $node.css(attrName, val);
                        break;
                }
            };

            $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
                _set(newValue);
            }, (attrName == 'style'));

            $attr.$init(function () { return $attr.$context() }, function (value) {
                _set(value);
            });

        }];

    });
});

bingo.command('bg-if', function () {
    return {
        compileChild: false,
        compile: ['$attr', '$node', '$tmpl', function compile($attr, $node, $tmpl) {
            var jo = $($node);
            var html = jo.html();
            jo.html(''); jo = null;
            $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
                if (newValue) {
                    $node.show();
                    $tmpl.fromHtml(html).appendTo($node).compile();
                } else
                    $node.html('').hide();
                //console.log('if ', newValue, html);
            });

        }]
    };
});
bingo.command('bg-model', function () {

    return ['$view', '$node', '$attr', function ($view, $node, $attr) {

        var _isRadio = $node.is(":radio");
        var _isCheckbox = $node.is(":checkbox");
        _isCheckbox && $node.data("checkbox_value_02", $node.val());

        var _emptyString = function (val) {
            return bingo.isNullEmpty(val) ? '' : val;
        }, _getElementValue = function () {
            var jT = $node;
            return _isCheckbox ? (jT.prop("checked") ? jT.data("checkbox_value_02") : '') : jT.val();
        }, _setElementValue = function (value) {
            var jo = $node;
            value = _emptyString(value);
            if (_isCheckbox) {
                jo.data("checkbox_value_02", value);
                jo.prop("checked", (jo.val() == value));
            } else if (_isRadio) {
                jo.prop("checked", (jo.val() == value));
            } else
                jo.val(value);

        };

        if (_isRadio) {
            $node.click(function () {
                var value = _getElementValue();
                $attr.$value(value);
                $view.$update();
            });
        } else {
            $node.on('change', function () {
                var value = _getElementValue();
                $attr.$value(value);
                $view.$update();
            });
        }


        $attr.$subs(function () { return $attr.$value(); }, function (newValue) {
            _setElementValue(newValue);
        });

        $attr.$init(function () { return $attr.$value() }, function (value) {
            _setElementValue(value);
        });

    }];

});

bingo.command('bg-node', function () {

    return ['$attr', '$node', function ($attr, $node) {
        $attr.$value($node[0]);
    }];
});

bingo.command('bg-text', function () {

    return ['$attr', '$node', function ($attr, $node) {
        var _set = function (val) {
            $node.text(bingo.toStr(val));
        };
        $attr.$subs(function () { return $attr.$context(); }, function (newValue) {
            _set(newValue);
        });

        $attr.$init(function () { return $attr.$context() }, function (value) {
            _set(value);
        });

    }];
});
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
