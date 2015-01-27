
(function (bingo) {
    //version 1.0.1
    "use strict";

    bingo.extend({
        linkToDom: function (jSelector, callback) {
            return _addLink(jSelector, callback);
        },
        isUnload: false
    });
    bingo.linkToDom.LinkToDomClass = bingo.Class(function () {

        this.Define({
            linkToDom: function (jqSelector) {
                this.unlinkToDom();
                var $this = this;
                this._linkToDomObject = bingo.linkToDom(jqSelector, function (isRemoveDom) {
                    try {
                        //console.log('isRemoveDom', isRemoveDom);
                        isRemoveDom && $this.trigger && $this.trigger('domRemoved');
                        $this.dispose && $this.dispose();
                    } finally {
                        jqSelector = $this._linkToDomObject = null;
                        $this = null;
                    }
                });
                return this;
            },
            unlinkToDom: function () {
                this._linkToDomObject && this._linkToDomObject.unlink();
                this._linkToDomObject = null;
                
                return this;
            }
        });

        this.Initialization(function () {

            this.onDispose(function () {
                this.unlinkToDom();
            });

        });
    });


    //断开连接， 但不确发callback
    var _unlink = function () {
        this.callback = bingo.noop;
        if (this.target) {
            this.target.removeData(this.id);
            this.target.off("linkRemove.linkdom");
            this.target = null;
        }
    };
    //断开连接， 并确发callback
    var _disconnect = function () {
        _disconnectByLink(this);
    };

    var _disconnectByLink = function (link, isRemoveDom) {
        if (link && link.target) {
            var callback = link.callback;
            _unlink.call(link);
            callback(isRemoveDom);
        }
    };


    var _cleanData = $.cleanData;
    $.cleanData = function (elems) {
        //console.log(elems);
        for (var i = 0, elem; (elem = elems[i]) != null; i++) {
            try {
                $(elem).triggerHandler("linkRemove.linkdom");
            } catch (e) { }
        }
        _cleanData.apply($, arguments);
    };
    

    var _autoId = 0;
    var _addLink = function (jSelector, callback) {
        if (bingo.isFunction(callback)) {
            var jTarget = $(jSelector);
            if (!bingo.isUnload && jTarget.length > 0) {
                if (_autoId >= Number.MAX_VALUE) _autoId = 0;
                _autoId++;
                var link = { id: "linkToDom_130102_" + _autoId, target: jTarget, callback: callback, unlink: _unlink, disconnect: _disconnect };
                jTarget.data(link.id, "T");
                jTarget.one("linkRemove.linkdom", function (e) { _disconnectByLink(link, true); });
                return link;
            } else {
                callback();
            }
        }
        return null;
    };

    $(window).unload(function () {
        bingo.isUnload = true;
    });

})(bingo);