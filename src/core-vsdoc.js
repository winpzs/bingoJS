(function () {

    var stringEmpty = "",
        toString = Object.prototype.toString,
        noop = function () { },
        undefined;

    var _makeAutoIdTemp = 0, _makeAutoIdTempPointer = 0;

    var bingo = window.bingo = window.bingo = {
        ///<field>调试开关, 默认false</field>
        isDebug: false,
        ///<field>产品版本号</field>
        prdtVersion: '',
        ///<field>空串</field>
        stringEmpty: stringEmpty,
        ///<field>空方法</field>
        noop: noop,
        ///<field>换行符</field>
        newLine: "\r\n",
        isType: function (typename, value) {
        	/// <summary>
            /// String, Array, Boolean, Object, RegExp, Date, Function,Number, 兼容
            /// Null, Undefined,Arguments, IE不兼容
        	/// </summary>
        	/// <param name="typename"></param>
        	/// <param name="value"></param>
            return toString.apply(value) === '[object ' + typename + ']';
        },
        isUndefined: function (obj) {
        	/// <summary>
            /// 是否定义
        	/// </summary>
        	/// <param name="obj"></param>
            return (typeof (obj) === "undefined" || obj === undefined);
        },
        isNull: function (obj) {
        	/// <summary>
            /// 是否Null
        	/// </summary>
        	/// <param name="obj"></param>
            return (obj == null || this.isUndefined(obj));
        },
        isBoolean: function (obj) {
        	/// <summary>
            /// 是否Boolean
        	/// </summary>
        	/// <param name="obj"></param>
            return this.isType("Boolean", obj);
        },
        isNullEmpty: function (s) {
            ///<summary>是否Boolean</summary>
            /// <param name="s"></param>
            return (this.isNull(s) || s == stringEmpty);
        },
        isFunction: function (fun) {
            /// <summary>
            /// 是否为方法
            /// </summary>
            /// <param name="fun"></param>
            return this.isType("Function", fun);
        },
        isNumeric: function (n) {
        	/// <summary>
            /// 是否为数字
            /// </summary>
        	/// <param name="n"></param>
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        isString: function (obj) {
        	/// <summary>
            /// 是否为字串
            /// </summary>
        	/// <param name="obj"></param>
            return this.isType("String", obj);
        },
        isObject: function (obj) {
        	/// <summary>
            /// 是否Object
            /// </summary>
        	/// <param name="obj"></param>
            return !this.isNull(obj) && this.isType("Object", obj);
        },
        isArray: function (value) {
        	/// <summary>
        	/// 是否数组
        	/// </summary>
        	/// <param name="value"></param>
            return Array.isArray ? Array.isArray(value) : this.isType("Array", value);
        },
        isWindow: function (obj) {
        	/// <summary>
        	/// 是否window对象
        	/// </summary>
        	/// <param name="obj"></param>
            return !this.isNull(obj) && obj == obj.window;
        },
        isElement: function (obj) {
        	/// <summary>
        	/// 是否Dom元素
        	/// </summary>
        	/// <param name="obj"></param>
            var t = obj && (obj.ownerDocument || obj).documentElement; return t ? true : false;
        },
        trim: function (str) {
        	/// <summary>
        	/// 去除字串前后空白
        	/// </summary>
        	/// <param name="str"></param>
            return stringEmpty;
        },
        isStringEquals: function (str1, str2) {
            /// <summary>
            /// 字串是否相等, 不分大小写
            /// </summary>
            /// <param name="str1"></param>
            /// <param name="str2"></param>

            return true;
        },
        replaceAll: function (s, str, repl, flags) {
            /// <summary>
            /// 字串替换, 替换所有匹配内容
            /// </summary>
            /// <param name="s"></param>
            /// <param name="str"></param>
            /// <param name="repl"></param>
            /// <param name="flags">默认g, (gmi)</param>
            return '1';
        },
        inArray: function (element, list, index, rever) {
            /// <signature>
            /// <summary>
            /// 返回在数组里的索引
            /// </summary>
            /// <param name="element"></param>
            /// <param name="list"></param>
            /// <param name="index">开始位置</param>
            /// <param name="rever">反向</param>
            /// </signature>
            /// <signature>
            /// <summary>
            /// 返回在数组里的索引
            /// </summary>
            /// <param name="callback" type="function(item, index)"></param>
            /// <param name="list"></param>
            /// <param name="index">开始位置</param>
            /// <param name="rever">反向</param>
            /// </signature>
            if (this.isFunction(element)) intellisenseSetCallContext(element, list[0], [list[0], 0]);
            return 0;
        },
        toStr: function (p) { return this.isUndefined(p) ? '' : p.toString(); },
        removeArrayItem: function (element, list) {
        	/// <summary>
        	/// 删除数组元素
        	/// </summary>
        	/// <param name="element"></param>
        	/// <param name="list"></param>
            /// <returns value='list'></returns>
        },
        sliceArray: function (args, pos, count) {
            /// <summary>
            /// 提取数组, 支持arguments
            /// </summary>
            /// <param name="args"></param>
            /// <param name="pos"></param>
            /// <param name="count">可选, 默认所有</param>
            return args;
        },
        makeAutoId: function () {
        	/// <summary>
        	/// 随机ID
        	/// </summary>
        	/// <returns value='"0"'></returns>
        },
        each: function (list, callback, index, rever) {
        	/// <summary>
        	/// 
        	/// </summary>
        	/// <param name="list"></param>
        	/// <param name="callback" type="function(item, index)"></param>
            /// <param name="index">开始位置, 如果负数从后面算起</param>
            /// <param name="rever">反向</param>

            //callback(data, index){this === data;}
            if (this.isNull(list)) return;
            var temp = list[0];
            callback && callback.call(temp, temp, 0)
        },
        htmlEncode: function (str) {
            return '1';
        },
        htmlDecode: function (str) {
            return '1';
        },
        urlEncode: function (str) {
            return '1';
        },
        urlDecode: function (str) {
            return '1';
        },
        clearObject: function (obj) {
        	/// <summary>
        	/// 对象全部属性设置为null
        	/// </summary>
        	/// <param name="obj"></param>
        },
        extend: function (obj) {
        	/// <summary>
        	/// 扩展属性, 只有一个参数扩展到bing, 两个以上参数, 扩展到第一个参数
        	/// </summary>
            var len = arguments.length;
            if (len <= 0) return obj;
            if (len == 1) {
                for (var n0 in obj) {
                    if (obj.hasOwnProperty(n0)) {
                        this[n0] = obj[n0];
                        if (this.isFunction(obj[n0]))
                            intellisenseSetCallContext(obj[n0], this);
                    }
                }
                return this;
            }
            var ot = null;
            for (var i = 1; i < len; i++) {
                ot = arguments[i];
                if (!this.isNull(ot)) {
                    for (var n in ot) {
                        if (ot.hasOwnProperty(n)) {
                            obj[n] = ot[n];
                        };
                    }
                }
            }
            for (var n in obj) {
                if (obj.hasOwnProperty(n) && this.isFunction(obj[n])) {
                    intellisenseSetCallContext(obj[n], obj);
                }
            }
            return obj;
        },
        clone: function (obj, deep) {
        	/// <summary>
        	/// 复制obj
        	/// </summary>
        	/// <param name="obj"></param>
        	/// <param name="deep">深层复制, 默认为true</param>
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