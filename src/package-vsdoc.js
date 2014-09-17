/*

//使用map, 合并js时用, 以下是将, equals.js和JSON.js, 影射到equals1.js
    bingo.map("%bingoextend%/equals1.js", "%bingoextend%/equals.js", "%jsother%/JSON.js");
    
*/

/*
    bingo.using("/js/c.js", "d.js");//d.js会相对于c.js路径
    bingo.define("test.classA", function(){});
    bingo.env(["/js/c.js", "d.js"], {parentEnv:this}, function () {  //d.js会相对于c.js路径
        console.log("do something");
    });
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
        map: function (path, mapPath) {
            /// <signature>
            /// <summary>
        	/// 路由
        	/// </summary>
            /// <param name="path">路由路径</param>
            /// <param name="mapPath">一组原路径..., "a.js", "b.js"...</param>
            /// </signature>
            /// <signature>
        }
    });


    //define========================================================

    var _extendObj = function (obj, extObj) {
        for (var n in extObj) {
            if (extObj.hasOwnProperty(n)) {
                obj[n] = extObj[n];
            }
        }
    };



    var _DEFINE = "bingo_define_91";
    bingo.extend({
        isDefine: function (define) { return define._DEFINE === _DEFINE; },
        define: function () {
            var baseDefineFn = null;
            var defineFn = null;
            var defineName = null;

            var item = null;
            for (var i = 0, len = arguments.length; i < len; i++) {
                item = arguments[i];
                if (item) {
                    if (this.isDefine(item))
                        baseDefineFn = item;
                    else if (this.isFunction(item))
                        defineFn = item;
                    else if (this.isString(item))
                        defineName = item;
                }
            }

            var define = function () {

                var envObj = _defineClass.NewObject(defineName);
                envObj.base = function () {
                    if (baseDefineFn && baseDefineFn._DEFINE_FN) {
                        baseDefineFn._DEFINE_FN.apply(envObj, arguments);
                    }
                };

                defineFn && defineFn.apply(envObj, arguments);
                if (define._EXTEND)
                    _extendObj(envObj, define._EXTEND);


                return envObj;
            };
            define._DEFINE = _DEFINE;
            define._DEFINE_FN = defineFn;

            define.extend = function (obj) {
                define._EXTEND || (define._EXTEND = {});
                _extendObj(define._EXTEND, obj || {});
            }

            defineName && this.Class.makeDefine(defineName, define);

            define();
            return define;
        },
        env: function (callback, priority) {
            if (!this.isFunction(callback)) return;

            var envObj = _defineClass.NewObject('_env_');
            callback && callback.call(envObj);

        }
    });


    var _defineClass = bingo.Class(function () {

        this.Initialization(function (defineName) {
            this.$defineName = defineName;
        });
    });


    bingo.envPriority = {
        First: 0,
        NormalBefore: 45,
        Normal: 50,
        NormalAfter: 55,
        Last: 100
    };

})();



//var aaa = intellisense.getFunctionComments(bingo.define);
//aaa.

//intellisense.addEventListener("signaturehelp", function () {
//    intellisense.logMessage(arguments);
//});
