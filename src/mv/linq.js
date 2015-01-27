//todo:_linqClass的edit等

(function (bingo) {
    //version 1.0.1
    "use strict";

    var _linqClass = bingo.linqClass = bingo.Class(function () {

        this.Define({
            each: function (fn, index, rever) {
                this._doLastWhere();
                bingo.each(this._datas, fn, index, rever);
                return this;
            },
            where: function (fn, index, count, rever) {
                /// <summary>
                /// 过滤<br />
                /// where(function(item, index){ return item.max > 0 ;});
                /// </summary>
                /// <param name="fn" type="function(item, index)"></param>
                /// <param name="index" type="Number">开始位置, 如果负数从后面算起</param>
                /// <param name="count" type="Number">数量</param>
                /// <param name="rever" type="Boolean">反向</param>

                this._doLastWhere();
                this._lastWhere = {
                    fn: fn, index: index,
                    count: bingo.isNumeric(count) ? count : -1,
                    rever: rever
                };
                return this;
            },
            _lastWhere:null,
            _doLastWhere: function (index, count, rever) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="index" type="Number">开始位置, 如果负数从后面算起</param>
                /// <param name="count" type="Number">数量</param>
                /// <param name="rever" type="Boolean">反向</param>

                var lastWhere = this._lastWhere;
                if (lastWhere) {
                    this._lastWhere = null;
                    var fn = lastWhere.fn,
                        index = bingo.isNumeric(index) ? index : lastWhere.index,
                        count = bingo.isNumeric(count) ? count : lastWhere.count,
                        rever = !bingo.isUndefined(rever) ? rever : lastWhere.rever;

                    var list = [];
                    this.each(function (item, index) {
                        if (fn.call(item, item, index)) {
                            list.push(item);
                            if (count != -1) {
                                count--;
                                if (count == 0) return false;
                            }
                        }
                    }, index, rever);
                    this._datas = list;
                }
                return this;
            },
            select: function (fn, isMerge) {
                /// <summary>
                /// 映射(改造)<br />
                /// select(function(item, index){ return {a:item.__a, b:item.c+item.d} ;});
                /// </summary>
                /// <param name="fn" type="function(item, index)"></param>
                /// <param name="isMerge">是否合并数组</param>
                this._doLastWhere();
                var list = [];
                this.each(function (item, index) {
                    if (isMerge === true)
                        list = list.concat(fn.call(item, item, index));
                    else
                        list.push(fn.call(item, item, index));
                });
                this._datas = list;
                return this;
            },
            sort: function (fn) {
                /// <summary>
                /// 排序, sort(function(item1, item2){return item1-item2;})<br />
                /// item1 - item2:从小到大排序<br />
                /// item2 - item1:从大到小排序<br />
                /// item1 大于 item2:从小到大排序<br />
                /// item1 小于 item2:从大到小排序
                /// </summary>
                /// <param name="fn" type="function(item1, item2)"></param>
                this._doLastWhere();
                this._datas = this._datas.sort(function (item1, item2) {
                    var n = fn(item1, item2);
                    return n > 0 || n === true ? 1 : (n < 0 || n === false ? -1 : 0);
                });
                return this;
            },
            sortAsc: function (p) {
                /// <summary>
                /// 从小到大排序<br />
                /// sortAsc('max')<br />
                /// sortAsc(function(item){ return item.max; })
                /// </summary>
                /// <param name="p">属性名称/function(item)</param>
                var isFn = bingo.isFunction(p);
                return this.sort(function (item1, item2) {
                    if (isFn)
                        return p.call(item1, item1) - p.call(item2, item2);
                    else if (p)
                        return item1[p] - item2[p];
                    else
                        return item1 - item2;
                });
            },
            sortDesc: function (p) {
                /// <summary>
                /// 从大到小排序<br />
                /// sortDesc('max')<br />
                /// sortDesc(function(item){ return item.max; })
                /// </summary>
                /// <param name="p">属性名称/function(item)</param>
                var isFn = bingo.isFunction(p);
                return this.sort(function (item1, item2) {
                    if (isFn)
                        return p.call(item2, item2) - p.call(item1, item1);
                    else if (p)
                        return item2[p] - item1[p];
                    else
                        return item2 - item1;
                });
            },
            unique: function (fn) {
                /// <summary>
                /// 去除重复<br />
                /// 用法1. unique()<br />
                /// 用法2. unique(function(item, index){ return item['prop']; });
                /// </summary>
                /// <param name="fn" type="function(item, index)">可选</param>
                this._doLastWhere();
                var list = [], hasList = [];
                fn || (fn = function (item, index) { return item; });
                this.each(function (item, index) {
                    var o = fn.call(item, item, index);
                    if (bingo.inArray(o, hasList) < 0) {
                        list.push(item);
                        hasList.push(o);
                    }
                });
                this._datas = list;
                return this;
            },
            count: function () { this._doLastWhere(); return this._datas.length; },
            first: function (defaultValue) {
                /// <summary>
                /// 查找第一个数据
                /// </summary>
                /// <param name="defaultValue">可选, 默认值, 如果没有查找到时</param>
                this._doLastWhere(0, 1);
                return this._datas[0] || defaultValue;
            },
            last: function (defaultValue) {
                /// <summary>
                /// 查找最后一个数据
                /// </summary>
                /// <param name="defaultValue">可选, 默认值, 如果没有查找到时</param>
                this._doLastWhere(0, 1, true);
                return this._datas[0] || defaultValue;
            },
            contain: function () {
                /// <summary>
                /// 是否存在数据
                /// </summary>
                this._doLastWhere(0, 1);
                return this.count() > 0;
            },
            sum: function (callback) {
                this._doLastWhere();
                var n = 0;
                this.each(function (item, index) {
                    n += (callback ? callback.call(this, this, index) : item);
                });
                return n;
            },
            avg: function (callback) {
                this._doLastWhere();
                var n = 0;
                this.each(function (item, index) {
                    n += (callback ? callback.call(this, this, index) : item);
                });
                return (n == 0 ? 0 : n / this._datas.length);
            },
            min: function (callback) {
                this._doLastWhere();
                var n = -1, val, temp;
                this.each(function (item, index) {
                    val = (callback ? callback.call(item, item, index) : item);
                    if (index == 0 || n > val) {
                        n = val; temp = item;
                    }
                });
                return temp;
            },
            max: function (callback) {
                this._doLastWhere();
                var n = -1, val, temp;
                this.each(function (item, index) {
                    val = (callback ? callback.call(item, item, index) : item);
                    if (index == 0 || n < val) {
                        n = val; temp = item;
                    }
                });
                return temp;
            },
            take: function (pos, count) {
                this._doLastWhere();
                if (isNaN(count) || count < 0)
                    count = this.count();
                return bingo.sliceArray(this._datas, pos, count);
            },
            toArray: function () { this._doLastWhere(); return this._datas;},
            toPage: function (page, pageSize) {
                var list = this.toArray();
                var currentPage = 1, totalPage = 1, pageSize = pageSize, totals = list.length, list = list;
                if (list.length > 0) {
                    totalPage = parseInt(totals / pageSize) + (totals % pageSize != 0 ? 1 : 0);
                    currentPage = page > totalPage ? totalPage : page < 1 ? 1 : page;
                    list = this.take((currentPage - 1) * pageSize, pageSize);
                }
                return {
                    currentPage: currentPage, totalPage: totalPage, pageSize: pageSize,
                    totals: totals, list: list
                };
            },
            _getGroupByValue: function (value, rList, groupName) {
                for (var i = 0, len = rList.length; i < len; i++) {
                    if (rList[i][groupName] == value)
                        return rList[i];
                }
                return null;
            },
            group: function (callback, groupName, itemName) {
                /// <summary>
                /// 分组
                /// </summary>
                /// <param name="callback">function(item index){ return item.type;}</param>
                /// <param name="groupName">可选, 分组值, 默认group</param>
                /// <param name="itemName">可选, 分组内容值, 默认items</param>

                groupName || (groupName = 'group');
                itemName || (itemName = 'items');
                this._doLastWhere();
                var rList = [], list = this._datas;
                var len = list.length;
                var iT = null;
                var rT = null;
                var vT = null;
                for (var i = 0; i < len; i++) {
                    iT = list[i];
                    vT = callback.call(iT, iT, i);
                    rT = this._getGroupByValue(vT, rList, groupName);
                    if (rT == null) {
                        rT = {};
                        rT[groupName] = vT;
                        rT[itemName] = [iT];
                        rList.push(rT);
                    } else {
                        rT.items.push(iT);
                    }
                }
                this._datas = rList;
                return this;
            }
        });

        this.Initialization(function (p) {
            this._datas = p || [];
        });
    });

    bingo.linq = function (list) { return _linqClass.NewObject(list); };

    bingo.factory('$linq', function () {
        return function (p) { return bingo.linq(p); };
    });

})(bingo);