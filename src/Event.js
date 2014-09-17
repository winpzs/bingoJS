
; (function (bingo) {
    //version 1.0.1
    "use strict";

    bingo.Event = function (owner, eList) {

        var eventList = eList || [];
        var $this = owner;
        var eventF = function (callback) {
            $this || ($this = this);
            callback && eventF.on(callback);
            return arguments.length == 0 ? eventF : $this;
        };

        bingo.extend(eventF, {
            on: function (callback) {
                callback && eventList.push({ one: false, callback: callback });
                return this;
            },
            one: function (callback) {
                callback && eventList.push({ one: true, callback: callback });
                return this;
            },
            off: function (callback) {
                if (callback) {
                    var list = [];
                    bingo.each(eventList, function () {
                        if (this.callback != callback)
                            list.push(this);
                    });
                    eventList = list;
                } else { eventList = []; }
                return this;
            },
            trigger: function () {
                var list = eventList, ret = null, eventObj = null, reList = null;
                for (var i = 0, len = list.length; i < len; i++) {
                    eventObj = list[i];
                    if (eventObj.one === true) {
                        reList || (reList = eventList);
                        reList = bingo.removeArrayItem(eventObj, reList);
                    }
                    if ((ret = eventObj.callback.apply($this, arguments)) === false) break;
                }
                reList && (eventList = reList);
                return this;
            },
            triggerHandler: function () {
                var list = eventList, eventObj = null;
                if (list.length == 0) return;
                eventObj = list[0];
                var ret = eventObj.callback.apply($this, arguments);
                if (eventObj.one === true)
                    eventList = bingo.removeArrayItem(eventObj, eventList);
                return ret;
            },
            clone: function () {
                return bingo.Event(owner, eventList);
            },
            owner: function () { return $this;}
        });



        return eventF;
    };

})(bingo);
