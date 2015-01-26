
(function () {
    'use strict';

    //模块system
    bingo.module('system', function () {

        //引用service
        bingo.using('service/system/userService');
        bingo.using('service/system/roleService');

        //控制器user
        bingo.controller('user', function () {

            //action list: ctrl/system/user/list
            bingo.action('list', function ($view, $node, $ajax, $service, $dialog) {
                //实例service
                var userService = $view.userService = $service('userService');
                var roleService = $view.roleService = $service('roleService');

                //initdata时, 主要加载异步数据, 直到所有数据都加载完成, 在ready之前
                $view.on('initdata', function () {
                    userService.initData();
                    roleService.initData();
                });

                //ready事件, view准备好了.
                //$node.showLoading();
                $view.on('ready', function () {
                    _user.loadData();
                    //$node.hideLoading();
                    $node.css('visibility', 'visible');
                });

                var _user = $view.user = {
                    formUrl: 'view/system/user/form',
                    list: null,
                    //加载数据
                    loadData: function () {
                        _user.list = userService.getList();
                        $view.$update();
                    },
                    //打开创建用户窗口
                    create: function () {
                        //console.log('aaa'); return;
                        //新用户实体
                        var user = userService.newModel();
                        $dialog(_user.formUrl)
                            .param({ user: user })
                            .receive(function (r) {
                                if (!r) return;
                                //添加用户
                                userService.add(user);
                                _user.loadData();
                                //重新加载数据
                            }).show();
                    },
                    //打开修改用户窗口
                    edit: function (user) {
                        $dialog(_user.formUrl)
                            .param({ user: user })
                            .receive(function (r) {
                                if (!r) return;
                                //重新加载数据
                                _user.loadData();
                            }).show();
                    },
                    //打开查看用户窗口
                    viewInfo: function (user) {
                        $dialog(_user.formUrl)
                            .param({ user: user, isView: true })
                            .show();
                    },
                    //删除用户
                    doDelete: function (user) {
                        userService.del(user);
                        _user.loadData();
                    },
                    //删除所有用户
                    delAll: function () {
                        userService.delAll();
                        _user.loadData();
                    }
                };

            });
            // end list

            //action form: ctrl/system/user/form
            bingo.action('form', function ($view, $model, $dialog, $service) {
                var roleService = $service('roleService');
                //取得dialog对象
                var _dialog = $dialog();

                //initdata时, 主要加载异步数据, 直到所有数据都加载完成, 在ready之前
                $view.on('initdata', function () {
                    roleService.initData();
                });

                //取得参数
                var _params = _dialog.param();

                //是否查看模式, 参数isView
                $view.isView = (_params.isView === true);

                //$view的ready事件
                //$view.on('ready', function () {
                //    handleFixInputPlaceholderForIE($view);
                //});

                //事件show, 当dialog动画处理完后, 再处理数据, 让动画平滑
                _dialog.on('show', function () {
                    handleFixInputPlaceholderForIE($view);

                    $view.roles = roleService.getSelectList();
                    //初始user为$model
                    $view.user = $model(_params.user);
                    _dialog.hideLoading();

                });

                //测试事件close
                _dialog.on('close', function () {
                    console.log('form close');
                });

                $view.save = function () {
                    //将$view.user的内容赋到_params.user
                    $view.user.toObject(_params.user);
                    //关闭窗口返回false
                    _dialog.close(true);
                };

            });
            //end form

        });
        //end controller

    });
    //end module

})();
