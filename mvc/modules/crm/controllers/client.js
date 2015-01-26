
(function () {
    'use strict';

    //module
    bingo.module('crm', function () {

        bingo.using('service/crm/clientService');
        bingo.using('service/system/userService');

        //controller
        bingo.controller('client', function () {

            //action list
            bingo.action('list', function ($view, $node, $service, $dialog) {
                var clientService = $view.clientService = $service('clientService');
                //userService为跨模块, 在$service中要指明system模块
                var userService = $view.userService = $service('userService', 'system');

                $view.on('initdata', function () {
                    clientService.initData();
                    userService.initData();
                });

                //$node.showLoading();
                $view.on('ready', function () {
                    _client.loadData();
                    //$node.hideLoading();
                    $node.css('visibility', 'visible');
                });

                var _client = $view.client = {
                    formUrl: 'view/crm/client/form',
                    list: null,
                    loadData: function () {
                        _client.list = clientService.getList();
                        $view.$update();
                    },
                    create: function () {
                        var client = clientService.newModel();
                        $dialog(_client.formUrl)
                            .param({ client: client })
                            .receive(function (r) {
                                if (!r) return;
                                clientService.add(client);
                                _client.loadData();
                            }).show();
                    },
                    edit: function (client) {
                        $dialog(_client.formUrl)
                            .param({ client: client })
                            .receive(function (r) {
                                if (!r) return;
                                _client.loadData();
                            }).show();
                    },
                    viewInfo: function (client) {
                        $dialog(_client.formUrl)
                            .param({ client: client, isView: true })
                            .show();
                    },
                    doDelete: function (client) {
                        clientService.del(client);
                        _client.loadData();
                    },
                    delAll: function () {
                        clientService.delAll();
                        _client.loadData();
                    }
                };
            });
            // end list

            //action form
            bingo.action('form', function ($view, $node, $model, $service, $dialog) {
                var userService = $view.userService = $service('userService', 'system');
                //取得dialog对象
                var _dialog = $dialog();

                $view.on('initdata', function () {
                    userService.initData();
                });

                //取得参数
                var _params = _dialog.param();

                //是否查看模式, 参数isView
                $view.isView = (_params.isView === true);

                //$view.on('ready', function () {
                //    handleFixInputPlaceholderForIE($view);
                //});

                //事件show, 当dialog动画处理完后, 再处理数据, 让动画平滑
                _dialog.on('show', function () {
                    handleFixInputPlaceholderForIE($view);

                    $view.users = userService.getSelectList();
                    //初始数据, 分离数据, 防止修改数据
                    $view.client = $model(_params.client);
                    _dialog.hideLoading();

                });

                $view.save = function () {
                    //修改数据
                    $view.client.toObject(_params.client);
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
