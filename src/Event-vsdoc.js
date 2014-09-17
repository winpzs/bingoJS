
(function (bingo) {

    bingo.Event = function (owner) {
        /// <summary>
        /// 创建事件
        /// </summary>

        var $this = owner;
        var _eventObj = function (callback) {
            /// <summary>
            /// 绑定事件
            /// </summary>
            /// <param name="callback"></param>
            $this || ($this = this);
            var evObj = _eventObj;
            callback && intellisense.setCallContext(callback, { thisArg: $this });
            return arguments.length == 0 ? evObj : $this;
        };
        bingo.extend(_eventObj , {
            on: function (callback) {
                /// <summary>
                /// 绑定事件
                /// </summary>
                /// <param name="callback" type="function()"></param>
                callback && intellisense.setCallContext(callback, { thisArg: $this });
                return this;
            },
            one: function (callback) {
                /// <summary>
                /// 绑定事件
                /// </summary>
                /// <param name="callback" type="function()"></param>
                callback && intellisense.setCallContext(callback, { thisArg: $this });
                return this;
            },
            off: function (callback) {
                /// <summary>
                /// 解除绑定事件
                /// </summary>
                /// <param name="callback">可选, 默认清除所有事件callback</param>
                return this;
            },
            trigger: function () {
                /// <summary>
                /// 触发事件, 返回最后一个事件值, 事件返回false时, 中断事件, trigger(arg1, arg2, ....)
                /// </summary>
                return this;
            },
            triggerHandler: function () {
                /// <summary>
                /// 触发第一事件, 并返回值, var b = triggerHandler(arg1, arg2, ....)
                /// </summary>
                /// <returns value='{}'></returns>
            },
            clone: function () {
                /// <summary>
                /// 复制
                /// </summary>
                return bingo.Event($this);
            },
            owner: function () { return $this; }
        });
        return _eventObj;
    };


})(bingo);