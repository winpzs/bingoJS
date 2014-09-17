
bingo.command('bg-controller', function () {
    return {
        priority: 1000,
        tmpl: '',
        tmplUrl: '',
        replace: false,
        include: false,
        view: true,
        compileChild: false,
        compilePre: null,
        controller: null,
        link: null,
        compile: ['$view', '$tmpl', '$node', '$attr', function ($view, $tmpl, $node, $attr) {
            var val = $attr.$getContext();
            if (bingo.isFunction(val)) {
                this.controller = val;
                $tmpl.formNode($node).compile();
            } else {
                val = $attr.$getValue();
                var router = bingo.route(val);
                if (router) {
                    var compileFn = function () {
                        var module = router.module;
                        var controller = router.controller;
                        $view.setModule(module)
                        $view.setController(controller);
                        $tmpl.formNode($node).compile();
                    };
                    var script = router.script;
                    if (bingo.isNullEmpty(script))
                        compileFn();
                    else
                        bingo.using(script, compileFn);
                }
            }
        }]
    };
});
