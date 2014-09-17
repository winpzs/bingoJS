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