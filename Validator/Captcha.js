;
(function (factory) {

    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Validator', 'Nth/Helper/String'], factory);
    } else {
        factory(Nth);
    }
})(function (Nth) {

    /**
     * Using AJAX with GET method to validate CAPTCHA text
     */
    var Captcha = function (options) {
        Nth.Validator.call(this, $.extend({}, {
            url: null, //response 0 as invalid, otherwise as valid
            invalidUrl: 'Không thể kiểm tra mã xác nhận',
            invalidCaptchaCode: 'Mã xác nhận chưa đúng'
        }, options));
    }

    Captcha.prototype = Object.create(Nth.Validator.prototype);

    Captcha.prototype.constructor = Captcha;

    Captcha.prototype.__CLASS__ = 'Nth.Validator.Captcha';

    Captcha.prototype.isValid = function (done) {
        if (typeof done !== 'function') {
            done = function () {
                return this;
            }
        }
        var inst = this;
        var url = this.getOption('url');
        if (!url) {
            this.setMessage(this.getOption('invalidUrl'));
            done.call(this, false);
            return this;
        }
        $.ajax({
            type: 'GET',
            url: url,
            success: function (r) {
                if (parseInt(r) === 0) {
                    inst.setMessage(inst.getOption('invalidCaptchaCode'));
                    return done.call(inst, false);
                }
                return done.call(inst, true);
            },
            error: function () {
                inst.setMessage(inst.getOption('invalidUrl'));
                return done.call(inst, false);
            }
        });
        return this;
    }

    Nth.Validator.Captcha = Captcha;

    return Captcha;
});