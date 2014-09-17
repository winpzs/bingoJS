bingo.command('bg-model', function () {

    return ['$view', '$node', '$attr', '$subscribe', function ($view, $node, $attr, $subscribe) {

        var _isRadio = $node.is(":radio");
        var _isCheckbox = $node.is(":checkbox");
        _isCheckbox && $node.data("checkbox_value_02", $node.val());

        var _emptyString = function (val) {
            return bingo.isNullEmpty(val) ? '' : val;
        }, _getElementValue = function () {
            var jT = $node;
            return _isCheckbox ? (jT.prop("checked") ? jT.data("checkbox_value_02") : pxj.stringEmpty) : jT.val();
        }, _setElementValue = function (value) {
            var jo = $node;
            value = _emptyString(value);
            if (_oldValue == value) return;
            _oldValue = value;
            if (_isCheckbox) {
                jo.data("checkbox_value_02", value);
                jo.prop("checked", (jo.val() == value));
            } else if (_isRadio) {
                jo.prop("checked", (jo.val() == value));
            } else
                jo.val(value);

        };
        var _oldValue = null;
        _setElementValue($attr.$datavalue());
        //console.log($attr.$datavalue());

        if (_isRadio) {
            $node.click(function () {
                var value = _getElementValue();
                $attr.$datavalue(value);
                $view.$update();
            });
        } else {
            $node.on('change', function () {
                var value = _getElementValue();
                $attr.$datavalue(value);
                $view.$update();
            });
        }


        $subscribe(function () { return $attr.$datavalue(); }, function (newValue) {
            _setElementValue(newValue);
        });

    }];

});
