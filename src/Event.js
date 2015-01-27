
; (function (bingo) {
    //version 1.0.1
    "use strict";

    bingo.Event = function (owner, eList) {

        var eventList = eList || [],
            $this = owner,
            _end = false,
            eventF = function (callback) {
                $this || ($this = this);
                callback && eventF.on(callback);
                return arguments.length == 0 ? eventF : $this;
            };

        bingo.extend(eventF, {
            on: function (callback) {
                callback && eventList.push({ one: false, callback: callback });

                _end && eventF.trigger().off();
                return this;
            },
            one: function (callback) {
                callback && eventList.push({ one: true, callback: callback });

                _end && eventF.trigger().off();
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
            //结束事件, 先解除绑定事件, 以后绑定事件马上自动确发, 用于ready之类的场景
            end: function (isEnd) {
                _end = (isEnd !== false);//默认为true

                _end && eventF.off();
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
                    if ((ret = eventObj.callback.apply($this, arguments[0])) === false) break;
                }
                reList && (eventList = reList);
                return this;
            },
            triggerHandler: function () {
                var list = eventList, eventObj = null;
                if (list.length == 0) return;
                eventObj = list[0];
                var ret = eventObj.callback.apply($this, arguments[0]);
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
