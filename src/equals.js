
; (function (bingo) {
    //version 1.0.1
    "use strict";

    var _equals = function (p1, p2) {
        if ((bingo.isNull(p1) || bingo.isNull(p2)) && p1 !== p2)
            return false;
        if (bingo.isArray(p1)) {
            return _ArrayEquals(p1, p2);
        } else if (p1 instanceof RegExp) {
            return _RegExpEquals(p1, p2);
        } else if (bingo.isFunction(p1)){
            return (bingo.isFunction(p2) && p1.valueOf() === p2.valueOf());
        } else if (bingo.isObject(p1)) {
            return _ObjectEquals(p1, p2);
        } else {
            return ((typeof (p1) === typeof (p2)) && (p1 === p2));
        }
    }

    var _RegExpEquals = function (reg1, reg2) {
        return (reg2 instanceof RegExp) &&
         (reg1.source === reg2.source) &&
         (reg1.global === reg2.global) &&
         (reg1.ignoreCase === reg2.ignoreCase) &&
         (reg1.multiline === reg2.multiline);
    };

    var _ArrayEquals = function (arr1, arr2) {
        if (arr1 === arr2) { return true; }
        if (!bingo.isArray(arr2) || arr1.length != arr2.length) { return false; } // null is not instanceof Object.
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (!_equals(arr1[i], arr2[i])) return false;
        }
        return true;
    };

    var _ObjectEquals = function (obj1, obj2) {
        if (obj1 === obj2) { return true; }
        if (!bingo.isObject(obj2)) { return false; }
        var count = 0;
        for (var n in obj1) {
            count++;
            if (!_equals(obj1[n], obj2[n])) return false;
        }
        for (var nn in obj2) count--;
        return (count === 0);
    };

    bingo.extend({
        equals: function (o1, o2) {
            return _equals(o1, o2);
        }
    });
//    var o = { a: 1, b: 1, c: [1, { a: 22 }, 2], d:1, f:new Date(1, 2, 3), e:/ab/g};
//    var o1 = { a: 1, b: 1, c: [1, { a: 22}, 2], d:1, f:new Date(1, 2,3), e:/a/g};
//    console.log("equals", bingo.equals(o, o1));

})(bingo);