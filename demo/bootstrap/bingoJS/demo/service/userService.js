
(function () {
    'use strict';

    bingo.service('userService', function ($ajax, $timeout) {
        var _userList = null;
        return {
            getList: function (callback) {
                if (_userList) {
                    $timeout(function () {
                        callback && callback(bingo.clone(_userList, false));
                    });
                    return;
                }

                var url = bingo.getRelativeFile('bingoJS/demo/service/users.json');
                $ajax(url).success(function (rs) {
                    _userList = bingo.isString(rs) ? JSON.parse(rs) : rs;

                    callback && callback(_userList);
                }).get();
            },
            newUser: function () {
                return {
                    "name": "",
                    "loginId": "",
                    "sex": "男",
                    "email": "",
                    "phone": "",
                    "desc": ""
                };
            },
            addUser: function (user) {
                _userList.push(user);
            },
            delUser: function (user) {
                _userList = bingo.removeArrayItem(user, _userList);
            }
        };
    });

})();