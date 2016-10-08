;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Json Helper plugin
     */
    var Json = function (v) {

        var value = v;

        this.getValue = function (collection) {
            if (collection) {
                if (typeof collection === 'string') {
                    collection = collection.split(' ');
                }
                if (collection.length === 1) {
                    return value[collection[0]];
                }
                var r = {}
                for (var i in collection) {
                    r[collection[i]] = value[collection[i]];
                }
                return r;
            }
            return value;
        }

        this.setValue = function (v) {
            value = v;
            return this;
        }

        this.filter = function (option) {
            option = $.extend({}, {
                removeNull: true,
                removeUndefined: true,
                removeEmptyString: true,
                removeFalse: true
            }, option);

            if (!value || !$.isPlainObject(value)) {
                value = {}
                return this;
            }
            for (var i in value) {
                if (option.removeNull) {
                    if (value[i] === null) {
                        delete value[i];
                    } else if (typeof value[i] == 'object') {
                        if ($.isEmptyObject(value[i])) {
                            delete value[i];
                        }
                    }
                }
                if (option.removeUndefined) {
                    if (typeof value[i] === 'undefined') {
                        delete value[i];
                    }
                }
                if (option.removeEmptyString) {
                    if (value[i] === "") {
                        delete value[i];
                    }
                }
                if (option.removeFalse) {
                    if (value[i] === false) {
                        delete value[i];
                    }
                }
            }
            return this;
        }

        this.existsEmptyElement = function () {
            return this.count() > this.clone().filter().count();
        }

        this.count = function () {
            var len = 0;
            if (value && $.isPlainObject(value)) {
                for (var i in value) {
                    len++;
                }
            }
            return len;
        }
        
        this.isEmpty = function() {
            return this.count() === 0;
        }

        this.clone = function () {
            return new Nth.Helper.Json($.extend({}, value));
        }

    }
    
    Nth.Helper.Json = Json;
    
    return Json;
});