;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Validator'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var Number = function () {
        Nth.Validator.call(this, {
            invalidNumber: 'Giá trị phải là số'
        });
    }
    
    Number.prototype = Object.create(Nth.Validator.prototype);
    
    Number.prototype.constructor = Number;
    
    Number.prototype.__CLASS__ = 'Nth.Validator.Number';
    
    Number.prototype.isValid = function (number) {
        if (isNaN(number)) {
            this.setMessage(this.getOption('invalidNumber'));
            return false;
        }
        return true;
    }
    
    Number.prototype.getSetterOptions = function () {
        return {
            subject: 'Định dạng theo kiểu số'
        }
    }
    
    Number.prototype.toJson = function () {
        return {name: this.__CLASS__}
    }
    
    Nth.Validator.Number = Number;
    
    return Number;
});