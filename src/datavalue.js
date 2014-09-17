
(function (bingo) {
    //version 1.0.1
    "use strict";

    var _getDataAttrRegex = /[\[\.]?[\'\"]?([^\[\]\.\'\"]+)[\'\"]?[\]\.]?/g;
    var _getAttrList = function (name) {
        _getDataAttrRegex.lastIndex = 0;
        var attrList = [];
        name.replace(_getDataAttrRegex, function (find, attrName, findPos, allText) {
            if (_isArrayAttr(find) && attrList.length > 0)
                attrList[attrList.length - 1].isArray = true;
            attrList.push({ attrname: attrName, isArray: false });
        });
        return attrList;
    };
    var _setDataValue = function (data, name, value) {
        if (!data || bingo.isNullEmpty(name)) return;
        if (name.indexOf('.') < 0 && name.indexOf(']') < 0) { data[name] = value; }

        var attrList = _getAttrList(name);

        var to = data, item = null;
        var len = attrList.length - 1;
        var nameItem = null;
        for (var i = 0; i < len; i++) {
            item = attrList[i];
            nameItem = item.attrname;
            if (bingo.isNull(to[nameItem])) {
                to[nameItem] = item.isArray ? [] : {};
            }
            to = to[nameItem];
        }
        nameItem = attrList[len].attrname;
        to[nameItem] = value;

    }, _isArrayAttr = function (find) { return find.indexOf(']') >= 0 && (find.indexOf('"') < 0 && find.indexOf("'") < 0); };

    var _getDataValue = function (data, name) {
        if (!data || bingo.isNullEmpty(name)) return;
        if (name.indexOf('.') < 0 && name.indexOf(']') < 0) return data[name];

        var attrList = _getAttrList(name);

        var to = data, item = null;
        var len = attrList.length - 1;
        var nameItem = null;
        for (var i = 0; i < len; i++) {
            item = attrList[i];
            nameItem = item.attrname;
            if (bingo.isNull(to[nameItem])) {
                return to[nameItem];
            }
            to = to[nameItem];
        }
        nameItem = attrList[len].attrname;
        return to[nameItem];
    };

    bingo.extend({
        datavalue: function (data, name, value) {
            if (arguments.length >= 3) {
                _setDataValue(data, name, value);
            } else {
                return _getDataValue(data, name);
            }
        }
    });

})(bingo);