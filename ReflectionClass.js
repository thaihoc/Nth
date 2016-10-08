;
(function (factory) {

    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth)
    }
})(function (Nth) {

    var ReflectionClass = function (name) {
        this.name = name;
    }

    ReflectionClass.prototype.getName = function () {
        return this.name;
    }

    ReflectionClass.prototype.getShortName = function () {
        var arr = this.name.split('.');
        return arr[arr.length - 1];
    }

    ReflectionClass.prototype.getNamespaceName = function () {
        var arr = this.name.split('.');
        arr.splice(arr.length - 1, 1);
        return arr.join('.');
    }

    ReflectionClass.prototype.inNamespace = function () {
        return !!this.getNamespaceName();
    }

    ReflectionClass.prototype.getClass = function () {
        var cls = window;
        $.each(this.name.split('.'), function (i, chain) {
            cls = cls[chain];
        });
        return cls;
    }

    ReflectionClass.prototype.exists = function () {
        try {
            var cls = this.getClass();
            return typeof cls === 'function';
        } catch(e) {
            return false;
        }
    }

    Nth.ReflectionClass = ReflectionClass;

    return ReflectionClass;
});