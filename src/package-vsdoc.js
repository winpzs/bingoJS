/*
    //加载/js/c.js和/js/d.js
    bingo.using("/js/c.js", "d.js");//d.js会相对于c.js路径

    //加载完成处理
    bingo.using("/js/c.js", "d.js", function(){console.log('加载完成')});
    
    //加载完成处理优先级
    bingo.using("/js/c.js", "d.js", function(){console.log('加载完成')}, bingo.usingPriority.Normal);

    //使用map, 合并js时用, 以下是将, equals.js和JSON.js, 影射到equals1.js
    bingo.usingMap("%bingoextend%/equals1.js", "%bingoextend%/equals.js", "%jsother%/JSON.js");
*/

(function () {
    //version 1.0.1
    var bingo = window.bingo;

    bingo.extend({
        using: function (jsFiles, callback, priority) {
        	/// <summary>
            /// 引用JS， bingo.using("/js/c.js", "d.js"， function(){}, bingo.envPriority.Normal)
        	/// </summary>
        	/// <param name="jsFiles">文件， 可以多个。。。</param>
        	/// <param name="callback">加载完成后</param>
            /// <param name="priority">优先级</param>


            //if (arguments.length <= 0) return;
            //var item = null;
            //for (var i = 0, len = arguments.length; i < len; i++) {
            //    item = arguments[i];
            //    if (item) {
            //        if (bingo.isFunction(item)) {
            //            item(); return;
            //        }
            //    }
            //}
        },
        usingMap: function (path, mapPath) {
            /// <signature>
            /// <summary>
        	/// 路径映射
        	/// </summary>
            /// <param name="path">映射路径</param>
            /// <param name="mapPath">一组原路径..., "a.js", "b.js"...</param>
            /// </signature>
            /// <signature>
        },
        //using优先级
        usingPriority: {
            First: 0,
            NormalBefore: 45,
            Normal: 50,
            NormalAfter: 55,
            Last: 100
        }
    });



})();
