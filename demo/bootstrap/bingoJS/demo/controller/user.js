
bingo.using('bingoJS/demo/service/userService.js');
console.log('user.js');
(function () {
    'use strict';

    var module = bingo.module('user', function ($view) {
        this.aaadddd = 1;
        console.log('module', this);
        console.log('module $view', $view);
    });

    //user/list==========================
    module.controller('list', function ($view, $node, $timeout, $modal, userService) {
        console.log('user/list', this);
        console.log('user/list $view', $view);
        console.log('user/list $node', $node);

        $view.on('ready', function () {
            $node.css('visibility', 'visible');
            $view.user.loadData();
        });

        $view.user = {
            list: [],
            //加载数据
            loadData: function () {
                userService.getList(function (datas) {
                    $view.user.list = datas;
                });
            },
            //打开创建用户窗口
            createUser: function () {
                var url = 'bingoJS/demo/user/form';
                //新用户实体
                var user = userService.newUser();
                $modal(url).param(user).receive(function (r) {
                    if (!r) return;
                    //添加用户
                    userService.addUser(user);
                    //重新加载数据
                    $view.user.loadData();
                }).show();
            },
            //打开修改用户窗口
            editUser: function (user) {
                var url = 'bingoJS/demo/user/form';
                $modal(url).param(user).receive(function (r) {
                    if (!r) return;
                    //重新加载数据
                    $view.user.loadData();
                }).show();
            },
            //删除用户
            delUser: function (user) {
                userService.delUser(user);
                //重新加载数据
                this.loadData();
            }
        };

    });

    //user/form==========================
    module.controller('form', function ($view, $node, $modal) {
        $view.user = $modal().param();
        console.log('user/form', this, $view.user);

        $view.on('ready', function () {
            $node.css('visibility', 'visible');
            handleFixInputPlaceholderForIE();
        });

        $view.save = function () {
            //关闭窗口返回false
            $modal().close(true);
        };

    });

})();
