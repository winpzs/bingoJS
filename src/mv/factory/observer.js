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
                    if ((deep ? (!bingo.equals(newValue, _oldValue)) : newValue != _oldValue)) {
                        _oldValue = deep ? bingo.clone(newValue) : newValue;
                        callback.call(this, newValue);
                        return true;
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

    bingo.factory('$subscribe', ['$observer', '$attr', function ($observer, $attr) {
        return function (p, callback, deep) {
            return $observer.subscribe(p, callback, deep, $attr);
        };
    }]);



})(bingo);