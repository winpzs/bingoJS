(function (bingo) {
    //version 1.0.1
    "use strict";

    //路由
    bingo.route = function (p) {
        if (this.isString(p))
            return _routes.getRoute(p);
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
        getRoute: function (url) {
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
                route.fn(url);
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
        fn: function (url) {
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

})(bingo);