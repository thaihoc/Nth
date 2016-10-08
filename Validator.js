;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Options'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var Validator = function(options) {
        Nth.Options.call(this, {
            retypeText: 'Vui lòng nhập {0}',
            reselectText: 'Vui lòng chọn {0}',
            notRight: '{0} không đúng',
            valueTooSmall: '{0} phải lớn hơn hoặc bằng {1}',
            valueTooLarge: '{0} phải nhỏ hơn hoặc bằng {1}'
        });
        this.mergeOptions(options);
    }
    
    Validator.prototype = Object.create(Nth.Options.prototype);
    
    Validator.prototype.constructor = Validator;
    
    Validator.prototype.__CLASS__ = 'Nth.Validator';
    
    Validator.prototype.setMessage = function (message) {
        this.message = message;
        return this;
    }
    
    Validator.prototype.getMessage = function () {
        return this.message;
    }
    
    Validator.prototype.setElement = function (element) {
        this.element = element;
        return this;
    }
    
    Validator.prototype.getElement = function () {
        return this.element;
    }
    
    Validator.prototype.isValid = function () {
        return true;
    }
    
    Validator.prototype.onHook = function () {
        return this;
    }
    
    Validator.prototype.onUnhook = function () {
        return this;
    }
    
    Validator.prototype.toJson = function () {
        return {
            name: this.__CLASS__,
            options: this.cloneOptions()
        }
    }
    
    Validator.__getInstance = function() {
        if (!(Validator.__instance instanceof Validator)) {
            Validator.__instance = new Validator();
        }
        return Validator.__instance;
    }
    
    Nth.Validator = Validator;
    
    return Validator;
})