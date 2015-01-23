
(function () {
    'use strict';

    bingo.module('system', function () {
        
        //缓存数据, 浏览器刷新后清除
        var _list = null;

        //service/system/userService
        bingo.service('userService', function ($view, $ajax, $linq) {

            //返回userService对象
            var _services = {
                //初始数据(加载数据)
                initData: function () {
                    if (_list) return;
                    var url = 'modules/system/services/users.json';
                    $ajax(url).success(function (rs) {
                        _list = bingo.isString(rs) ? JSON.parse(rs) : rs;
                    }).get();
                },
                //取得所有数据
                getList: function () {
                    return _list;
                },
                //新建model
                newModel: function () {
                    return {
                        "id": bingo.makeAutoId(),
                        "name": "",
                        "loginId": "",
                        "role": "",
                        "sex": "男",
                        "email": "",
                        "phone": "",
                        "desc": ""
                    };
                },
                //删除所有数据
                delAll: function () {
                    _list = [];
                },
                //添加一个数据
                add: function (p) {
                    _list.push(p);
                },
                //删除一个数据
                del: function (p) {
                    _list = bingo.removeArrayItem(p, _list);
                },
                //取得下拉框所需数据
                getSelectList: function () {
                    var item = _services.newModel();
                    item.id = '';
                    item.name = '请选择所属人员';
                    return [item].concat(_list);
                },
                //取得user
                getUser: function (id) {
                    return $linq(_list).where(function () { return this.id == id; }).first();
                },
                //取得userName
                getName: function (id) {
                    var role = this.getUser(id);
                    return role ? role.name : '';
                }
            };
            return _services;
        });
        //end userService

    });
    // end module

})();