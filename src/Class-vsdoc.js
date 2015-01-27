
(function (bingo) {

    var _defineClass = function (define, baseDefine) {
        this._define = define;
        if (baseDefine) this._Base(baseDefine);
    };
    _defineClass.prototype._Base = function (baseDefine) {
        /// <summary>
        /// 基础类, Base(Class1)
        /// </summary>
        /// <param name="baseDefine"></param>

        var define = this._define;
        define.prototype = new baseDefine('NewObject_define');
        define.prototype.constructor = define;

        var _property = define.prototype._property;
        if (_property) {
            define.prototype._property = {};
            _extendObj(define.prototype._property, _property);
        }

        define.prototype.base = function () {
            this.base = bingo.noop;
            baseDefine.prototype._Initialization.apply(this, arguments);
        };
    };
    _defineClass.prototype.Property = function (o) {
    	/// <summary>
    	/// 定义属性
    	/// </summary>
    	/// <param name="o"></param>
        var define = this._define;
        define.prototype._property || (define.prototype._property = {});
        //_makeProperty(define.prototype, o);
        _extendObj(define.prototype._property, o);
        _extendObj(define.prototype, o);
        //define.prototype.Property = function (p) {
        //	/// <summary>
        //	/// 设置或获取参数
        //	/// </summary>
        //	/// <param name="p"></param>
        //    if (arguments.length == 0) return this._property; else { bingo.extend(this._property, p); return this; }
        //};
        return this;
    };
    _defineClass.prototype.Define = function (o) {
        /// <summary>
        /// 定义
        /// </summary>
        /// <param name="o"></param>
        var define = this._define;
        //bingo.extend(define.prototype, o);
        _extendObj(define.prototype, o);
        return this;
    };
    _defineClass.prototype.Extend = function (o) {
        /// <summary>
        /// 扩展
        /// </summary>
        /// <param name="o"></param>
        var define = this._define;

        _extendObj(define.prototype, o);
        return this;
    };
    _defineClass.prototype.Initialization = function (callback) {
        /// <summary>
        /// 初始方法
        /// </summary>
        /// <param name="callback"></param>
        var define = this._define;
        define.prototype._Initialization = callback;
        callback.call(define.prototype);
        return this;
    };
    _defineClass.prototype.Static = function (o) {
        /// <summary>
        /// 静态
        /// </summary>
        /// <param name="o"></param>
        var define = this._define;
        //bingo.extend(define, o);

        _extendObj(define, o);
        return this;
    };
    _defineClass.prototype.Variable = function (o) {
    	/// <summary>
    	/// 读写属性
    	/// </summary>
    	/// <param name="o"></param>
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
        for (var n in src) {
            if (src.hasOwnProperty(n) && bingo.isFunction(src[n])) {
                intellisenseSetCallContext(src[n], src);
            }
        }
    };

    var _makeDefine = function (defineName, define, marger) {
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

        if (marger === true && ot[list[len]]) {
            bingo.extend(ot[list[len]], define);
            return ot[list[len]];
        }
        return ot[list[len]] = define;
    },
    _copyDefine = function (source, target) {
        for (var n in source)
            if (source.hasOwnProperty(n) && !target.hasOwnProperty(n))
                target[n] = source[n];
    };


    bingo.Class = function (defineName, baseDefine, func) {
        /// <signature>
        /// <summary>
    	/// 定义类
    	/// </summary>
    	/// <param name="func"></param>
        /// </signature>
        /// <signature>
        /// <summary>
        /// 定义类
        /// </summary>
        /// <param name="defineName"></param>
        /// <param name="func"></param>
        /// </signature>
        /// <signature>
        /// <summary>
        /// 定义类
        /// </summary>
        /// <param name="defineName"></param>
        /// <param name="baseDefine"></param>
        /// <param name="func"></param>
        /// </signature>
        /// <signature>
        /// <summary>
        /// 定义类
        /// </summary>
        /// <param name="baseDefine"></param>
        /// <param name="func"></param>
        /// </signature>
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

        var define = function () { if (arguments[0] != "NewObject_define") return define.NewObject.apply(window, arguments); };
        define.prototype._Initialization = bingo.noop;
        define.extend = function (obj) {
            _extendObj(define.prototype, obj);
        };
        define.NewObject = function () {
            var obj = new define("NewObject_define");
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
        //	/// <summary>
        //    /// 设置或获取Prototype属性
        //	/// </summary>
        //	/// <param name="props" type="Object">属性值, {name:'名称', id:'111'}</param>
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
            /// <summary>
            /// 取得事件
            /// </summary>
            /// <param name="name">事件名称</param>
            return bingo.Event(this);
        };
        define.prototype.on = function (name, callback) {
        	/// <summary>
        	/// 绑定事件
        	/// </summary>
        	/// <param name="name">事件名称</param>
            /// <param name="callback"></param>
            callback && intellisenseSetCallContext(callback, this);
            return this;
        };
        define.prototype.one = function (name, callback) {
            /// <summary>
            /// 绑定事件
            /// </summary>
            /// <param name="name">事件名称</param>
            /// <param name="callback"></param>
            callback && intellisenseSetCallContext(callback, this);
            return this;
        };
        define.prototype.off = function (name, callback) {
            /// <summary>
            /// 解除事件
            /// </summary>
            /// <param name="name">事件名称</param>
            /// <param name="callback">可选</param>
            callback && intellisenseSetCallContext(callback, this);
            return this;
        };
        define.prototype.end = function (name, isEnd) {
            /// <summary>
            /// 结束事件, 先解除绑定事件, 以后绑定事件马上自动确发, 用于ready之类的场景
            /// </summary>
            /// <param name="name">事件名称</param>
            /// <param name="isEnd">可选, 默认为true</param>
            return this;
        };
        define.prototype.trigger = function (name, params) {
            /// <summary>
            /// 触发事件, trigger('click', [a, b, c]);
            /// </summary>
            /// <param name="name"></param>
            /// <param name="params">多个参数,[a, b, ....]</param>
            return this;
        };
        define.prototype.triggerHandler = function (name, params) {
            /// <summary>
            /// 触发第一事件, 并返回值, triggerHandler('click', [a, b, c]);
            /// </summary>
            /// <param name="name"></param>
            /// <param name="params">多个参数,[a, b, ....]</param>
            return {};
        };
        define.prototype.hasEvent = function (name) {
            /// <summary>
            /// 是否有事件
            /// </summary>
            /// <param name="name"></param>
            /// <returns value='Boolean'></returns>
            return true;
        };

        //define.prototype.clone = function () {
        //	/// <summary>
        //	/// 复制对象, this.clone(url, count), 传入类构造参数
        //	/// </summary>
        //    var obj = define.NewObject.apply(window, arguments);
        //    var prop = this.prop();
        //    obj.prop(prop);
        //    return obj;
        //};

        //是否释放
        define.prototype.isDisposed = false;
        define.prototype.dispose = function () {
        	/// <summary>
        	/// 释放对象
        	/// </summary>
            if (!this.isDisposed) {
                bingo.clearObject(this);
                this.isDisposed = true;
                this.dispose = bingo.noop;
            }
        };
        define.prototype.onDispose = function (callback) {
        	/// <summary>
        	/// 
        	/// </summary>
            /// <param name="callback" value='callback.call(this)'></param>
            if (bingo.isNull(this.__onDispose_131113))
                this.__onDispose_131113 = bingo.Event();
            return this.__onDispose_131113.apply(this, arguments);
        };
        define.prototype.disposeByOther = function (obj) {
        	/// <summary>
        	/// 当obj释放时释放这个对象
        	/// </summary>
        	/// <param name="obj"></param>
            if (obj.dispose && !obj.isDisposed) {
                var that = this;
                obj.onDispose(function () { that.dispose(); });
            }
            return this;
        };

        var defineObj = new _defineClass(define, baseDefine);

        if (baseDefine)
            intellisenseRedirectDefinition(define.prototype.base, baseDefine.prototype._Initialization);
        func && func.call(defineObj);
        defineObj = null;

        intellisense.redirectDefinition(define.NewObject, define.prototype._Initialization);
        intellisense.redirectDefinition(define, define.prototype._Initialization);

        if (!bingo.isNullEmpty(defineName))
            _makeDefine(defineName, define);
        return define;
    };

    bingo.Class.makeDefine = function (defineName, define) { _makeDefine(defineName, define); };

})(bingo);
