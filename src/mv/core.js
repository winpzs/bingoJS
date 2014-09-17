
; (function (bingo) {
    //version 1.0.1
    "use strict";

    var _factory = {}, _service = {}, _command = {}, _filter = {}, _module = {};
    var _rootView = null;

    var _injectNoop = function () { };
    _injectNoop.$injects = [];

    var _makeInjectAttrRegx = /^\s*function[^(]*?\(([^)]+?)\)/i,
    _makeInjectAttrs = function (p) {
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
        };
        return fn;
    },
    _inject = function (p, view, domnode, attr, node, para, injectObj) {

        injectObj = injectObj || {};
        var fn = null;
        if (bingo.isString(p)) {
            //如果是字串
            if (p in injectObj) {
                //如果已经存在
                return injectObj[p];
            }
            injectObj[p] = {};
            fn = bingo.factory(p);
            (!bingo.isFunction(fn)) && (fn = bingo.service(p));
            if (!fn) return {};
        } else
            fn = p;

        var $injects = fn.$injects;
        var injectParams = [];
        if ($injects && $injects.length > 0) {
            if (!injectObj.$view) {
                injectObj.$view = view || bingo.rootView();
                injectObj.$module = injectObj.$view._module;
                injectObj.$domnode = domnode;
                injectObj.node = node ? node : (domnode ? domnode.node : view.node);
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
        //模块
        module: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            var module = null;
            if (arguments.length == 1)
                module = _module[name];
            if (!module) {
                module = _module[name] = function (view) {
                    var obj = _moduleClass.NewObject();
                    obj.disposeByOther(view);
                    bingo.extend(obj._controllers, module._controllers);
                    view._module = obj;
                    _inject(module._injectFn, view);
                    return obj;
                };
                module._injectFn = _makeInjectAttrs(fn);
                module._controllers = {};
                module.controller = function (name, fn) {
                    if (arguments.length == 1)
                        return this._controllers[name];
                    this._controllers[name] = _makeInjectAttrs(fn);
                    return this;
                }
            }
            return module;

        },
        //业务服务
        service: function (name, fn) {
            if (this.isNullEmpty(name)) return null;
            if (arguments.length == 1)
                return _service[name];
            else
                _service[name] = _makeInjectAttrs(fn);
        },
        inject: function (p, view, domnode, attr, node, para) {
            return _inject(p, view, domnode, attr, node, para);
        },
        start: function () {
            var node = document.documentElement;
            _rootView = _viewClass.NewObject(node);
            //_compiles.setCompileNode(node);
            _templateClass.NewObject().formNode(node).compile();
            //_compiles.traverseNodes({ node: node, parentDomnode: null, view: _rootView });
        },
        rootView: function () { return _rootView; }
    });

    var _moduleClass = bingo.Class(function () {
        this.Property({
            _controllers: {}
        });

        this.Define({
            controller: function (name, fn) {
                if (arguments.length == 1)
                    return this._controllers[name];
                this._controllers[name] = _makeInjectAttrs(fn);
                return this;
            }
        });
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
        isDomnode: function (node) {
            return node[this.domNodeName] == "1";
        },
        _textTagRegex: /\{\{([^}]+?)\}\}/gi,
        hasTextTag: function (text) {
            this._textTagRegex.lastIndex = 0;
            return this._textTagRegex.test(text);
        },
        _isCompileTextTag: function (node) {
            var list = node.parentNode._isCompileTextTags_;
            if (!list) return false;
            return bingo.inArray(node, list) >= 0;
        },
        _setCompileTextTag: function (node) {
            var list = node.parentNode._isCompileTextTags_ || (node.parentNode._isCompileTextTags_ = []);
            list.push(node);
        },
        _removeCompileTextTag: function (node) {
            var list = node.parentNode._isCompileTextTags_;
            list && (node.parentNode._isCompileTextTags_ = bingo.removeArrayItem(node, list));
        },
        _makeCommand: function (command, view, node) {
            command = _inject(command, view, null, null, node);
            var opt = {
                priority: 50,
                tmpl: '',
                tmplUrl: '',
                replace: false,
                include: false,
                view: false,
                compileChild: true
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
            _inject(opt.compilePre, view, null, null, node);

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

                };

                var next = null, pDomnode = p.parentDomnode, pView = p.view, withData = p.withData;
                if (node = node.firstChild) {
                    do {
                        p.node = node;
                        this.traverseNodes(p);
                        p.parentDomnode = pDomnode, p.view = pView, p.withData = withData;
                        next = node.nextSibling;
                    } while (node = next);
                }
            } else if (node.nodeType === 3) {
                if (!this._isCompileTextTag(node)) {
                    this._setCompileTextTag(node);

                    //收集textNode
                    var text = node.nodeValue;
                    //console.log('_setCompileTextTag', text);
                    if (_compiles.hasTextTag(text)) {
                        //console.warn('_compiles.hasTextTag====>', text);
                        _textTagClass.NewObject(p.view, p.parentDomnode, node, node.nodeName, text);
                    }
                }
            }
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
            var tmpl = null, replace = false, include = false, isNewView = false;
            if (command) {
                //node
                command = _compiles._makeCommand(command, p.view, node);
                replace = command.replace;
                include = command.include;
                tmpl = command.tmpl;
                isNewView = command.view;
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

                            command = bingo.command(aName);
                            if (command) {
                                command = _compiles._makeCommand(command, p.view, node);
                                replace = command.replace;
                                include = command.include;
                                tmpl = command.tmpl;
                                if (replace || include) break;
                                isNewView || (isNewView = command.view);
                                (!compileChild) || (compileChild = command.compileChild);
                                attrList.push({ aName: aName, aVal: aVal, type: 'attr', command: command });
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
            if (attrList.length > 0) {

                //替换 或 include
                if (replace || include) {
                    var jNode = $(node);

                    if (!bingo.isNullEmpty(tmpl)) {
                        var jNewNode = $(['<div>', tmpl, '</div>'].join(''));
                        //include
                        if (include && tmpl.indexOf('bg-include') >= 0) {
                            jNewNode.find('[bg-include]').each(function () { $(this).append(jNode.clone()); });
                        }
                        var pView = p.view;
                        jNewNode.children().each(function () {
                            $(this).insertBefore(jNode);
                            //新view
                            isNewView && (p.view = _viewClass.NewObject(this, pView));
                            p.node = this;
                            _compiles.traverseNodes(p);
                        });
                    }
                    jNode.remove();

                    //不编译子级
                    compileChild = false;
                } else {

                    if (!bingo.isNullEmpty(tmpl))
                        $(node).html(tmpl);

                    //新view
                    isNewView && (p.view = _viewClass.NewObject(node, p.view));

                    var parentDomnode = p.parentDomnode;
                    var domnode = _domnodeClass.NewObject(p.view, node, isNewView ? null : parentDomnode, p.withData);
                    p.parentDomnode = domnode;
                    this.setDomnode(node, domnode);
                    //console.log('p.withData', p.withData);
                    isNewView && (p.withData = null);

                    //处理attrList
                    var attrItem = null;
                    bingo.each(attrList, function () {
                        //如果新view特性的command, inject时是上级view
                        attrItem = _domnodeAttrClass.NewObject(p.view, domnode, this.type, this.aName, this.aVal, this.command);
                    });
                }
            }

            if (!replace && !include && textTagList.length > 0) {
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

    var _templateClass = bingo.Class(function () {

        var _comp = function (node, parentDomnode, view, withData) {
            _compiles.traverseNodes({ node: node, parentDomnode: parentDomnode, view: view, withData: withData });
        };

        this.Define({
            formNode: function (node) { return this.formJquery(node); },
            formHtml: function (html) { return this.formJquery(html); },
            formUrl: function (url) { this._url = bingo.path(url); return this; },
            formId: function (id) { return this.formJquery($('#' + id)); },
            formJquery: function (jqSelector) { this._jo = $(jqSelector); return this; },
            withData: function (data) { this._withData = data; return this; },
            appendTo: function (node) { this._parentNode = $(node)[0]; return this; },
            compile: function (callback) {
                try{
                    //取得父node
                    var parentNode = this._parentNode;
                    var parentDomnode = parentNode ? _compiles.getDomnode(parentNode) : null;
                    var view = this._view;
                    var withData = this._withData;

                    //_compile
                    if (this._jo) {
                        if (!parentNode) {
                            if (this._jo.size() > 0) {
                                parentDomnode = _compiles.getDomnode(this._jo[0]);
                            } else
                                return this;
                        }
                        view || (view = parentDomnode ? parentDomnode.view : _rootView);
                        this._jo.each(function () {
                            _comp(this, parentDomnode, view, withData);
                        });
                        view._compile();
                        parentNode && (this._jo.appendTo(parentNode));
                        view._controller();
                        view._link();
                        callback && callback(this._jo);
                    } else if (parentNode && this._url) {
                        view || (view = parentDomnode ? parentDomnode.view : _rootView);
                        var url = this._url;
                        var ajax = bingo.inject('$ajax', view)(url).dataType('text').success(function (rs) {
                            var jo = $(rs);
                            jo.each(function () {
                                _comp(this, parentDomnode, view, withData);
                            });
                            view._compile();
                            jo.appendTo(parentNode);
                            view._controller();
                            view._link();
                            callback && callback(jo);
                        }).get();
                    }
                } finally {
                    this._jo = this._url = this._parentNode = this._view = this._data = null;
                    return this;
                }
            }
        });

        this.Initialization(function (view) {
            this._view = view;
        });

    });

    bingo.factory('$tmpl', ['$view', function ($view) {
        if ($view.__tmpl__) return $view.__tmpl__;
        var tmpl = _templateClass.NewObject($view);
        $view.__tmpl__ = tmpl;
        tmpl.disposeByOther($view);
        return tmpl;
    }]);

    var _viewClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Property({
            node: null,
            parentView: null,
            domnodeList: [],
            textList: [],
            children: [],
            _module: null,
            _controllerFn: null,
            _isControllerFn: false
        });

        this.Define({
            _setParent: function (view) {
                if (view) {
                    this.parentView = view;
                    view._addChild(this);
                }
            },
            _addDomnode: function (domnode) {
                this.domnodeList.push(domnode);
            },
            _removeDomnode: function (domnode) {
                var list = this.domnodeList;
                list = bingo.removeArrayItem(domnode, list);
                this.domnodeList = list;
            },
            _addChild: function (view) {
                this.children.push(view);
            },
            _removeChild: function (view) {
                var list = this.children;
                list = bingo.removeArrayItem(view, list);
                this.children = list;
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
                bingo.each(this.domnodeList, function () {
                    if (!this.isDisposed) {
                        this._compile();
                    }
                });
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._compile();
                    }
                });
            },
            _controller: function () {
                var controllerFn = this._controllerFn;
                if (controllerFn && this._isControllerFn != controllerFn) {
                    this._isControllerFn = controllerFn;

                    if (bingo.isString(controllerFn) && this._module) {
                        controllerFn = this._module.controller(controllerFn);
                    }
                    _inject(controllerFn, this);
                    var $this = this;
                    setTimeout(function () {
                        $this.trigger('ready');
                        $this.$update();
                    });
                }
                bingo.each(this.domnodeList, function () {
                    if (!this.isDisposed) {
                        this._controller();
                    }
                });
                bingo.each(this.children, function () {
                    if (!this.isDisposed) {
                        this._controller();
                    }
                });
            },
            _link: function () {
                bingo.each(this.domnodeList, function () {
                    if (!this.isDisposed) {
                        this._link();
                    }
                });
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
            setModule: function (moduleName) {
                this._module = bingo.module(moduleName)(this);
            },
            setController: function (controller) {
                this._controllerFn = controller;
            },
            $update: function () { return this.$publish(); },
            $publish: function () {
                this.$observer().publish(); return this;
            },
            $observer: function () {
                return this.__observer__ ? this.__observer__ : (this.__observer__ = _inject('$observer', this));
            },
            $subscribe: function (p, callback, deep, disposer) {
                this.$observer().subscribe(p, callback, deep, disposer);
            }
        });

        this.Initialization(function (node, parentView) {
            this.base();
            this.linkToDom(node);
            this.node = node;
            this.parentView = parentView;

            parentView && this._setParent(parentView);
            this.onDispose(function () {
                //console.log('dispose view');


                bingo.each(this.textList, function (item) {
                    if (item) item.dispose();
                });


                //处理父子
                var parentView = this.parentView;
                if (parentView && !parentView.isDisposed)
                    parentView._removeChild(this);

                this.children = this.domnodeList = this.textList = [];
            });

        });
    });

    var _domnodeClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Property({
            view: null,
            node: null,
            //jNode:null,
            parentDomnode: null,
            attrList: [],
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
                    this.attrList = this.attrList.sort(function (item1, item2) { return item1.priority == item2.priority ? 0 : (item1.priority > item2.priority ? -1 : 1) });
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

            this.onDispose(function () {

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

        })
    });

    var _domnodeAttrClass = bingo.Class(function () {

        this.Property({
            view: null,
            domnode: null,
            command: null,
            attrName: '',
            attrValue: '',
            type: '',
            _filter:null
        });

        var _priS = {
            evalScriptContextFun: function (attr) {
                return _priS.getScriptContextFun(attr, false, '__contextFun_eval');
            },
            getScriptContextFun: function (attr, hasReturn, cacheName) {
                cacheName || (cacheName = '__contextFun');
                if (attr[cacheName]) return attr[cacheName];
                hasReturn = (hasReturn !== false);
                var attrValue = attr.$getValue();
                try {
                    var data = attr.getWithData();
                    var retScript = !data ? [hasReturn ? 'return ' : '', attrValue, ';'].join('') : ['with($withData){ ', (hasReturn ? 'return ' : ''), attrValue, '; }'].join('');
                    return attr[cacheName] = (new Function('$view', '$node', '$withData', 'event', ' return (function(){ try{ with($view){' + retScript + ' }}catch(e){if (bingo.isDebug) console.error(e.message);return window.undefined;}}).call($node)'));
                } catch (e) {
                    if (bingo.isDebug)
                        console.error(e.message);
                    return attr[cacheName] = function ($view, $node, event) { return attrValue; };
                }
            }
        };


        this.Define({
            _compile: function () {
                var command = this.command;
                var compile = command.compile;
                if (compile) {
                    _inject(compile, this.view, this.domnode, this);
                }
            },
            _controller: function () {
                var command = this.command;
                var controller = command.controller;
                if (controller) {
                    _inject(controller, this.view, this.domnode, this);
                }
            },
            _link: function () {
                var command = this.command;
                var link = command.link;
                if (link) {
                    _inject(link, this.view, this.domnode, this);
                }
            },
            _makeCommand: function (command) {
                var opt = command;
                opt.compile = _makeInjectAttrs(opt.compile);
                opt.controller = _makeInjectAttrs(opt.controller);
                opt.link = _makeInjectAttrs(opt.link);
                this.command = command
            },
            getWithData: function () {
                return this.domnode.getWithData();
            },
            //属性原值
            $getValue: function () { return this.attrValue; },
            $setValue: function (value) { this.attrValue = value; },
            //执行内容, 不会报出错误
            $eval: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return _priS.evalScriptContextFun(this)(view || this.view, this.domnode.node, this.getWithData(), event);
            },
            //执行内容, 并返回结果, 不会报出错误
            $getContext: function (event, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="event">可选, 事件</param>
                /// <param name="view">可选, 默认本域</param>
                return _priS.getScriptContextFun(this)(view || this.view, this.domnode.node, this.getWithData(), event);
            },
            $datavalue: function (value) {
                var name = this.attrValue;
                var tname = name, tobj = this.getWithData();
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
                    if (bingo.isUndefined(val))
                        bingo.datavalue(this.getWithData() || this.view, tname, value);
                    else
                        bingo.datavalue(tobj, tname, value);
                    return this;
                } else {
                    return val;
                }

            },
            $filter: function (val) {
                return this._filter.filter(val);
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


            this.domnode = domnode;
            domnode.attrList.push(this);

            this.view = view;

            this.type = type;
            this.attrName = attrName.toLowerCase();

            var $filter = _inject('$filter', view, domnode, this);
            this._filter = $filter(attrValue, this.getWithData());
            this.attrValue = this._filter.context;

            this._makeCommand(command);
            //console.log('this._filter', this._filter);
            //this.onDispose(function () {
            //    console.log('dispose attr:' + this.attrName);
            //});
        })
    });

    var _textTagClass = bingo.Class(function () {

        this.Property({
            view: null,
            domnode: null,
            node: null,
            attrName: '',
            attrValue: '',
            _isLinked:false
        });

        var _priS = {
            getScriptContextFun: function (attr, attrValue) {
                var cacheName = ['__contextFun', attrValue].join('_');
                if (attr[cacheName]) return attr[cacheName];
                try {
                    var data = attr.getWithData();
                    var retScript = !data ? ['return ', attrValue, ';'].join('') : ['with($withData){ return ', attrValue, '; }'].join('');
                    return attr[cacheName] = (new Function('$view', '$node', '$withData', ' return (function(){ try{ with($view){' + retScript + ' }}catch(e){if (bingo.isDebug) console.error(e.message);return window.undefined;}}).call($node)'));
                } catch (e) {
                    if (bingo.isDebug)
                        console.error(e.message);
                    return attr[cacheName] = function ($view, $node, event) { return attrValue; };
                }
            }
        };


        this.Define({
            _link: function () {
                if (!this._isLinked) {
                    this._isLinked = true;

                    var nodeValue = this.attrValue;
                    var tagList = [];
                    var $this = this;

                    var s = this.node.nodeValue = nodeValue.replace(_compiles._textTagRegex, function (findText, textTagContain, findPos, allText) {
                        var item = { };
                        var flt = _inject('$filter', $this.view, $this.domnode, null, $this.node);
                        flt = flt(textTagContain, $this.getWithData());
                        textTagContain = flt.context;
                        item.text = findText, item.tag = textTagContain, item.flt = flt;
                        tagList.push(item);
                        var value = $this.$getContext(textTagContain);
                        return value ? flt.filter(value) : '';
                    });
                    bingo.each(tagList, function (item) {
                        var tag = item.tag, text = item.text, filter = this.flt;

                        $this.view.$subscribe(function () { return $this.$getContext(tag); }, function (newValue) {
                            var value = newValue ? filter.filter(newValue) : '';
                            $this.node.nodeValue = nodeValue.replace(text, value);
                        }, false, $this.domnode);
                    });
                };
            },
            getWithData: function () {
                return this.domnode ? this.domnode.getWithData() : null;
            },
            //执行内容, 并返回结果, 不会报出错误
            $getContext: function (tag, view) {
                /// <summary>
                /// 
                /// </summary>
                /// <param name="view">可选, 默认本域</param>
                return _priS.getScriptContextFun(this, tag)(view || this.view, this.node, this.getWithData());
            }
        });

        this.Initialization(function (view, domnode, node, attrName, attrValue) {
            /// <summary>
            /// 
            /// </summary>
            /// <param name="domnode">属性名称</param>
            /// <param name="attrName">属性名称</param>
            /// <param name="attrValue">属性名称</param>
            /// <param name="command">指令定义</param>

            this.view = view;
            this.domnode = domnode;
            this.node = node;

            if (domnode)
                domnode.textList.push(this);
            else
                view.textList.push(this);

            this.attrName = attrName.toLowerCase();
            //this._filter = _filter.createFilterObject(view, domnode, domnode.node, attrValue);
            //this.attrValue = _filter.removerFilterString(attrValue);
            this.attrValue = attrValue;


            this.onDispose(function () {
                _compiles._removeCompileTextTag(this.node);
                //console.log('dispose textTag:' + this.attrName);
            });
        })
    });

    $(function () {
        bingo.start();
    });



})(bingo);