
(function (bingo) {
    'use strict';

    bingo.route({
        regx: /.+/i,
        tmplId: '',
        tmplUrl: '',
        script: '',
        module: '',
        controller: '',
        isDefault:false,
        fn: function (url) {
            if (bingo.isNullEmpty(url)) return;
            var nameList = url.split('/');
            this.controller = nameList.pop();
            this.module = nameList.pop();
            var t = nameList.join('/');
            this.tmplUrl = [t, 'view', this.module, (this.controller + '.html')].join('/');
            this.tmplUrl = bingo.getRelativeFile(this.tmplUrl);
            this.script = [t, 'controller', (this.module + '.js')].join('/');
            this.script = bingo.getRelativeFile(this.script);
        }
    });

    //$modal
    var _modalClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Static({
            setModal: function (node, modal) {
                $(node).data('_modal_0916', modal).attr('_modal_0916_tt', "T");;
            },
            getModal: function (node) {
                return $(node).closest('[_modal_0916_tt]').data('_modal_0916');
            }
        });

        this.Variable({
            url: '',
            node: null,
            _tmpl: null,
            _modalNode: null,
            param:null
        });

        this.Define({
            show: function () {
                var url = this.url(), node = this.node(), $tmpl = this._tmpl();
                var router = bingo.route(url);
                if (router && router.tmplUrl) {
                    var $this = this;
                    $tmpl.formUrl(router.tmplUrl).appendTo(document.body).compile(function ($node) {
                        $this.linkToDom($node);
                        $this._modalNode = $node;
                        _modalClass.setModal($node, $this);
                        $node.modal('show').on('shown.bs.modal', function(){
                            setTimeout(function () {
                                if ($this.isDisposed) return;
                                $this.trigger('show');
                            }, 100);
                        }).on('hidden.bs.modal', function () {
                            try{
                                $this.trigger('close');
                            } finally {
                                setTimeout(function () { $node.remove(); });
                            }
                        });;
                    });
                }
                return this;
            },
            close: function () {
                if (arguments.length > 0)
                    this.send.apply(this, arguments);
                this._modalNode.modal('hide');
                return this;
            },
            receive: function (callback) {
                return this.on('receive', callback);
            },
            send: function () {
                return this.trigger('receive', arguments);
            }
        });

        this.Initialization(function ($tmpl, node) {
            this.base();
            this.node(node)._tmpl($tmpl);
        });

    });

    bingo.factory('$modal', function ($tmpl, node) {
        return function (url) {
            if (arguments.length == 0) {
                return _modalClass.getModal(node);
            } else {
                return _modalClass.NewObject($tmpl, node).url(url);
            }
        };
    });



})(bingo);


(function (bingo) {
    'use strict';
    var isIE8 = false;
    var isIE9 = false;
    isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
    isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);

    window.handleFixInputPlaceholderForIE = function () {
        //fix html5 placeholder attribute for ie7 & ie8
        if (isIE8 || isIE9) { // ie7&ie8
            // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
            jQuery('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {

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