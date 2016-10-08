;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var Options = function (options) {
        if (!$.isPlainObject(options)) {
            options = {};
        }
        this.setOptions(options);
    }
    
    Options.prototype.getOptions = function() {
        return this.options;
    }
    
    Options.prototype.setOptions = function(options) {
        if (!$.isPlainObject(options)) {
            throw 'The type of "options" argument must be plain object';
        }
        this.options = options;
        return this;
    }
    
    Options.prototype.getOption = function(name, def) {
        if (def === undefined) {
            def = null;
        }
        return this.existsOption(name) ? this.options[name] : def;
    }
    
    Options.prototype.setOption = function(name, value) {
        this.options[name] = value;
        return this;
    }
    
    Options.prototype.mergeOptions = function(options, recursive) {
        this.options = $.extend(recursive === undefined ? {} : recursive, this.getOptions(), options);
        return this;
    }
    
    Options.prototype.existsOption = function(name) {
        return this.options[name] !== undefined;
    }
    
    Options.prototype.removeOption = function(name) {
        if (this.existsOption(name)) {
            delete this.options[name];
        }
        return this;
    }
    
    Options.prototype.cloneOptions = function() {
        return $.extend(true, {}, this.getOptions());
    }
    
    Nth.Options = Options;
    
    return Options;
});