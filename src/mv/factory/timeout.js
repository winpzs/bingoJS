
bingo.factory('$timeout', ['$view', function ($view) {
    return function (callback, time) {
        return setTimeout(function () {
            if (!$view.isDisposed) {
                callback && callback();
                $view.$update();
            }
        }, time);
    };
}]);
