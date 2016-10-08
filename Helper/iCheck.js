;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * iCheck Helper plugin
     */
    var iCheck = function (checkboxes, dependent) {

        var $checkboxes = $.getElement(checkboxes);
        var $dependent = $.getElement(dependent);

        this.handleEvent = function (callback) {
            $dependent.on('ifUnchecked', function () {
                $checkboxes.iCheck("uncheck");
            });
            $dependent.on('ifChecked', function () {
                $checkboxes.iCheck("check");
            });
            $checkboxes.on('ifUnchecked', function () {
                if (typeof callback === 'function') {
                    callback($checkboxes, $dependent);
                }
            });
            $checkboxes.on('ifChecked', function () {
                if (typeof callback === 'function') {
                    callback($checkboxes, $dependent);
                }
            });
        }
    }
    
    Nth.Helper.iCheck = iCheck;
    
    return iCheck;
});