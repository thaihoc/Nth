;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Validator'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    
    var Cmnd = function () {
        Nth.Validator.call(this, {
            cmndNotNumber: 'Số CMND phải là chữ số',
            invalidCmnd: 'Số CMND phải có 9 hoặc 12 chữ số'
        });
    }
    
    Cmnd.prototype = Object.create(Nth.Validator.prototype);
    
    Cmnd.prototype.constructor = Cmnd;
    
    Cmnd.prototype.__CLASS__ = 'Nth.Validator.Cmnd';
    
    Cmnd.isValid = function (cmnd) {
        if (isNaN(cmnd)) {
            this.setMessage(this.getOption('cmndNotNumber'));
            return false;
        } else if (!(cmnd.length === 9 || cmnd.length === 12)) {
            this.setMessage(this.getOption('invalidCmnd'));
            return false;
        }
        return true;
    }
    
    Cmnd.prototype.toJson = function () {
        return {name: this.__CLASS__}
    }
    
    Cmnd.prototype.getSetterOptions = function () {
        return {
            subject: 'Định dạng là số chứng minh nhân dân (9 hoặc 12 số)'
        }
    }
    
    Nth.Validator.Cmnd = Cmnd;
    
    return Cmnd;
});