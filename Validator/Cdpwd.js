;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Validator'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var Cdpwd = function () {
        Nth.Validator.call(this, {
            invalidCdpwd: 'Mật khẩu phải có ít nhất 6 ký tự'
        });
    }
    
    Cdpwd.prototype = Object.create(Nth.Validator.prototype);
    
    Cdpwd.prototype.constructor = Cdpwd;
    
    Cdpwd.prototype.__CLASS__ = 'Nth.Validator.Cdpwd';
    
    Cdpwd.prototype.isValid = function (pwd) {
        if (!pwd || pwd.length < 6) {
            this.setMessage(this.getOption('invalidCdpwd'));
            return false;
        }
        return true;
    }
    
    Cdpwd.prototype.toJson = function () {
        return {name: this.__CLASS__}
    }
    
    Cdpwd.prototype.getSetterOptions = function () {
        return {
            subject: 'Định dạng là mật khẩu công dân (Phải có ít nhất 6 ký tự)'
        }
    }
    
    Nth.Validator.Cdpwd = Cdpwd;
    
    return Cdpwd;
});