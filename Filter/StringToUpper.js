;(function (factory) {

    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Filter'], factory);
    } else {
        factory(Nth);
    }
})(function (Nth) {

    var StringToUpper = function () {
        Nth.Filter.call(this);
    }
    
    StringToUpper.prototype = Object.create(Nth.Filter.prototype);
    
    StringToUpper.prototype.constructor = StringToUpper;
    
    StringToUpper.prototype.__CLASS__ = 'Nth.Filter.StringToUpper';
    
    StringToUpper.prototype.getInputEvent = function () {
        return 'keyup.StringToUpper';
    }
    
    StringToUpper.prototype.onHook = function () {
        var element = this.getElement();
        var inst = this;
        var val = element.getValue();
        if (typeof val === 'string' && val) {
            element.setValue(this.filter(val));
        }
        element.getControl().getNode().on(this.getInputEvent(), function() {
            this.value = inst.filter(this.value);
        });
        return this;
    }
    
    StringToUpper.prototype.onUnhook = function () {
        this.getElement().getControl().getNode().off(this.getInputEvent());
        return this;
    }

    StringToUpper.prototype.filter = function (string) {
        return (string + '').toUpperCase();
    }
    
    StringToUpper.prototype.getSetterOptions = function () {
        return {
            subject: 'Chuyển đổi tất cả ký tự thành kiểu in hoa khi người dùng nhập'
        }
    }
    
    StringToUpper.prototype.toJson = function () {
        return {
            name: this.__CLASS__
        }
    }
    
    Nth.Filter.StringToUpper = StringToUpper;

    return StringToUpper;
});