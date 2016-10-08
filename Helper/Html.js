;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Html Helper plugin
     */
    var Html = function () {
        
    }
    
    Html.getOptions = function (data, name, value, selected, emptyOption) {
        if (!$.isArray(data)) {
            return emptyOption || '';
        }
        if (typeof value === 'undefined') {
            value = name;
        }
        var options = [];
        if (emptyOption) {
            if (typeof emptyOption === 'boolean') {
                emptyOption = $('<option/>', {
                    value: ''
                }).html('-- Chưa chọn --');
            } else if (~['string', 'number'].indexOf(typeof emptyOption)) {
                emptyOption = $('<option/>', {
                    value: ''
                }).html(emptyOption);
            } 
            options.push(emptyOption);
        }
        $.each(data, function (i, item) {
            if ($.isPlainObject(item)) {
                options.push($('<option/>', {
                    value: item[value],
                    selected: typeof selected != 'undefined' && item[value] == selected ? true : null
                }).html(item[name]));
            }
        });
        return options;
    }
    
    Nth.Helper.Html = Html;
    
    return Html;
});