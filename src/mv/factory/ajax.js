(function (bingo) {
    //version 1.0.1
    "use strict";

    /*
        _ajaxClass.NewObject(url).view($view)
            .async(true).dataType('json').cache(false)
            .param({})
            .success(function(rs){})
            .error(function(rs){})
            .alway(function(rs){})
            .post() //.get()
    */
    var _ajaxClass = bingo.mvc.ajaxClass = bingo.Class(function () {

        var _disposeEnd = function (servers) {
            servers._updateView();
            setTimeout(function () {
                servers.dispose();
            }, 1);
        };

        var _cacheObj = {};

        var _loadServer = function (servers, type) {
            /// <param name="servers" value='_ajaxClass.NewObject()'></param>
            var view = servers.view();
            if (servers.isDisposed && view.isDisposed) return;
            var datas = bingo.clone(servers.param() || {});
            var cacheKey = null, url = bingo.route(servers.url());
            var isCache = servers.cache();
            if (isCache) {
                cacheKey = url.toLowerCase();
                if (cacheKey in _cacheObj) {
                    if (servers.async())
                        setTimeout(function () { servers.isDisposed || view.isDisposed || servers.deferred().resolveWith(servers, [_cacheObj[cacheKey]]); });
                    else
                        servers.deferred().resolveWith(servers, [_cacheObj[cacheKey]]);
                    return;
                }
            }

            $.ajax({
                type: type,
                url: url,
                data: datas,
                async: servers.async(),
                cache: false,
                dataType: servers.dataType(),
                success: function (response) {
                    if (isCache)
                        _cacheObj[cacheKey] = response;

                    if (servers.isDisposed && view.isDisposed) return;
                    try {
                        var _dtd = servers.deferred();
                        _dtd.resolveWith(servers, [response]);
                    } finally { _disposeEnd(servers); }
                },
                error: function (xhr, textStatus, errorThrown) {
                    if (servers.isDisposed && view.isDisposed) return;
                    try {
                        var _dtd = servers.deferred();
                        _dtd.rejectWith(servers, [xhr, textStatus, errorThrown]);
                    } finally { _disposeEnd(servers); }
                }
            });
        };

        //this.Property({
        //    _url: '',
        //    _view: null
        //});

        this.Variable({
            async: true,
            dataType: 'json',
            param: {},
            cache: false,
            url:''
        });

        this.Define({
            view: function (v) {
                if (arguments.length == 0) return this._view;
                this._view = v;
                this.disposeByOther(v);
                return this;
            },
            _updateView: function () {
                //如果有sync由它更新view
                if (this._sync_ && this._sync_.view && this._sync_.view()) return;
                var view = this.view();
                view && view.$update && view.$update();
            },
            deferred: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns value='$.Deferred()'></returns>
                this._dtd || (this._dtd = $.Deferred());
                return this._dtd;
            },
            success: function (callback) {
                this.deferred().done(callback);
                return this;
            },
            error: function (callback) {
                this.deferred().fail(callback);
                return this;
            },
            alway: function (callback) {
                this.deferred().always(callback);
                return this;
            },
            //依赖ajaxSync
            _withSync: function () {
                var lastSync = _ajaxSyncClass.lastSync();
                if (!lastSync) return this;
                lastSync.addCount();
                this._sync_ = lastSync;
                return this.success(function () {
                    setTimeout(function () { lastSync.decCount(); }, 1);
                }).error(function () {
                    setTimeout(function () { lastSync.reject(); }, 1);
                });
            },
            post: function () {
                if (this.async()) this._withSync();
                _loadServer(this, 'post');
                this.post = bingo.noop;
                return this;
            },
            get: function () {
                if (this.async()) this._withSync();
                _loadServer(this, 'get');
                this.get = bingo.noop;
                return this;
            }
        });

        this.Initialization(function (url) {
            this.url(bingo.route(url));
        });
    });


    var _ajaxSyncClass = bingo.mvc.ajaxaSyncClass = bingo.Class(function () {

        this.Static({
            syncList: [],
            lastSync: function () {
                var syncList = this.syncList;
                var len = syncList.length;
                return len > 0 ? syncList[len - 1] : null;
            }
        });

        this.Define({
            view: function (v) {
                if (arguments.length == 0) return this._view;
                this._view = v;
                this.disposeByOther(v);
                return this;
            },
            deferred: function () {
                /// <summary>
                /// 
                /// </summary>
                /// <returns value='$.Deferred()'></returns>
                this._dtd || (this._dtd = $.Deferred());
                return this._dtd;
            },
            success: function (callback) {
                this.deferred().done(callback);
                return this;
            },
            error: function (callback) {
                this.deferred().fail(callback);
                return this;
            },
            alway: function (callback) {
                this.deferred().always(callback);
                return this;
            },
            //解决, 马上成功
            resolve: function () {
                this._count = 0;
                this._dtd && this.deferred().resolve();

                this._updateView();

                this.dispose();
            },
            //拒绝, 马上失败
            reject: function (args) {
                this._count = 0;
                this._dtd && this.deferred().reject();
                this.dispose();
            },
            //依赖另一个ajaxSync
            withSync: function (syncObj) {
                this.addCount();
                var $this = this;
                this._syncObj_ = syncObj;
                syncObj.error(function () {
                    setTimeout(function () { $this.reject(); }, 1);
                }).success(function () {
                    setTimeout(function () { $this.decCount(); }, 1);
                });
                return this;
            },
            _updateView: function () {
                if (this._syncObj_ && this._syncObj_.view && this._syncObj_.view()) return;
                var view = this.view();
                view && view.$update && view.$update();
            },
            //计数加一
            addCount: function () {
                this._count++; return this;
            },
            //计数减一, 计数为0时, 解决所有
            decCount: function () {
                this._count--;
                this._checkResolve();
                return this;
            },
            _checkResolve: function () {
                if (this._count <= 0) { this.resolve(); }
            }
        });

        this.Initialization(function () {
            this._count = 0;
        });
    });


    /*
        //同步syncAll
        $ajax.syncAll(function(){
            
            //第一个请求
            $ajax(url).post()
            //第二个请求, 或更多
            $ajax(url).post()
            .......

        }).success(function(){
	        //所有请求成功后, 
        });
    */
    bingo.factory('$ajax', ['$view', function ($view) {
        var fn = function (url) {
            return _ajaxClass.NewObject(url).view($view);
        };
        fn.syncAll = function (callback) { return _syncAll(callback, $view); };
        return fn;
    }]);

    var _syncAll = function (callback, view) {
        if (!callback) return null;
        var syncList = _ajaxSyncClass.syncList;
        var lastSync = _ajaxSyncClass.lastSync();
        var syncObj = _ajaxSyncClass.NewObject();
        view && syncObj.view(view);
        lastSync && lastSync.withSync(syncObj);
        syncList.push(syncObj);
        callback && callback();
        syncList.pop();
        setTimeout(function () { syncObj._checkResolve && syncObj._checkResolve(); }, 1);
        return syncObj;
    };

})(bingo);