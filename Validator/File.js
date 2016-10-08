;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Validator', 'Nth/Helper/String'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var File = function (options) {
        Nth.Validator.call(this, $.extend({}, {
            tooManyFiles: 'Chỉ có thể chọn tối đa {0} tệp tin',
            tooFewFiles: 'Phải chọn ít nhất {0} tệp tin',
            defaultInvalidFileExtension: 'Phần mở rộng của tệp tin không được phép',
            invalidFileExtension: 'Tệp tin phải có phần mở rộng là {0}',
            fileSizeTooLarge: 'Kích thước tối đa mỗi tệp tin là {0} bytes',
            fileSizeTooSmall: 'Kích thước tối thiểu mỗi tệp tin là {0} bytes',
            maxLength: null,
            minLength: null,
            maxSize: null, //bytes
            minSize: null, //bytes
            validExtension: /[a-z]/i //an regular expression or list of extensions are separated by |
        }, options));
        this.input = $();
    }
    
    File.prototype = Object.create(Nth.Validator.prototype);
    
    File.prototype.constructor = File;
    
    File.prototype.__CLASS__ = 'Nth.Validator.File';
    
    File.prototype.setInput = function (input) {
        var $input = $.getElement(input);
        this.input = $input.is(':file') ? $input : $();
        return this;
    }
    
    File.prototype.getInput = function () {
        return this.input;
    }
    
    File.prototype.getChosen = function () {
        var $input = this.getInput();
        if (!$input.length) {
            return [];
        }
        return $input[0].files instanceof FileList ? $input[0].files : [];
    }
    
    File.prototype.getExtensionRegExpObject = function () {
        var validExtension = this.getOption('validExtension');
        if (validExtension instanceof RegExp) {
            return validExtension;
        } else if (typeof validExtension === 'string') {
            return new RegExp('^(' + validExtension + ')$', 'i');
        }
        return /[a-z]/i;
    }
    
    File.prototype.getInvalidExtensionMessage = function () {
        var message = this.getOption('defaultInvalidFileExtension');
        var validExtension = this.getOption('validExtension');
        if (typeof validExtension === 'string') {
            var strHelper = new Nth.Helper.String();
            strHelper.setString(this.getOption('invalidFileExtension'));
            message = strHelper.sprintf(validExtension.split('|').join(', '))
        }
        return message;
    }
    
    File.prototype.isValid = function (input) {
        this.setInput(input);
        var chosen = this.getChosen();
        if (!chosen.length) {
            return true;
        }
        var strHelper = new Nth.Helper.String();
        var maxLength = this.getOption('maxLength');
        if (chosen.length > maxLength) {
            strHelper.setString(this.getOption('tooManyFiles'));
            this.setMessage(strHelper.sprintf(maxLength));
            return false;
        }
        var minLength = this.getOption('minLength');
        if (chosen.length < minLength) {
            strHelper.setString(this.getOption('tooFewFiles'));
            this.setMessage(strHelper.sprintf(minLength));
            return false;
        }
        var maxSize = this.getOption('maxSize');
        var minSize = this.getOption('minSize');
        var extRexgObj = this.getExtensionRegExpObject();
        for (var i = 0; i < chosen.length; i++) {
            var f = chosen[i];
            var file = new Nth.File.File(f.name);
            if (!extRexgObj.test(file.getExtension())) {
                this.setMessage(this.getInvalidExtensionMessage());
                return false;
            }
            if (maxSize && f.size > maxSize) {
                strHelper.setString(this.getOption('fileSizeTooLarge'));
                this.setMessage(strHelper.sprintf(maxSize));
                return false;
            }
            if (minSize && f.size < minSize) {
                strHelper.setString(this.getOption('fileSizeTooSmall'));
                this.setMessage(strHelper.sprintf(minSize));
                return false;
            }
        }
        return true;
    }
    
    Nth.Validator.File = File;
    
    return File;
});