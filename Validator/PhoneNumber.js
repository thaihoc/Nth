;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Validator'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var PhoneNumber = function () {
        Nth.Validator.call(this, {
            invalidPhoneNumber: 'Số điện thoại không hợp lệ'
        });
    }
    
    PhoneNumber.prototype = Object.create(Nth.Validator.prototype);
    
    PhoneNumber.prototype.constructor = PhoneNumber;
    
    PhoneNumber.prototype.__CLASS__ = 'Nth.Validator.PhoneNumber';
    
    PhoneNumber.prototype.isValid = function (phoneNumber) {
        if (phoneNumber.match(/^(0|\+84)\d{9,10}$/g)) {
            return true;
        }
        this.setMessage(this.getOption('invalidPhoneNumber'));
        return false;
    }
    
    PhoneNumber.prototype.getSetterOptions = function () {
        return {
            subject: 'Định dạng theo kiểu số điện thoại'
        }
    }
    
    PhoneNumber.prototype.toJson = function () {
        return {name: this.__CLASS__}
    }
    
    Nth.Validator.PhoneNumber = PhoneNumber;
    
    return PhoneNumber;
});