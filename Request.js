;(function(factory) {
    
    'use strict';
 
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth)
    }
})(function(Nth) {
    
    var Request = function () {

        var parameters = {};

        this.init = function () {
            var hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                parameters[hash[0]] = hash[1];
            }
            return this;
        }

        this.getQuery = function (name, def) {
            if (!name) {
                return parameters;
            }
            def = typeof def === 'undefined' ? null : def;
            if (typeof parameters[name] !== 'undefined') {
                return parameters[name];
            }
            return def;
        }

        this.init();
    }
    
    Nth.Request = Request;
    
    return Request;
});