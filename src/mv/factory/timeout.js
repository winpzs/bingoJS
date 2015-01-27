
/*
    //异步执行内容, 并自动同步view数据
    $timeout(function(){
	    $view.title = '我的标题';
    }, 100);
*/
bingo.factory('$timeout', ['$view', function ($view) {
    return function (callback, time) {
        return setTimeout(function () {
            if (!$view.isDisposed) {
                callback && callback();
                $view.$update();
            }
        }, time || 1);
    };
}]);
