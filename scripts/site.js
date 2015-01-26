
//site.js 主要是为整个项目定义全局内容


//document.body controller ======================================================
(function (bingo) {
    'use strict';
    
    //document.body controller
    window.bodyController = function ($view) {

        var $location = bingo.location($(document.body).find('div[bg-frame-name="main"]'));
        var pageContenT = $('#page-content');
        $location.onChange(function () {
            pageContenT.showLoading();
        });
        $location.onLoaded(function () {
            pageContenT.hideLoading();
        });

    };

})(bingo);

//end document.body controller ======================================================

//定义 jQuery 扩展======================================================
(function (bingo, $) {
    'use strict';

    $.fn.extend({
        showLoading: function (opacity) {
            return this.each(function () {
                $(this).block({
                    message: '<img src="../bootstrap/js/blockUI/busy.gif" />',
                    css: { backgroundColor: '', color: '', border: '0px', cursor: 'pointer' },
                    overlayCSS: { backgroundColor: '#FFF', opacity: bingo.isNumeric(opacity) ? opacity : 1, cursor: 'pointer' }, fadeIn: 0, fadeOut: 0
                });
            });
        },
        hideLoading: function () {
            return this.each(function () {
                $(this).unblock();
            });
        }
    });

})(bingo, jQuery);

//end jQuery 扩展======================================================


//常用方法 ======================================================
(function (bingo) {
    'use strict';
    var isIE8 = false;
    var isIE9 = false;
    isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
    isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);

    window.handleFixInputPlaceholderForIE = function (view) {
        //fix html5 placeholder attribute for ie7 & ie8
        if (isIE8 || isIE9) { // ie7&ie8
            var jo = jQuery(view && view.node || document.documentElement);
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            jo.find('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {

                var input = jQuery(this);

                if (input.val() == '' && input.attr("placeholder") != '') {
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }

                input.focus(function () {
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });

                input.blur(function () {
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.val(input.attr('placeholder'));
                    }
                });
            });
        }
    };

})(bingo);

//end 常用方法 ======================================================


//定义 $dialog======================================================
(function (bingo) {
    'use strict';

    //定义_dialogClass, 继承 bingo.linkToDom.LinkToDomClass 类
    var _dialogClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        //定义静态方法
        this.Static({
            setDialog: function (node, modal) {
                $(node).data('_modal_0916', modal).attr('_modal_0916_tt', "T");;
            },
            getDialog: function (node) {
                return $(node).closest('[_modal_0916_tt]').data('_modal_0916');
            }
        });

        //定义增强属性, 支持链式, 如:this.url('/aaa.html').node(document.body).param({})
        this.Variable({
            url: '',
            node: null,
            _tmpl: null,
            _modalNode: null,
            param: null
        });

        //定义属性
        //this.Property({ name:'modal' });

        //定义方法(最好只用于定义方法, 如果要定义属性, 可以用Variable或Property, 它们会处理分离)
        this.Define({
            __showLoading: function () {
                var mBody = this._modalNode.find('.modal-body');
                if (mBody.size() > 0) mBody.css('visibility', 'hidden');
            },
            showLoading: function () {
                var mBody = this._modalNode.find('.modal-body');
                mBody.showLoading();
                return this;
            },
            hideLoading: function () {
                //return;
                var mBody = this._modalNode.find('.modal-body');
                if (mBody.size() > 0) {
                    mBody.hideLoading();
                    mBody.css('visibility', 'visible');
                }
                return this;
            },
            //显示modal
            show: function () {
                var url = this.url(), node = this.node(), $tmpl = this._tmpl();
                if (url) {
                    var $this = this, viewNode = $(node);
                    viewNode.showLoading(0.1);
                    //通过$tmpl的fromUrl加载模板内容, 插入到document.body,  编译
                    $tmpl.fromUrl(url).appendTo(document.body).controller(function ($view, $node) {

                        //将modal连接到node, 如果node删除了, modal会自动消毁, 调用dispose方法和发送onDispose事件
                        $this.linkToDom($node);
                        //modal已经连接到node, 所以可以放心循环引用
                        $this._modalNode = $node;
                        _dialogClass.setDialog($node, $this);


                        $this.__showLoading();
                        $view.on('ready', function () {
                            if ($view.isDisposed) return;
                            viewNode.hideLoading();

                            //console.log('ready');
                            $node.on('show.bs.modal', function () {
                                //$this.showLoading && $this.showLoading();
                                setTimeout(function () { $this.showLoading && $this.showLoading(); },200);
                            }).on('shown.bs.modal', function () {
                                setTimeout(function () {
                                    if ($view.isDisposed) return;
                                    //modal显示完成后, 发送show事件
                                    $this.trigger('show').end('show');
                                    $view.$update();
                                }, 100);
                            }).on('hidden.bs.modal', function () {
                                try {
                                    //modal隐藏完成后, 发送close事件
                                    $this.trigger('close');
                                } finally {
                                    //删除$node, 并modal自动消毁
                                    setTimeout(function () { $node.remove(); });
                                }
                            }).modal('show');
                        });

                    }).compile();
                }
                return this;
            },
            //关闭modal, 并可以发送返回数据, 如: close(true)
            close: function () {
                if (arguments.length > 0) {
                    var args = bingo.sliceArray(arguments, 0);
                    this.on('close', function () {
                        this.send.apply(this, args);
                    });
                }

                this._modalNode.modal('hide');
                return this;
            },
            //定义receive事件, 即用于接收返回数据
            receive: function (callback) {
                return this.on('receive', callback);
            },
            //放送receive事件, 你如果发送任何参数, 即用于发送返回数据
            send: function () {
                return this.trigger('receive', arguments);
            }
        });

        //定义初始方法
        this.Initialization(function ($tmpl, node) {
            this.base();//执行父类, 初始方法

            this.node(node)._tmpl($tmpl);
        });

    });

    //定义$dialog
    bingo.factory('$dialog', function ($tmpl, node) {
        return function (url) {
            if (arguments.length == 0) {
                //如果没有参数返回modal对象
                return _dialogClass.getDialog(node);
            } else {
                //如果传入url, 新建一个modal对象
                return _dialogClass.NewObject($tmpl, node).url(url);
            }
        };
    });



})(bingo);

//end $dialog======================================================
