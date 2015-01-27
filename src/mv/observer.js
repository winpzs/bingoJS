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

})(bingo);