/*
    使用方法:
    bg-controller="function($view){}"   //直接绑定一个function
    bg-controller="ctrl/system/user"    //绑定到一个url
*/
bingo.command('bg-controller', function () {
    return {
        //优先级, 越大越前
        priority: 1000,
        //模板
        tmpl: '',
        //外部模板
        tmplUrl: '',
        //是否替换节点, 默认为false
        replace: false,
        //是否indclude, 默认为false, 模板内容要包函bg-include
        include: false,
        //是否新view, 默认为false
        view: true,
        //新view是否自动发送ready事件, view为true才有效, 默认为true, 这里为false要手动发送
        readyAuto:false,
        //是否编译子节点, 默认为true
        compileChild: false,
        //编译前, 没有$domnode和$attr注入, 即可以用不依懒$domnode和$attr的所有注入, 如$view/node/$node/$ajax...
        compilePre: null,
        //controller
        controller: null,
        //link
        link: null,
        //编译, (compilePre编译前-->compile编译-->controller初始数据-->link连接command)
        compile: ['$view', '$tmpl', '$node', '$attr', function ($view, $tmpl, $node, $attr) {
            var attrVal = $attr.$prop(), val = null;
            if (!bingo.isNullEmpty(attrVal)) {
                val = $attr.$context();
                //如果没有取父域
                if (!val) val = $attr.$context(null, $view.parentView);
            }

            if (bingo.isNullEmpty(attrVal)
                || bingo.isFunction(val) || bingo.isArray(val)) {
                //如果是function或数组, 直接当controller, 或是空值时

                //添加controller
                val && $view.$addController(val);
                //编译
                $tmpl.fromNode($node).compile(function () {
                    if ($view.isDisposed) return;
                    //readyAuto为false, 编译完成后要发送ready事件, 
                    $view.$sendReady();
                });
            } else {
                //使用url方式, 异步加载contorllor, 走mvc开发模式
                var url = attrVal;
                if (!bingo.isNullEmpty(url)) {
                    bingo.using(url, function () {
                        if ($view.isDisposed) return;

                        //route解释url
                        var routeContext = bingo.routeContext(url);
                        //解释出来的urlparam
                        var params = routeContext.params;
                        //取module
                        var module = bingo.module(params.module);
                        //取controller
                        var controller = module ? module.controller(params.controller) : null;
                        //取action
                        var action = controller ? controller.action(params.action) : null;
                        if (!module || !action) return;

                        //设置module
                        $view.$setModule(module);
                        //添加controller
                        $view.$addController(action);
                        //编译
                        $tmpl.fromNode($node).compile(function () {
                            if ($view.isDisposed) return;
                            //readyAuto为false, 编译完成后要发送ready事件, 
                            $view.$sendReady();
                        });
                    });
                }
            }
        }]
    };
});
