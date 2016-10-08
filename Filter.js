;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Options'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var Filter = function() {}
    
    Filter.prototype.constructor = Filter;
    
    Filter.prototype.__CLASS__ = 'Nth.Filter';
    
    Filter.prototype.setElement = function (element) {
        this.element = element;
        return this;
    }
    
    Filter.prototype.getElement = function () {
        return this.element;
    }
    
    Filter.prototype.onHook = function () {
        return this;
    }
    
    Filter.prototype.onUnhook = function () {
        return this;
    }
    
    Filter.prototype.toJson = function () {
        return {
            name: this.__CLASS__,
            options: this.cloneOptions()
        }
    }
    
    Nth.Filter = Filter;
    
    return Filter;
})