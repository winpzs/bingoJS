
(function () {
    'use strict';

    var _miniTableClass = bingo.Class(bingo.linkToDom.LinkToDomClass, function () {

        this.Variable({
            column: null,
            datas: null,
            tmpl: 'plugins/miniTable/tmpl',
            $node: null, _$tmpl: null
        });

        this.Define({
            layout: function () {
                var $tmpl = this._$tmpl(),
                    url = this.tmpl(),
                    $node = this.$node();
                $tmpl.fromUrl(url).appendTo($node).controller(function ($view) {
                    $view.on('ready', function () {
                        $node.css('visibility', 'visible');
                    });
                }).compile();
            }
        });

        this.Initialization(function ($node, $tmpl) {
            this.base();
            this.linkToDom($node);
            this.$node($node)._$tmpl($tmpl);
        });
    });
    

    //var _conntroller = function ($view, $node) {
        
    //    $view.on('ready', function () {
    //        $node.css('visibility', 'visible');
    //    });
    //};

    bingo.command('miniTable', function () {
        return {
            //外部模板
            tmplUrl: 'plugins/miniTable/tmpl',
            //是否替换节点, 默认为false
            replace: true,
            compilePre: function ($view, $node, $nodeContext) {
                $view.__oldNode = $node;
            },
            link: ['$view', '$tmpl', '$node', '$nodeContext', function ($view, $tmpl, $node, $nodeContext) {
                var $oldNode = $view.__oldNode;
                $oldNode.find('column').each(function () {
                    var nodeC = $nodeContext(this);
                    console.log(nodeC.$prop('name'), nodeC.$prop('text'), nodeC.$context('formatter'));
                });
                _miniTableClass.NewObject($node, $tmpl).layout();
                //$view._miniTableController = _conntroller;
            }]
        };
    });

})();
