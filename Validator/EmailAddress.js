;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Validator'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
   
    var EmailAddress = function () {
        Nth.Validator.call(this, {
            invalidEmail: 'Email không hợp lệ'
        });
    }
    
    EmailAddress.prototype = Object.create(Nth.Validator.prototype);
    
    EmailAddress.prototype.constructor = EmailAddress;
    
    EmailAddress.prototype.__CLASS__ = 'Nth.Validator.EmailAddress';
    
    EmailAddress.prototype.isValid = function (emailAdrress) {
        if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(emailAdrress)) {
            return true;
        }
        this.setMessage(this.getOption('invalidEmail'));
        return false;
    }
    
    EmailAddress.prototype.getSetterOptions = function () {
        return {
            subject: 'Định dạng theo kiểu địa chỉ Email'
        }
    }
    
    EmailAddress.prototype.toJson = function () {
        return {name: this.__CLASS__}
    }
    
    Nth.Validator.EmailAddress = EmailAddress;
    
    return EmailAddress;
});