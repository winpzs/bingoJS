//todo:
; (function (bingo) {
    //version 1.0.1
    "use strict";

    bingo.mvc = {};

    var _factory = {}, _service = {}, _command = {}, _filter = {};
    var _rootView = null;
    
    var _injectNoop = function () { };
    _injectNoop.$injects = [];

    var _makeInjectAttrRegx = /^\s*function[^(]*?\(([^)]+?)\)/i,
    _makeInjectAttrs = bingo._makeInjectAttrs = function (p) {
        if (p && p.$injects) return p;
        var fn = _injectNoop;
        if (bingo.isArray(p)) {
            fn = p.pop();
            fn.$injects = p;
        } else if (bingo.isFunction(p)) {
            fn = p;
            var s = fn.toString();
            var list = [];
            s.replace(_makeInjectAttrRegx, function (findText, find0) {
                if (find0) {
                    bingo.each(find0.split(','), function (item) {
                        item = bingo.trim(item);
                        item && list.push(item);
                    });
                }
            });
            fn.$injects = list;
        }
        return fn;
    },
    //取得注入: _inject('$view', $view, $domnode, $attr, node, {}, {}); //$view为必要, 其它为可选
    _inject = function (p, view, domnode, attr, node, para, injectObj) {

        injectObj = injectObj || {};
        //var $view = injectObj.$view || view || bingo.rootView();
        //var $module = injectObj.$module || $view._module;
        var fn = null;
        if (bingo.isString(p)) {
            //如果是字串
            if (p in injectObj) {
                //如果已经存在
                return injectObj[p];
            }
            injectObj[p] = {};
            fn = bingo.factory(p);
            //(!bingo.isFunction(fn)) && (fn = ($module ? $module.service(p) : bingo.service(p)));
            (!bingo.isFunction(fn)) && (fn = bingo.service(p));
            if (!fn) return {};
        } else
            fn = p;

        var $injects = fn.$injects;
        var injectParams = [];
        if ($injects && $injects.length > 0) {
            if (!injectObj.$view) {
                injectObj.$view = view || bingo.rootView();
                //injectObj.$module = $module;
                injectObj.$domnode = domnode;
                injectObj.$withData = (para && para.withData) || (domnode ? domnode.getWithData() : null);
                injectObj.node = node ? node : (domnode ? domnode.node : (view && view.node));
                injectObj.$attr = attr;
                injectObj.$injectParam = para;
                injectObj.$command = attr ? attr.command : null;
            }
            //bingo.isString(p) && (injectObj[p] = {});

            var pTemp = null;
            bingo.each($injects, function (item) {
                if (item in injectObj) {
                    pTemp = injectObj[item];
                } else {
                    //injectObj[item] = {};//防止循环引用
                    pTemp = injectObj[item] = _inject(item, view, domnode, attr, node, para, injectObj);
                }
                injectParams.push(pTemp);
            });
        }

        var ret = fn.apply(injectObj.$module || injectObj.$view, injectParams) || {};
        bingo.isString(p) && (injectObj[p] = ret);

        return ret;
    };

    //console.log(_makeInjectAttrs(function ($ddd, asdf, aaaa) { }));
    //console.log(_makeInjectAttrs(function ($ddd, userServer, $http) { }));

    bingo.extend({
        //工厂
        factory: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            if (arguments.length == 1)
                return _factory[name];
            else
                _factory[name] = _makeInjectAttrs(fn);
        },
        //过滤器
        filter: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            if (arguments.length == 1)
                return _filter[name];
            else
                _filter[name] = _makeInjectAttrs(fn);
        },
        //标签指令
        command: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            name = name.toLowerCase();
            if (arguments.length == 1)
                return _command[name];
            else
                _command[name] = _makeInjectAttrs(fn);
        },
        inject: function (p, view, domnode, attr, node, para) {
            return _inject(p, view, domnode, attr, node, para);
        },
        start: function () {
            bingo.using(function () {
                var node = document.documentElement;
                _rootView = _viewClass.NewObject(node);
                _templateClass.NewObject().fromNode(node).compile();
            });
        },
        getView: function (jqSelector) {
            var jo = $(jqSelector);
            return (jo.size() == 0) ? null : _compiles.getView(jo[0]);
        },
        rootView: function () { return _rootView; }
    });


    var _compiles = {
        compiledAttrName: ['bg_cpl', bingo.makeAutoId()].join('_'),
        isCompileNode: function (node) {
            return node[this.compiledAttrName] == "1";
        },
        setCompileNode: function (node) {
            node[this.compiledAttrName] = "1";
        },
        domNodeName: ['bg_cpl_domnode', bingo.makeAutoId()].join('_'),
        //向node及node父层搜索domnoe
        getDomnode: function (node) {
            if (node) {
                if (this.isDomnode(node))
                    return $(node).data('__domnode140907__');
                return this.getDomnode(node.parentNode);
            } else {
                return null;
            }
        },
        setDomnode: function (node, domnode) {
            node[this.domNodeName] = "1";
            $(node).data('__domnode140907__', domnode);
        },
        removeDomnode: function (domnode) {
            var node = domnode.node;
            node[this.domNodeName] == "0";
            $(node).removeData('__domnode140907__');
        },
        isDomnode: function (node) {
            return node[this.domNodeName] == "1";
        },
        getView: function (node) {
            var domnode = this.getDomnode(node);
            return domnode ? domnode.view : null;
        },
        _textTagRegex: /\{\{([^}]+?)\}\}/gi,
        hasTextTag: function (text) {
            this._textTagRegex.lastIndex = 0;
            return this._textTagRegex.test(text);
        },
        _isCompileTextTag: function (node, pNode) {
            var list = (node.parentNode || pNode)._isCompileTextTags_;
            if (!list) return false;
            return bingo.inArray(node, list) >= 0;
        },
        _setCompileTextTag: function (node, pNode) {
            var list = (node.parentNode || pNode)._isCompileTextTags_ || ((node.parentNode || pNode)._isCompileTextTags_ = []);
            list.push(node);
        },
        _removeCompileTextTag: function (node) {
            var list = node.parentNode && node.parentNode._isCompileTextTags_;
            list && (node.parentNode._isCompileTextTags_ = bingo.removeArrayItem(node, list));
        },
        _makeCommand: function (command, view, node) {
            command = bingo.inject(command, view, null, null, node);
            var opt = {
                priority: 50,
                tmpl: '',
                tmplUrl: '',
                replace: false,
                include: false,
                view: false,
                compileChild: true,
                readyAuto: true
                //controller: null,
                //compilePre: null,
                //compile: null,
                //link: null
            };
            if (bingo.isFunction(command) || bingo.isArray(command)) {
                opt.link = command;
            } else
                opt = bingo.extend(opt, command);

            opt.compilePre || (opt.compilePre = _injectNoop);
            opt.compile || (opt.compile = _injectNoop);
            opt.controller || (opt.controller = _injectNoop);
            opt.link || (opt.link = _injectNoop);

            if (!bingo.isNullEmpty(opt.tmplUrl)) {
                bingo.inject('$ajax', view)(opt.tmplUrl).dataType('text').cache(true).async(false).success(function (rs) { opt.tmpl = rs; }).get();
            }

            opt.compilePre = _makeInjectAttrs(opt.compilePre);
            bingo.inject(opt.compilePre, view, null, null, node);

            return opt;
        },
        //hasAttr: function (node, attrName) { return node.hasAttribute ? node.hasAttribute(attrName) : !bingo.isNullEmpty(node.getAttribute(attrName)); },
        traverseNodes: function (p) {
            /// <summary>
            /// 遍历node
            /// </summary>
            /// <param name="p" value='{ node: null, parentDomnode: null, view: null, data:null }'></param>

            //元素element 1
            //属性attr 2
            //文本text 3
            //注释comments 8
            //文档document 9

            var node = p.node;
            if (node.nodeType === 1) {

                if (!this.isCompileNode(node)) {
                    this.setCompileNode(node);

                    //如果不编译下级, 退出
                    if (!this.analyzeNode(node, p)) return;

                }
                var next = node.firstChild;
                if (next) {
                    var childNodes = [];
                    do {
                        childNodes.push(next);
                    } while (next = next.nextSibling);
                    this.traverseChildrenNodes(childNodes, p);
                }

            } else if (node.nodeType === 3) {
                if (!this._isCompileTextTag(node, p.node)) {
                    this._setCompileTextTag(node, p.node);

                    //收集textNode
                    var text = node.nodeValue;
                    if (_compiles.hasTextTag(text)) {
                        _textTagClass.NewObject(p.view, p.parentDomnode, node, node.nodeName, text, p.withData);
                    }
                }
            }
            node = p = null;
        },
        traverseChildrenNodes: function (nodes, p, withDataList) {
            var list = [];

            var node, pBak = bingo.clone(p, false);
            var tmplIndex = -1;
            for (var i = 0, len = nodes.length; i < len; i++) {
                node = nodes[i];
                tmplIndex = this.getTmplIndex(node);
                //tmplIndex > 0 && console.log('tmplIndex', tmplIndex);
                if (tmplIndex < 0) {
                    //如果没有找到injectRenderItemHtml的index, 按正常处理
                    p.node = node;
                    this.traverseNodes(p);
                    p = bingo.clone(pBak, false);
                } else {
                    //如果找到injectRenderItemHtml的index, 取得index值为当前值, 添加injectRenderItemHtml节点到list
                    p.withData = pBak.withData = withDataList ? withDataList[tmplIndex] : null;
                    //console.log('p.withData', tmplIndex, p.withData);
                    list.push(node);
                }
            }
            //删除injectRenderItemHtml节点
            while (list.length) {
                node = list.pop();
                node.parentNode.removeChild(node);
            }
        },
        //取得injectRenderItemHtml的index
        getTmplIndex: function (node) {
            if (node.nodeType == 8) {
                var nodeValue = node.nodeValue;
                if (!bingo.isNullEmpty(nodeValue) && nodeValue.indexOf('bingo_complie_') >= 0) {
                    return parseInt(nodeValue.replace('bingo_complie_', ''), 10);
                }
            }
            return -1;
        },
        analyzeNode: function (node, p) {
            /// <summary>
            /// 分析node
            /// </summary>
            /// <param name="node" value='document.body'></param>
            /// <param name="p" value='{ node: null, parentDomnode: null, view: null, data:null }'></param>
            var tagName = node.tagName, command = null;
            command = bingo.command(tagName);
            var attrList = [], textTagList = [], compileChild = true;
            var tmpl = null, replace = false, include = false, isNewView = false, readyAuto = false;
            if (command) {
                //node
                command = _compiles._makeCommand(command, p.view, node);
                replace = command.replace;
                include = command.include;
                tmpl = command.tmpl;
                isNewView = command.view;
                readyAuto = command.readyAuto;
                compileChild = command.compileChild;
                attrList.push({ aName: tagName, aVal: null, type: 'node', command: command });
            } else {
                //attr
                var attributes = node.attributes;
                if (attributes && attributes.length > 0) {

                    var aVal = null, aT = null, aName = null;
                    for (var i = 0, len = attributes.length; i < len; i++) {
                        aT = attributes[i];
                        if (aT) {
                            aVal = aT.nodeValue;
                            aName = aT.nodeName;
                            //if (aName.indexOf('frame')>=0) console.log(aName);
                            command = bingo.command(aName);
                            if (command) {
                                command = _compiles._makeCommand(command, p.view, node);
                                replace = command.replace;
                                include = command.include;
                                tmpl = command.tmpl;
                                isNewView || (isNewView = command.view);
                                readyAuto || (readyAuto = command.readyAuto);
                                (!compileChild) || (compileChild = command.compileChild);
                                attrList.push({ aName: aName, aVal: aVal, type: 'attr', command: command });
                                if (replace || include) break;
                            } else {
                                //是否有text标签{{text}}
                                if (_compiles.hasTextTag(aVal)) {
                                    textTagList.push({ node: aT, aName: aName, aVal: aVal });
                                }
                            }

                        }
                    }
                }
            }

            var domnode = null;
            if (attrList.length > 0) {

                //替换 或 include
                if (replace || include) {
                    var jNode = $(node);
                    if (!bingo.isNullEmpty(tmpl)) {
                        var jNewNode = $($.parseHTML(tmpl));
                        if (include && tmpl.indexOf('bg-include') >= 0) {
                            jNewNode.find('[bg-include]').add(jNewNode.filter('[bg-include]')).each(function () {
                                var jo = $(this);
                                if (bingo.isNullEmpty(jo.attr('bg-include'))) {//如果空才执行
                                    var jT = jNode.clone();
                                    //将新节点设置为已编译, 防止死循环
                                    _compiles.setCompileNode(jT[0]);
                                    jo.append(jT);
                                    //jo.removeAttr('bg-include');
                                }
                            });
                        }
                        var pView = p.view, pDomnode = p.parentDomnode, pBak = bingo.clone(p, false);
                        jNewNode.each(function () {
                            $(this).insertBefore(jNode);
                            if (this.nodeType === 1) {
                                //_compiles.setCompileNode(this);
                                //新view
                                if (isNewView) {
                                    p.view = _viewClass.NewObject(this, pView, readyAuto);
                                    if (p.controller) {
                                        p.view.$addController(p.controller);
                                        p.controller = null;
                                    }
                                }
                                //本节点
                                domnode = _domnodeClass.NewObject(p.view, this, isNewView ? null : pDomnode, p.withData);
                                //设置父节点
                                p.parentDomnode = domnode;
                                //连接node
                                //_compiles.setDomnode(this, domnode);
                                //清空p.withData
                                isNewView && (p.withData = null);

                                var attr = attrList[attrList.length - 1];
                                _domnodeAttrClass.NewObject(p.view, domnode, attr.type, attr.aName, attr.aVal, attr.command);
                            }
                            if (compileChild) {
                                p.node = this;
                                _compiles.traverseNodes(p);
                            }
                            p = bingo.clone(pBak, false);
                        });
                    }
                    jNode.remove();

                    //不编译子级
                    compileChild = false;
                } else {

                    if (!bingo.isNullEmpty(tmpl))
                        $(node).html(tmpl);

                    //新view
                    if (isNewView) {
                        p.view = _viewClass.NewObject(node, p.view, readyAuto);
                        if (p.controller) {
                            p.view.$addController(p.controller);
                            p.controller = null;
                        }
                    }
                    //父节点
                    var parentDomnode = p.parentDomnode;
                    //本节点
                    domnode = _domnodeClass.NewObject(p.view, node, isNewView ? null : parentDomnode, p.withData);
                    //设置父节点
                    p.parentDomnode = domnode;
                    //连接node
                    //this.setDomnode(node, domnode);
                    //清空p.withData
                    isNewView && (p.withData = null);

                    //处理attrList
                    var attrItem = null;
                    bingo.each(attrList, function () {
                        //如果新view特性的command, inject时是上级view
                        attrItem = _domnodeAttrClass.NewObject(p.view, domnode, this.type, this.aName, this.aVal, this.command);
                    });
                }
            }

            if (!(replace || include) && textTagList.length > 0) {
                var textItem = null;
                bingo.each(textTagList, function () {
                    //如果新view特性的command, inject时是上级view
                    textItem = _textTagClass.NewObject(p.view, domnode, this.node, this.aName, this.aVal);
                });
            }


            return compileChild;
            //return attrList;
        }
    };

    //模板==负责编译======================
    var _templateClass = bingo.mvc.templateClass = bingo.Class(function () {

        //编译, parentNode暂时无用
        var _comp = function (node, parentNode, parentDomnode, view, withData, controller) {
            //_compiles.traverseChildrenNodes(nodes, { node: parentNode, parentDomnode: parentDomnode, view: view, withData: withData });
            _compiles.traverseNodes({ node: node, parentDomnode: parentDomnode, view: view, withData: withData, controller: controller });
        }, _traverseChildrenNodes = function (nodes, parentDomnode, view, withDataList, controller) {
            //编译一组nodes.
            _compiles.traverseChildrenNodes(nodes, { node: null, parentDomnode: parentDomnode, view: view, withData: null, controller: controller }, withDataList);
        };

        this.Define({
            //给下一级新的View注入controller
            controller: function (controller) { this._controller = controller; return this;},
            fromNode: function (node) { return this.fromJquery(node); },
            fromHtml: function (html) { return this.fromJquery($.parseHTML(html)); },// this.fromJquery(html); },
            //注入renderItemHtml
            injectRenderItemHtml: function (itemName, html) {
                return bingo.isNullEmpty(html) ? '' : ['<!--bingo_complie_${', itemName, '_index}-->', html].join('');
            },
            fromUrl: function (url) { this._url = url; return this; },
            fromId: function (id) { return this.fromJquery($('#' + id)); },
            fromJquery: function (jqSelector) {
                this._jo = $(jqSelector); return this;
            },
            withData: function (data) { this._withData = data; return this; },
            withDataList: function (datas) { this._withDataList = datas; return this; },
            appendTo: function (node) { this._parentNode = $(node)[0]; return this; },
            //是否缓存, 默认true
            cache: function (cache) { this._cache = cache; return this; },
            stop: function (stop) { this._stop = (stop !== false); return this; },
            compilePre: function (compilePre) { this._compilePre = compilePre; return this; },
            compile: function (callback) {
                if (this._stop) {
                    this._stop = false;
                    this.clearProp();
                    return this;
                }
                //初始parentNode, parentDomnode, view
                var parentNode = this._parentNode;
                var parentDomnode = parentNode ? _compiles.getDomnode(parentNode) : null;
                var view = this._view;

                //检查parentDomnode, 如果有view并, view不等于parentDomnode.view, 将parentDomnode清空(新view)
                if (view && parentDomnode && parentDomnode.view != view)
                    parentDomnode = null;
                //检查view, 如果没有view, view取parentDomnode.view
                view || (view = parentDomnode ? parentDomnode.view : _rootView);

                //初始withData
                var withData = this._withData;
                var withDataList = this._withDataList;
                var controller = this._controller;
                var compilePre = this._compilePre;

                //_compile
                if (this._jo) {
                    var jo = this._jo;
                    this.clearProp();
                    if (!parentNode) {
                        //如果没parentNode, 根据当前node取得parentDomnode
                        //一般用于处理已经插入新节点后编译
                        if (jo.size() > 0) {
                            parentDomnode = _compiles.getDomnode(jo[0]);
                        } else
                            return this;
                    }
                    compilePre && compilePre.call(this);
                    if (parentNode) {
                        jo.appendTo(parentNode);
                    }
                    if (withDataList)
                        _traverseChildrenNodes(jo, parentDomnode, view, withDataList, controller);
                    else
                        jo.each(function () {
                            _comp(this, parentNode, parentDomnode, view, withData, controller);
                        });

                    //处理
                    view._handel();
                    callback && callback.call(this, jo[0]);
                } else if (parentNode && this._url) {
                    //以url方式加载, 必须先指parentNode;
                    var url = this._url, $this = this;
                    var ajax = bingo.inject('$ajax', view)(url).success(function (rs) {
                        if ($this._stop) {
                            $this._stop = false;
                            $this.clearProp();
                            return;
                        }

                        _templateClass.NewObject(view).fromHtml(rs).controller(controller)
                            .withData(withData).withDataList(withDataList)
                            .appendTo(parentNode).compilePre(compilePre).compile(function (jo) {
                                callback && callback.call(this, jo);
                                this.dispose();
                            });
                    }).error(function () { callback && callback(); }).dataType('text').cache(this.cache()).get();
                    this.clearProp();
                }
                return this;
            },
            clearProp: function () {
                this._jo = this._url = this._compilePre = this._controller = this._html = this._parentNode = this._view = this._withDataList = this._withData = null;
                this.cache(true);
                return this;
            }
        });

        this.Initialization(function (view) {
            this._view = view; this.cache(true);
        });

    });

    bingo.factory('$tmpl', ['$view', function ($view) {
        if ($view.__tmpl__) return $view.__tmpl__;
        var tmpl = _templateClass.NewObject($view);
        $view.__tmpl__ = tmpl;
        tmpl.disposeByOther($view);
        return tmpl;
    }]);

    //view==提供视图==================
    var _viewClass = bingo.mvc.viewClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Property({
            node: null,
            $parentView: null,
            $domnodeList: [],
            $textList: [],
            $children: [],
            _module: null,
            _readyAuto:true,
            //_controllerFn: null,
            //_isControllerFn: false,


            _controllers:[]
        });

        this.Define({
            _setParent: function (view) {
                if (view) {
                    this.$parentView = view;
                    view._addChild(this);
                }
            },
            _addDomnode: function (domnode) {
                this.$domnodeList.push(domnode);
            },
            _removeDomnode: function (domnode) {
                var list = this.$domnodeList;
                list = bingo.removeArrayItem(domnode, list);
                this.$domnodeList = list;
            },
            _addChild: function (view) {
                this.$children.push(view);
            },
            _removeChild: function (view) {
                var list = this.$children;
                list = bingo.removeArrayItem(view, list);
                this.$children = list;
            },
            _getWatch: function () {
                if (this.__watch__) return this.__watch__;
                var watch = _watchClass.NewObject();
                watch.setScope(this);
                this.__watch__ = watch;
                watch.disposeByOther(this);
                return watch;
            },
            _compile: function () {
                bingo.each(this.$domnodeList, function () {
                    if (!this.isDisposed) {
                        this._compile();
                    }
                });
            },
            _controller: function () {
                if (this._controllers.length > 0) {
                    var conList = this._controllers;
                    this._controllers = [];

                    var $this = this;
                    bingo.each(conList, function () {
                        bingo.inject(this, $this);
                    });

                    if (this._readyAuto)
                        setTimeout(function () {
                            $this.$sendReady();
                        });
                }

                bingo.each(this.$domnodeList, function () {
                    if (!this.isDisposed) {
                        this._controller();
                    }
                });
            },
            _link: function () {
                bingo.each(this.$domnodeList, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
            },
            _handel: function () {

                this._compile();//编译指令
                this._controller();//根据controller做初始
                this._link();//连接指令

                this._handleChild();//处理子级
            },
            _handleChild: function () {
                bingo.each(this.$children, function () {
                    if (!this.isDisposed) {
                        this._handel();
                    }
                });
            },
            _isReady_:false,
            $sendReady: function () {
                if (this.hasEvent('initdata')) {
                    var $this = this;
                    bingo.inject('$ajax', this).syncAll(function () {

                        $this.trigger('initdata').end('initdata');

                    }).success(function () {
                        //所有$axaj加载成功
                        $this.trigger('ready').end('ready');
                        $this._isReady_ = true;
                        $this.$update();
                    });
                } else {
                    this.trigger('ready').end('ready');
                    this._isReady_ = true;
                    this.$update();
                }
            },
            $setModule: function (module) {
                this._module = module;
            },
            $getModule: function () {
                return this._module;
            },
            //$setModule: function (moduleName) {
            //    //this._module = bingo.module(moduleName)(this);
            //    this._moduleName = moduleName;

            //    this._module = bingo.inject('$module', this);


            //    //var module = bingo.module(moduleName);
            //    //if (module) module._inject(this);
            //},
            //setController: function (controller) {
            //    this._controllerFn = bingo.isFunction(controller) || bingo.isArray(controller) ?
            //        _makeInjectAttrs(controller) : controller;
            //},


            $addController: function (controller) {
                var fn = bingo.isFunction(controller) || bingo.isArray(controller) ?
                    _makeInjectAttrs(controller) : controller;
                this._controllers.push(fn);
            },
            $getDomnode: function (node) {
                //node可选
                return _compiles.getDomnode(node || this.node);
            },
            $getNode: function (jqSelector) {
                var jo = this._$node_ || (this._$node_ = $(this.node));
                return arguments.length == 0 ? jo : jo.find(jqSelector);
            },
            $update: function () { return this.$publish(); },
            $updateAsync: function () {
                if (this._isReady_ === true) {
                    this.$observer().publishAsync();
                }
                return this;
            },
            $apply: function (callback, thisArg) {
                if (callback) {
                    //this.$update();
                    callback.apply(thisArg || this);
                    this.$update();
                }
                return this;
            },
            $proxy: function (callback, thisArg) {
                var $view = this;
                return function () {
                    //$view.$update();
                    callback.apply(thisArg || this, arguments);
                    $view.$update();
                };
            },
            $publish: function () {
                if (this._isReady_ === true) {
                    this.$observer().publish();
                }
                return this;
            },
            $observer: function () {
                return bingo.inject('$observer', this);
            },
            $subscribe: function (p, callback, deep, disposer) {
                this.$observer().subscribe(p, callback, deep, disposer);
            },
            $subs: function (p, callback, deep, disposer) {
                this.$subscribe.apply(this, arguments);
            }
        });

        this.Initialization(function (node, parentView, readyAuto) {
            this.base();
            this.linkToDom(node);
            this.node = node;
            this.$parentView = parentView;
            this._readyAuto = (readyAuto !== false);

            parentView && this._setParent(parentView);
            this.onDispose(function () {
                //console.log('dispose view');


                bingo.each(this.$textList, function (item) {
                    if (item) item.dispose();
                });


                //处理父子
                var parentView = this.$parentView;
                if (parentView && !parentView.isDisposed)
                    parentView._removeChild(this);

                this.$children = this.$domnodeList = this.$textList = [];

            });

        });
    });

    //domnode==管理与node节点连接====================
    var _domnodeClass = bingo.mvc.domnodeClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Property({
            view: null,
            node: null,
            //jNode:null,
            parentDomnode: null,
            attrList: [],//command属性
            textList: [],
            children: [],
            __withData__: null,
            _isCompiled: false,
            _isLinked: false,
            _isController: false
        });

        this.Define({
            _addChild: function (domnode) {
                this.children.push(domnode);
            },
            _removeChild: function (domnode) {
                var list = this.children;
                list = bingo.removeArrayItem(domnode, list);
                this.children = list;
            },
            _sortAttrs: function () {
                if (this.attrList.length > 1) {
                    // 根据优先级(priority)排序， 越大越前,
                    this.attrList = this.attrList.sort(function (item1, item2) { return item1.priority == item2.priority ? 0 : (item1.priority > item2.priority ? -1 : 1); });
                }
            },
            _compile: function () {
                if (!this._isCompiled) {
                    this._isCompiled = true;
                    bingo.each(this.attrList, function () {
                        if (!this.isDisposed) {
                            this._compile();
                        }
                    });
                }
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._compile();
                    }
                });
            },
            _controller: function () {
                if (!this._isController) {
                    this._isController = true;
                    bingo.each(this.attrList, function () {
                        if (!this.isDisposed) {
                            this._controller();
                        }
                    });
                }
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._controller();
                    }
                });
            },
            _link: function () {
                if (!this._isLinked) {
                    this._isLinked = true;
                    bingo.each(this.attrList, function () {
                        if (!this.isDisposed) {
                            this._link();
                        }
                    });
                }
                bingo.each(this.textList, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
            },
            getWithData: function () {
                return this.__withData__;
            },
            $getAttr: function (name) {
                name = name.toLowerCase();
                var item = null;
                bingo.each(this.attrList, function () {
                    if (this.attrName == name) { item = this; return false; }
                });
                return item;
            },
            $html: function (html) {
                if (arguments.length > 0) {
                    $(this.node).html('');
                    bingo.inject('$tmpl', this.view, this).fromHtml(html).withData(this.getWithData()).appendTo(this.node).compile();
                    return this;
                } else
                    return $(this.node).html();
            }
        });

        this.Initialization(function (view, node, parentDomnode, withData) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="view">_viewClass</param>
            /// <param name="node">dom element</param>
            /// <param name="attrList">属性</param>
            /// <param name="parentDomnode">父节点_domnodeClass</param>

            this.base();
            this.linkToDom(node);
            //连接node
            _compiles.setDomnode(node, this);

            this.__withData__ = withData;
            if (parentDomnode) {
                this.parentDomnode = parentDomnode;
                //继承父层withData
                withData || (this.__withData__ = parentDomnode.__withData__);
                parentDomnode._addChild(this);
            }

            this.view = view;
            //如果没有父节点时, 添加到view
            parentDomnode || view._addDomnode(this);

            this.node = node;
            //this.jNode = $(node);

            var isDomRemoved = false;
            this.on('domRemoved', function () {
                isDomRemoved = true;
            });

            this.onDispose(function () {

                if (!isDomRemoved) {
                    _compiles.removeDomnode(this);
                }
                //console.log('attrLst D', this.attrList());
                //释放attrLst
                bingo.each(this.attrList, function (item) {
                    if (item) item.dispose();
                });

                bingo.each(this.textList, function (item) {
                    if (item) item.dispose();
                });

                //处理父子
                var parentDomnode = this.parentDomnode;
                if (parentDomnode) {
                    (!parentDomnode.isDisposed) && parentDomnode._removeChild(this);
                } else {
                    var view = this.view
                    (!view.isDisposed) && view._removeDomnode(this);
                }

                this.attrList = this.children = this.textList = [];
                //console.log('dispose domnode');
            });

        });
    });

    //domnode attr====管理与指令连接================
    var _domnodeAttrClass = bingo.mvc.domnodeAttrClass = bingo.Class(function () {

        this.Property({
            view: null,
            domnode: null,
            command: null,
            attrName: '',
            _bindContext:null,
            type: ''//attr|node
        });

        this.Define({
            _compile: function () {
                var command = this.command;
                var compile = command.compile;
                if (compile) {
                    bingo.inject(compile, this.view, this.domnode, this);
                }
            },
            _controller: function () {
                var command = this.command;
                var controller = command.controller;
                if (controller) {
                    bingo.inject(controller, this.view, this.domnode, this);
                }
            },
            _link: function () {
                var command = this.command;
                var link = command.link;
                if (link) {
                    bingo.inject(link, this.view, this.domnode, this);
                    this._init();
                }
            },
            _makeCommand: function (command) {
                if (command) {
                    var opt = command;
                    opt.compile = _makeInjectAttrs(opt.compile);
                    opt.controller = _makeInjectAttrs(opt.controller);
                    opt.link = _makeInjectAttrs(opt.link);
                }
                this.command = command || {};
            },
            getWithData: function () {
                return this.domnode.getWithData();
            },
            //属性原值
            $prop: function (p) {
                if (arguments.length==0)
                    return this._bindContext.$prop();
                else 
                    this._bindContext.$prop(p);
                return this;
            },
            //执行内容, 不会报出错误
            $eval: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return this._bindContext.$eval(event, view);
            },
            //执行内容, 并返回结果, 不会报出错误
            $context: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return this._bindContext.$context(event, view);
            },
            //返回withData/$view/window属性值
            $value: function (value) {
                if (arguments.length == 0)
                    return this._bindContext.$value();
                else
                    return this._bindContext.$value(value);
                return this;
            },
            $subs: function (p, p1, deep) {
                if (arguments.length == 1) {
                    p1 = p;
                    var $this = this;
                    p = function () { return $this.$context(); };
                }
                this.view.$subs(p, p1, deep, this);
            },
            _init: function () {
                this.__isinit = true;
                var para = this.__initParam;
                if (para) {
                    var p = para.p, p1 = para.p1;
                    this.__initParam = null;
                    var val = bingo.isFunction(p) ? p.call(this) : p;
                    p1.call(this, bingo.variableOf(val));
                }
            },
            $init: function (p, p1) {
                if (arguments.length == 1) {
                    p1 = p;
                    var $this = this;
                    p = function () { return $this.$context(); };
                }
                this.__initParam = { p: p, p1: p1 };
                if (this.__isinit)
                    this._init();
            }
        });

        this.Initialization(function (view, domnode, type, attrName, attrValue, command) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="domnode">属性名称</param>
            /// <param name="attrName">属性名称</param>
            /// <param name="attrValue">属性名称</param>
            /// <param name="command">指令定义</param>

            //this.base();
            this.__initParam = null;this.__isinit=false,

            this.domnode = domnode;
            domnode.attrList.push(this);

            this.view = view;

            this.type = type;
            this.attrName = attrName.toLowerCase();

            var $bindContext = bingo.inject('$bindContext', view, domnode, this);
            this._bindContext = $bindContext(attrValue);

            this._makeCommand(command);

            this.onDispose(function () {
                this._bindContext.dispose();
                //console.log('dispose attr:' + this.attrName);
            });
        });
    });

    //标签==========================
    var _textTagClass = bingo.mvc.textTagClass = bingo.Class(function () {

        this.Property({
            view: null,
            domnode: null,
            node: null,
            attrName: '',
            attrValue: '',
            __withData__: null,
            _isLinked: false
        });

        this.Define({
            _link: function () {
                if (!this._isLinked) {
                    this._isLinked = true;

                    var nodeValue = this.attrValue;
                    var tagList = [];
                    var $this = this;

                    var s = this.node.nodeValue = nodeValue.replace(_compiles._textTagRegex, function (findText, textTagContain, findPos, allText) {
                        var item = { };

                        var $bindContext = bingo.inject('$bindContext', $this.view, $this.domnode, null, $this.node);
                        var context = $bindContext(textTagContain, $this.node, $this.getWithData());

                        item.text = findText, item.context = context;
                        tagList.push(item);

                        var value = context.$context();
                        return item.value = value || '';
                    });
                    //console.log('tagList', tagList);
                    bingo.each(tagList, function (item) {
                        var context = item.context, text = item.text;

                        $this.view.$subs(function () { return context.$context(); }, function (newValue) {
                            if ($this._isRemvoe()) {
                                $this._remove(); this.dispose(); _dispose(); return;
                            }
                            item.value = bingo.toStr(newValue);
                            changeValue();
                        }, false, $this.domnode);
                    });
                    var changeValue = function () {
                        var allValue = nodeValue;
                        bingo.each(tagList, function (item) {
                            var text = item.text;
                            var value = item.value;
                            allValue = allValue.replace(text, value);
                        });
                        $this.node.nodeValue = allValue;
                    };
                    var _dispose = function () {
                        bingo.each(tagList, function (item) {
                            item.context && item.context.dispose();
                        });
                        tagList = null;
                    };

                    this.onDispose(function () {
                        _dispose();
                    });
                }
            },
            _isRemvoe: function () {
                return !this.node || !this.node.parentNode || !this.node.parentNode.parentNode || !this.node.parentNode.parentElement;
            },
            _remove: function () {
                if (this.isDisposed) return;
                //处理text node
                if (this.node.nodeType == 3) {
                    var pObj = this.domnode || this.view;
                    if (pObj && !pObj.isDisposed) {
                        pObj.textList && (pObj.textList = bingo.removeArrayItem(this, pObj.textList));
                    }
                }
                this.dispose();
            },
            getWithData: function () {
                return this.__withData__ || (this.domnode ? this.domnode.getWithData() : null);
            }
        });

        this.Initialization(function (view, domnode, node, attrName, attrValue, withData) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="domnode">属性名称</param>
            /// <param name="attrName">属性名称</param>
            /// <param name="attrValue">属性名称</param>
            /// <param name="command">指令定义</param>
            //console.log('textTag', node.nodeType);

            this.view = view;
            this.domnode = domnode;
            this.node = node;
            this.__withData__ = withData;

            if (domnode)
                domnode.textList.push(this);
            else
                view.$textList.push(this);


            this.attrName = attrName.toLowerCase();
            //this._filter = _filter.createFilterObject(view, domnode, domnode.node, attrValue);
            //this.attrValue = _filter.removerFilterString(attrValue);
            this.attrValue = attrValue;


            this.onDispose(function () {

                _compiles._removeCompileTextTag(this.node);
                //console.log('dispose textTag:' + this.attrName);
            });
        });
    });

    //绑定内容解释器==========================
    var _bindContextClass = bingo.mvc.bindContextClass = bingo.Class(function () {

        var _priS = {
            _cacheName: '__contextFun__',
            resetContextFun: function (attr) {
                attr[_priS._cacheName] = {};
            },
            evalScriptContextFun: function (attr) {
                return _priS.getScriptContextFun(attr, false, 'eval');
            },
            getScriptContextFun: function (attr, hasReturn, cacheName) {
                cacheName || (cacheName = 'context');

                var contextCache = attr[_priS._cacheName];
                if (contextCache[cacheName]) return contextCache[cacheName];

                var attrValue = attr.$prop();
                hasReturn = (hasReturn !== false);
                try {
                    var retScript = [hasReturn ? 'return ' : '', attrValue, ';'].join('');
                    return attr[cacheName] = (new Function('$view', '$node', '$withData', 'event', ' return (function(){ try{ with($view){ if (!$withData) {' + retScript + '} else { with($withData){' + retScript + '} } }}catch(e){if (bingo.isDebug) console.error(e.message);}}).call($node)'));
                } catch (e) {
                    if (bingo.isDebug)
                        console.error(e.message);
                    return attr[cacheName] = function () { return attrValue; };
                }
            }
        };

        //this.Property({
        //    attrValue: '',
        //    node: null,
        //    view: null,
        //    withData: null,
        //    _filter: null
        //});

        this.Define({
            //属性原值
            $prop: function (p) {
                if (arguments.length == 0)
                    return this.attrValue;
                else {
                    this.attrValue = p;
                    _priS.resetContextFun(this);
                    return this;
                }
            },
            //执行内容, 不会报出错误
            $eval: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return _priS.evalScriptContextFun(this)(view || this.view, this.node, this.withData, event);
            },
            //执行内容, 并返回结果, 不会报出错误
            $context: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                var res = _priS.getScriptContextFun(this)(view || this.view, this.node, this.withData, event);
                return this.$filter(res);
            },
            //返回withData/$view/window属性值
            $value: function (value) {
                var name = this.attrValue;
                var tname = name, tobj = this.withData;
                var val;
                if (tobj) {
                    val = bingo.datavalue(tobj, tname);
                }
                if (bingo.isUndefined(val)) {
                    tobj = this.view;
                    val = bingo.datavalue(tobj, tname);
                }
                if (bingo.isUndefined(val)) {
                    tobj = window;
                    val = bingo.datavalue(tobj, tname);
                }

                if (arguments.length > 0) {
                    if (bingo.isVariable(val))
                        val(value);
                    else if (bingo.isUndefined(val))
                        bingo.datavalue(this.withData || this.view, tname, value);
                    else
                        bingo.datavalue(tobj, tname, value);
                    return this;
                } else {
                    return this.$filter(val);
                }

            },
            $filter: function (val, withData) {
                return this._filter.filter(val, withData);
            }
        });

        this.Initialization(function (view, node, attrValue, withData, domnode, attr) {
            /// <param name="view"></param>
            /// <param name="node"></param>
            /// <param name="attrValue"></param>
            /// <param name="withData可选</param>
            /// <param name="domnode">可选</param>
            /// <param name="attr">可选</param>

            _priS.resetContextFun(this);

            this.view = view;
            this.node = node;
            
            this.withData = withData;
            var $filter = bingo.inject('$filter', view, domnode, attr, node, { withData: withData });
            this._filter = $filter(attrValue, this.withData);
            this.attrValue = this._filter.context;

        });
    });


    //绑定内容解释器, var bind = $bindContext('user.id == "1"', document.body); var val = bind.getContext();
    bingo.factory('$bindContext', ['$view', '$domnode', '$attr', '$withData', function ($view, $domnode, $attr, $withData) {
        //$domnode, $attr, $withData为可选
        return function (bindText, node, withData) {
            //node, withData可选
            node || (node = $domnode && $domnode.node);
            withData || (withData = $withData);
            return _bindContextClass.NewObject($view, node, bindText, withData, $domnode, $attr);
        };
    }]);


    //node绑定内容解释器==========================
    var _nodeContextClass = bingo.mvc.bindContextClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Define({
            $getAttr: function (name) {
                var attr = this._attrs[name];
                if (bingo.isUndefined(attr)) {
                    var attrTemp = this.node.attributes[name];
                    attr = this._attrs[name] = attrTemp
                        ? bingo.inject('$bindContext', this.view, this.domnode, null, this.node)(attrTemp.nodeValue, this.node, this.withData)
                        : null;
                }
                return attr;
            },
            $prop: function (name, p) {
                if (arguments.length == 1) {
                    var attr = this.node.attributes[name];
                    return attr ? this.$getAttr(name).$prop() : '';
                } else {
                    var attr = this.$getAttr(name);
                    attr && attr.$prop(p);
                    return this;
                }
            },
            //执行内容, 不会报出错误
            $eval: function (name, event, view) {
                var attr = this.$getAttr(name);
                return attr && attr.$eval(event, view);
            },
            //执行内容, 并返回结果, 不会报出错误
            $context: function (name, event, view) {
                var attr = this.$getAttr(name);
                return attr && attr.$context(event, view);
            },
            //返回withData/$view/window属性值
            $value: function (name, value) {
                var attr = this.$getAttr(name);
                if (!attr) return;
                if (arguments.length == 1)
                    return attr.$value();
                else
                    return attr.$value(value);
            }
        });

        this.Initialization(function (view, node, withData, domnode) {
            /// <param name="view"></param>
            /// <param name="node"></param>
            /// <param name="withData可选</param>
            /// <param name="domnode">可选</param>
            this.base();
            this.view = view;
            this.node = node;
            this.domnode = domnode;
            if (this.node.nodeType == 1) {
                this.linkToDom(this.node);
            }
            this.withData = withData;
            this._attrs = {};
            this.onDispose(function () {
                var attrs = this._attrs;
                for (var n in attrs) {
                    if (attrs.hasOwnProperty(n) && attrs[n].dispose)
                        attrs[n].dispose();
                }
            });
        });
    });

    //绑定属性解释器
    bingo.factory('$nodeContext', ['$view', '$domnode', '$withData', function ($view, $domnode, $withData) {
        //$domnode, $attr, $withData为可选
        return function (node, withData) {
            //node, withData可选
            node || (node = $domnode && $domnode.node);
            withData || (withData = $withData);
            return _nodeContextClass.NewObject($view, node, withData, $domnode);
        };
    }]);

    //启动
    $(function () {
        //等待动态加载js完成后开始
        bingo.using(function () {
            bingo.start();
        });
    });

})(bingo);