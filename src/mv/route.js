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
