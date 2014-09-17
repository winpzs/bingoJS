
bingo.location = function (node) {
    var $node = $(node);
    var frameName = 'bg-frame';
    return {
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
        change: function (callback) {
            callback && $node.on(frameName + '-change', function (e, url) {
                callback(url);
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