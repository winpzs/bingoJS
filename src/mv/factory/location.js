
/*
    与bg-frame同用, 取bg-frame的url等相关
    $location.href('view/system/user/list');
    var href = $location.href();
    var params = $location.params();


    $location.onChange请参考bg-frame定义
*/

bingo.location = function (node) {
    var $node = $(node || document.documentElement);
    var frameName = 'bg-frame';
    return {
        params: function () {
            var url = this.href();
            var routeContext = bingo.routeContext(url);
            return routeContext.params;
        },
        href: function (url, target) {
            if (arguments.length == 0)
                return this.toString();
            else {
                var frame = bingo.isNullEmpty(target) ? this.frame() : $('[' + frameName + '][' + frameName + '-name="' + target + '"]');
                if (frame.size() > 0) {
                    frame.attr(frameName, url).trigger(frameName + '-change', [url]);
                }
            }
        },
        onChange: function (callback) {
            callback && this.frame().on(frameName + '-change', function (e, url) {
                callback.call(this, url);
            });
        },
        onLoaded: function (callback) {
            callback && this.frame().on(frameName + '-loaded', function (e, url) {
                callback.call(this, url);
            });
        },
        frame: function () { return $node.closest('[' + frameName + ']'); },
        toString: function () {
            var frame = this.frame();
            if (frame.size() > 0)
                return frame.attr(frameName);
            else
                return window.location + '';
        }
    };
};

bingo.factory('$location', ['node', function (node) {

    return bingo.location(node);

}]);