
(function (bingo) {
    //version 1.0.1
    "use strict";

    var doc = window.document;
    var head = doc.head ||
      doc.getElementsByTagName('head')[0] ||
      doc.documentElement;
    var baseElement = head.getElementsByTagName('base')[0];

    var READY_STATE_RE = /loaded|complete|undefined/i;
    var isSCRIPT = /SCRIPT/i;

    var fetch = function (url, callback, id, charset) {

        //如果是css创建节点 link  否则 则创建script节点
        var node = doc.createElement('script');
        node.importurl = url;
        node.imporid = id || bingo.makeAutoId();
        node.async = 'async';
        node.src = url;

        if (charset) {
            var cs = bingo.isFunction(charset) ? charset(url) : charset;
            cs && (node.charset = cs);
        }

        //scriptOnload执行完毕后执行callback ，如果自定义callback为空，则赋予noop 为空函数
        scriptOnload(node, callback || bingo.noop);


        // For some cache cases in IE 6-9, the script executes IMMEDIATELY after
        // the end of the insertBefore execution, so use `currentlyAddingScript`
        // to hold current node, for deriving url in `define`.
        // 之下这些代码都是为了兼容ie 
        // 假如A页面在含有base标签，此时A页面有个按钮具有请求B页面的功能，并且请求过来的内容将插入到A页面的某个div中
        // B页面有一些div，并且包含一个可执行的script
        // 其他浏览器都会在异步请求完毕插入页面后执行该script 但是 ie 不行，必须要插入到base标签前。
        //currentlyAddingScript = node;

        // ref: #185 & http://dev.jquery.com/ticket/2709 
        // 关于base 标签 http://www.w3schools.com/tags/tag_base.asp

        baseElement ?
            head.insertBefore(node, baseElement) :
            head.appendChild(node);

        return id;
    },
    scriptOnload = function (node, callback) {
        // onload为IE6-9/OP下创建CSS的时候，或IE9/OP/FF/Webkit下创建JS的时候  
        // onreadystatechange为IE6-9/OP下创建CSS或JS的时候

        var loadedFun = function () {
            if (!node) return;
            //正则匹配node的状态
            //readyState == "loaded" 为IE/OP下创建JS的时候
            //readyState == "complete" 为IE下创建CSS的时候 -》在js中做这个正则判断略显多余
            //readyState == "undefined" 为除此之外浏览器
            if (READY_STATE_RE.test(node.readyState)) {

                // Ensure only run once and handle memory leak in IE
                // 配合 node = undefined 使用 主要用来确保其只被执行一次 并 处理了IE 可能会导致的内存泄露
                node.onload = node.onerror = node.onreadystatechange = null;

                // Remove the script to reduce memory leak
                // 在存在父节点并出于isDebug移除node节点
                if (!bingo.isDebug && node.parentNode) {
                    node.parentNode.removeChild(node);
                }

                setTimeout(function () {
                    if (!node) return;
                    try {
                        //执行回调
                        callback && callback(node.importurl, node.imporid, node);
                    } finally {

                        // Dereference the node
                        // 废弃节点，这个做法其实有点巧妙，对于某些浏览器可能同时支持onload或者onreadystatechange的情况，只要支持其中一种并执行完一次之后，把node释放，巧妙实现了可能会触发多次回调的情况
                        node = undefined;
                        callback = null;
                    }
                }, 5);
            }
        };

        node.onload = node.onerror = node.onreadystatechange = function () {
            loadedFun();
        };

    };

    bingo.extend({
        fetch: function (url, callback, id, charset) {
            /// <summary>
            /// callback(url, node);
            /// </summary>
            /// <param name="url"></param>
            /// <param name="callback"></param>
            /// <param name="charset"></param>
            return fetch(url, callback, id, charset);
            callback = null;
        }
    });

})(bingo);