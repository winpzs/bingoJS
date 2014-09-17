(function (bingo) {
    //version 1.0.1
    "use strict";


    var _ajaxClass = bingo.Class(function () {

        var _disposeEnd = function (servers) {
            servers._view && servers._view.$update();
            setTimeout(function () {
                servers.dispose();
            }, 10);
        };

        var _cacheObj = {};

        var _loadServer = function (servers, type) {
            /// <param name="servers" value='_ajaxClass.NewObject()'></param>
            var view = servers._view;
            if (servers.isDisposed && view.isDisposed) return;
            var datas = bingo.clone(servers.param() || {});
            var cacheKey = null;
            var isCache = servers.cache();
            if (isCache) {
                cacheKey = servers._url.toLowerCase();
                if (cacheKey in _cacheObj) {
                    if (servers.async())
                        setTimeout(function () { servers.isDisposed || view.isDisposed || _dtd.resolveWith(servers, [_cacheObj[cacheKey]]); });
                    else
                        _dtd.resolveWith(servers, [_cacheObj[cacheKey]]);
                    return;
                }
            }

            $.ajax({
                type: type,
                url: servers._url,
                data: datas,
                async: servers.async(),
                cache: false,
                dataType: servers.dataType(),
                success: function (response) {
                    if (isCache)
                        _cacheObj[cacheKey] = response;

                    if (servers.isDisposed && view.isDisposed) return;
                    try {
                        var _dtd = servers.getDTD();
                        _dtd.resolveWith(servers, [response]);
                    } finally { _disposeEnd(servers); }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (servers.isDisposed && view.isDisposed) return;
                    try {
                        var _dtd = servers.getDTD();
                        _dtd.rejectWith(servers, [xhr, textStatus, errorThrown]);
                    } finally { _disposeEnd(servers); }
                }
            });
        };

        this.Property({
            _url: '',
            _view: null
        });

        this.Variable({
            async: true,
            dataType: 'json',
            param: {},
            cache: false
        });

        this.Define({
            getDTD: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns value='$.Deferred()'></returns>
                this._dtd || (this._dtd = $.Deferred());
                return this._dtd;
            },
            success: function (callback) {
                this.getDTD().done(callback);
                return this;
            },
            error: function (callback) {
                this.getDTD().fail(callback);
                return this;
            },
            alway: function (callback) {
                this.getDTD().always(callback);
                return this;
            },
            post: function () {
                _loadServer(this, 'post');
                return this;
            },
            get: function () {
                _loadServer(this, 'get');
                return this;
            }
        });

        this.Initialization(function (url, view) {
            this._url = bingo.path(url);
            this._view = view || { isDisposed: false };
        });
    });

    bingo.factory('$ajax', ['$view', function ($view) {
        return function (url) {
            return _ajaxClass.NewObject(url, $view);
        };
    }]);


})(bingo);