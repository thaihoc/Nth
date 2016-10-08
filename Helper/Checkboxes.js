;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Checkbox Helper plugin
     */
    var Checkboxes = function (checkboxes, dependent) {

        var inst = this;
        var $checkboxes = $.getElement(checkboxes);
        var $dependent = $.getElement(dependent);

        this.handleEvent = function (callback) {
            $dependent.on('click', function () {
                if ($(this).is(':checked')) {
                    inst.check();
                } else {
                    inst.uncheck();
                }
                if (typeof callback === 'function') {
                    callback($checkboxes, $dependent);
                }
            });
            $checkboxes.each(function () {
                $(this).click(function () {
                    if (inst.isChecked()) {
                        $dependent.prop('checked', true);
                        $dependent.attr('checked', 'checked');
                    } else {
                        $dependent.prop('checked', false);
                        $dependent.removeAttr('checked');
                    }
                    if (typeof callback === 'function') {
                        callback($checkboxes, $dependent);
                    }
                });
            });
        }

        this.isChecked = function () {
            if (!$checkboxes.length) {
                return false;
            }
            var checked = true;
            $checkboxes.each(function () {
                if ($(this).is(':checked')) {
                    checked = false;
                    return false;
                }
            });
            return checked;
        }

        this.check = function () {
            $checkboxes.each(function () {
                $(this).prop('checked', true);
                $(this).attr('checked', 'checked');
            });
        }

        this.uncheck = function () {
            $checkboxes.each(function () {
                $(this).prop('checked', false);
                $(this).removeAttr('checked');
            });
        }
    }
    
    Nth.Helper.Checkboxes = Checkboxes;

    return Checkboxes;
});