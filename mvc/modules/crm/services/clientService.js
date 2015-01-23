
(function () {
    'use strict';

    bingo.module('crm', function () {
        
        var _list = null;

        bingo.service('clientService', function ($view, $ajax, $linq) {

            var _services = {
                initData: function () {
                    if (_list) return;
                    //第一次数据从文件读取数据
                    var url = 'modules/crm/services/client.json';
                    $ajax(url).success(function (rs) {
                        _list = bingo.isString(rs) ? JSON.parse(rs) : rs;
                    }).get();
                },
                getList: function () {
                    return _list;
                },
                newModel: function () {
                    return {
                        "id": bingo.makeAutoId(),
                        "name": "",
                        "sex": "",
                        "user": "",
                        "tel": "",
                        "desc": ""
                    };
                },
                delAll: function () {
                    _list = [];
                },
                add: function (p) {
                    _list.push(p);
                },
                del: function (p) {
                    _list = bingo.removeArrayItem(p, _list);
                }
            };
            return _services;

        });
        //end userService

    });
    // end module

})();