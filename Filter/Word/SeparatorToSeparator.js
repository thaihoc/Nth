;(function (factory) {

    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function (Nth) {
    
    var SeparatorToSeparator = function (searchSeparator, replaceSeparator) {
        this.searchSeparator = searchSeparator;
        this.replaceSeparator = replaceSeparator;
        Nth.Filter.call(this);
    }
    
    SeparatorToSeparator.prototype = Object.create(Nth.Filter.prototype);
    
    SeparatorToSeparator.prototype.constructor = SeparatorToSeparator;
    
    SeparatorToSeparator.prototype.__CLASS__ = 'Nth.Filter.SeparatorToSeparator';
    
    SeparatorToSeparator.prototype.setSearchSeparator = function (searchSeparator) {
        this.searchSeparator = searchSeparator;
        return this;
    }
    
    SeparatorToSeparator.prototype.getSearchSeparator = function () {
        return this.searchSeparator;
    }
    
    SeparatorToSeparator.prototype.setReplaceSeparator = function (replaceSeparator) {
        this.replaceSeparator = replaceSeparator;
        return this;
    }
    
    SeparatorToSeparator.prototype.getReplaceSeparator = function () {
        return this.replaceSeparator;
    }
    
    SeparatorToSeparator.prototype.filter = function (word) {
        return (word + '').replace(new RegExp(this.getSearchSeparator(), 'g'), this.getReplaceSeparator());
    }
    
    Nth.Filter.Word.SeparatorToSeparator = SeparatorToSeparator;
    
    return SeparatorToSeparator;
});