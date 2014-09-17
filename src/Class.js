
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
            _extendObj(define.prototype._property, _property);
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
        _extendObj(define.prototype._property, o);
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
                define[n] = _makeVarFn(o[n]);
            }
        }
        return this;
    };

    var _makeVarFn = function (defaultValue) {
        var fn = function (value) {
            if (arguments.length == 0)
                return defaultValue;
            else {
                defaultValue = arguments[0];
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
            obj._Initialization.apply(obj, arguments);
            obj._Initialization = bingo.noop;
            return obj;
        };
        define.prototype.prop = function (props) {
            if (arguments.length == 0) {
                var props = this._property;
                var obj = {};
                for (var n in props) {
                    if (props.hasOwnProperty(n)) {
                        obj[n] = this[n];
                    }
                }
                return obj;
            } else {
                _extendObj(this, propertys);
                return this;
            }
        };

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
                var argLists = arguments.length > 1 ? bingo.sliceArray(arguments, 1) : [];
                events[name] && events[name]().trigger.apply(this, argLists);
            }
            return this;
        };

        define.prototype.clone = function () {
            var obj = define.NewObject.apply(window, arguments);
            var prop = this.prop();
            obj.prop(prop);
            return obj;
        };

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
