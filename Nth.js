;(function(factory) {
    
    'use strict';
    
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'moment'], factory);
    } else {
        factory(jQuery, moment);
    }
})(function($, moment) {
    
    /**
     * Extend jQuery
     */
    $.extend({
        getElement: function (e) {
            if (typeof e === 'string' || e instanceof window.Element) {
                return $(e);
            } else if (e instanceof $) {
                return e;
            } else {
                return $();
            }
        }
    });

    $.fn.scrollbarWidth = function () {
        var e = $.getElement(this);
        if (!e.length) {
            return 0;
        }
        var $div = $('<div/>', {id: 'nth_check_scrollbar_width'}).css({
            float: 'left',
            width: '100%'
        });
        e.append($div);
        var scrollbarWidth = e.width() - $div.width();
        $div.remove();
        return scrollbarWidth;
    }
    
    if (typeof console === 'undefined') {
        console = {
            log: function() {},
            warn: function() {}
        }
    }
    
    //Extend moment js
    moment.fn.isToday = function () {
        var dt = new Date();
        return this.year() === dt.getFullYear() && this.date() === dt.getDate();
    }

    /**
     * Nth object
     * Contains Nth plugins
     */
    var Nth = {}

    /**
     * Namespace mapping
     */
    Nth.Dom = {}
    Nth.File = {}
    Nth.Filter = function () {}
    Nth.Filter.Word = {}
    Nth.FormBuilder = {}
    Nth.FormBuilder.Element = {}
    Nth.Helper = {}
    Nth.Validator = function () {}

    ;(function(Nth) {

        'use strict';

        Nth.Nth = function() {
            /**
             * @method versionCompare
             * returns -1 if the first version is lower than the second, 
             * 0 if they are equal, and 1 if the second is lower.
             */
           this.versionCompare = function(v1, v2) {
               var r = 0;
               v1 = (v1 + '').split('.');
               v2 = (v2 + '').split('.');
               for (var i = 0; i < v1.length; i++) {
                   var v1i = Number(v1[i]||0);
                   var v2i = Number(v2[i]||0);
                   if (v1i > v2i) {
                       r = 1;
                       break;
                   } else if (v1i === v2i) {
                       r = 0;
                   } else {
                       r = -1;
                       break;
                   }
               }
               return r;
           }
        }

    })(Nth);
    
    window.Nth = Nth;
    
    return Nth;
});



