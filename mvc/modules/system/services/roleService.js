
(function () {
    'use strict';

    bingo.module('system', function () {
        
        var _list = null;

        bingo.service('roleService', function ($view, $ajax, $linq) {

            var _services = {
                initData: function () {
                    if (_list) return;
                    //第一次数据从文件读取数据
                    var url = 'modules/system/services/role.json';
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
                },
                getSelectList: function () {
                    var item = _services.newModel();
                    item.id = '';
                    item.name = '请选择角色';
                    return [item].concat(_list);
                },
                getRole: function (id) {
                    return $linq(_list).where(function () { return this.id == id; }).first();
                },
                getName: function (id) {
                    var role = this.getRole(id);
                    return role ? role.name : '';
                }
            };
            return _services;

        });
        //end userService

    });
    // end module

})();