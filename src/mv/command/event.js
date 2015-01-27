/*
    使用方法:
    bg-event="{click:function(e){}, dblclick:helper.dblclick}"
    bg-click="helper.click"     //绑定到方法
    bg-click="helper.click()"   //直接执行方法
*/
bingo.each('event,click,blur,dblclick,focus,focusin,focusout,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit'.split(','), function (eventName) {
    bingo.command('bg-' + eventName, function () {

        return ['$view', '$node', '$attr', function ($view, $node, $attr) {

            var bind = function (evName, callback) {
                $node.on(evName, function () {
                    //console.log(eventName);
                    callback.apply(this, arguments);
                    $view.$update();
                });
            };

            if (eventName != 'event') {
                var fn = $attr.$value();
                if (!bingo.isFunction(fn))
                    fn = function (e) { $attr.$eval(e); };
                bind(eventName, fn);
            } else {
                var evObj = $attr.$context();
                if (bingo.isObject(evObj)) {
                    var fn = null;
                    for (var n in evObj) {
                        if (evObj.hasOwnProperty(n)) {
                            fn = evObj[n];
                            if (bingo.isFunction(fn))
                                bind(n, fn);
                        }
                    }
                }
            }

        }];

    });
});
