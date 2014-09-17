(function (bingo) {
    bingo.fetch = function (url, callback, charset) {
        /// <summary>
        /// fetch("aaa.js", function(url, id,  node){});
        /// </summary>
        /// <param name="url">url</param>
        /// <param name="callback" type="function(url, id, node)">callback</param>
        /// <param name="charset">编码, utf-8</param>
        intellisenseSetCallContext(callback, window, ["", "", window.document.documentElement]);
    }

})(bingo);