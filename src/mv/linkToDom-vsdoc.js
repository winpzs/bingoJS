
(function (bingo) {
    window.bingo.linkToDom = function (jSelector, callback) {
        /// <summary>
        /// 联接到DOM, 当DOM给删除时调用callback
        /// <para>linkToDom("#id", function(){});</para>
        /// </summary>
        /// <param name="jSelector">jSelector</param>
        /// <param name="callback">callback</param>
        return {
            id: bingo.stringEmpty, target: null,
            unlink: function () {
                /// <summary>
                /// 断开与DOM的连接,不调用callback
                /// </summary>
            },
            disconnect: function () {
                /// <summary>
                /// 断开与DOM的连接, 并调用callback
                /// </summary>
            }
        };
    };

    ///<var>是否已经unload</var>
    window.bingo.isUnload = false;


    bingo.linkToDom.LinkToDomClass = bingo.Class(function () {

        this.Define({
            linkToDom: function (jqSelector) {
                /// <summary>
                /// 联接到DOM, 当DOM给删除时销毁对象, 只能联一个
                /// </summary>
                /// <param name="jqSelector"></param>
                return this;
            },
            unlinkToDom: function () {
                /// <summary>
                /// 解除联接到DOM
                /// </summary>
                return this;
            }
        });

        this.Initialization(function () {

            ////this._linkToDomObject = 
            //var oldDispose = this.dispose;
            //this.dispose = function () {
            //    /// <summary>
            //    /// 释放对象
            //    /// </summary>
            //};

            ////释放对象事件
            //this.onDispose = bingo.Event();
        });
    });

})(bingo);