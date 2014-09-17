
bingo.each('click,blur,dblclick,focus,focusin,focusout,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit'.split(','), function (eventName) {
    bingo.command('bg-' + eventName, function () {

        return ['$view', '$node', '$attr', function ($view, $node, $attr) {
            var fn = $attr.$datavalue();
            if (!bingo.isFunction(fn))
                fn = function (e) { $attr.$eval(e); };
            $node.on(eventName, function () {
                //console.log(eventName);
                fn.apply(this, arguments);
                $view.$update();
            });
        }];

    });
});
