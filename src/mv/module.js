(function (bingo) {
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
