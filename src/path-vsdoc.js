
(function () {
    var bingo = window.bingo;
    var _rootPathReg = /^\/|\:\/\//;

    bingo.extend({
        getRelativePath: function (sUrl, sRelative) {
            /// <signature>
            /// <summary>
            /// 取得绝对路径, /html/context/
            /// </summary>
            /// <param name="sUrl">
            /// /html/context/aaa.aspx
            /// <para>http://www.aaa.com/html/context/aaa.aspx</para>
            /// </param>
            /// </signature>
            /// <signature>
            /// <summary>
            /// 取得绝对路径,(/html/context/aaa.aspx)
            /// </summary>
            /// <param name="sUrl">
            /// /html/context/aaa.aspx
            /// <para>http://www.aaa.com/html/context/aaa.aspx</para>
            /// </param>
            /// <param name="sRelative">
            /// ../aaa.aspx
            /// <para>../aaa/aaa.aspx</para>
            /// </param>
            /// </signature>
            return this.stringEmpty;
        },
        getRelativeFile: function (url) {
            /// <summary>
            /// 取得绝对文件, /html/context/aaa.aspx
            /// </summary>
            /// <param name="url">
            /// /html/context/aaa.aspx
            /// <para>http://www.aaa.com/html/context/aaa.aspx</para>
            /// </param>
            return this.stringEmpty;
        },
        path: function (a) {
            /// <signature>
            /// <summary>
            /// 取得路径
            /// </summary>
            /// <param name="path" type="String">"%root%/aa.js"</param>
            /// </signature>
            /// <signature>
            /// <summary>
            /// 设置路径变量
            /// </summary>
            /// <param name="pathObject" type="Object">设置路径变量, {root:"/html/test", jspath:"%root%/js"}</param>
            /// </signature>
            /// <signature>
            /// <summary>
            /// 设置路径变量
            /// </summary>
            /// <param name="varname" type="String">root</param>
            /// <param name="path" type="String">/html/test, 或 %c%/aaa</param>
            /// </signature>
            return this.stringEmpty;
        },
        isRootPath: function (path) {
            /// <summary>
            /// 是否相对于根路径, (/rootr/aaa.aspx)
            /// </summary>
            /// <param name="path"></param>
            return _rootPathReg.test(path);
        }
    });

})();