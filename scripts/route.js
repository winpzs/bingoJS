
//定义路由 ======================================================
(function (bingo) {
    'use strict';

    //设置plugins tmpl路由
    bingo.route('pluginView', {
        url: 'plugins/{plugin}/tmpl',
        toUrl: '../plugins/{plugin}/tmpl.html',
        defaultValue: { }
    });

    //设置plugins Script路由
    bingo.route('pluginScript', {
        url: 'plugins/{plugin}/script',
        toUrl: '../plugins/{plugin}/script.js',
        defaultValue: { }
    });

})(bingo);

//end 定义路由 ======================================================
