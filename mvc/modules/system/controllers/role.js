
(function () {
    'use strict';

    //module
    bingo.module('system', function () {

        bingo.using('service/system/roleService');

        //controller
        bingo.controller('role', function () {

            //action list
            bingo.action('list', function ($view, $node, $service, $dialog) {
                var roleService = $service('roleService');

                $view.on('initdata', function () {
                    roleService.initData();
                });

                //$node.showLoading();
                $view.on('ready', function () {
                    _role.loadData();
                    //$node.hideLoading();
                    $node.css('visibility', 'visible');
                });

                var _role = $view.role = {
                    formUrl: 'view/system/role/form',
                    list: null,
                    loadData: function () {
                        _role.list = roleService.getList();
                        $view.$update();
                    },
                    create: function () {
                        var role = roleService.newModel();
                        $dialog(_role.formUrl)
                            .param({ role: role })
                            .receive(function (r) {
                                if (!r) return;
                                roleService.add(role);
                                _role.loadData();
                            }).show();
                    },
                    edit: function (role) {
                        $dialog(_role.formUrl)
                            .param({ role: role })
                            .receive(function (r) {
                                if (!r) return;
                                _role.loadData();
                            }).show();
                    },
                    viewInfo: function (role) {
                        $dialog(_role.formUrl)
                            .param({ role: role, isView: true })
                            .show();
                    },
                    doDelete: function (role) {
                        roleService.del(role);
                        _role.loadData();
                    },
                    delAll: function () {
                        roleService.delAll();
                        _role.loadData();
                    }
                };
            });
            // end list

            //action form
            bingo.action('form', function ($view, $node, $model, $dialog) {
                //取得dialog对象
                var _dialog = $dialog();
                //取得参数
                var _params = _dialog.param();

                //是否查看模式, 参数isView
                $view.isView = (_params.isView === true);

                //初始数据, 分离数据, 防止修改数据
                $view.role = $model(_params.role);

                //$view.on('ready', function () {
                //    handleFixInputPlaceholderForIE($view);
                //});

                //事件show, 当dialog动画处理完后, 再处理数据, 让动画平滑
                _dialog.on('show', function () {
                    handleFixInputPlaceholderForIE($view);
                    _dialog.hideLoading();

                });

                $view.save = function () {
                    //修改数据
                    $view.role.toObject(_params.role);
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
