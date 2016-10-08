;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * String Helper plugin
     */
    var String = function (s) {

        var string = s;

        this.setString = function (s) {
            string = s;
            return this;
        }

        this.getString = function () {
            return string;
        }

        this.escapeRegexp = function () {
            return string.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
        }

        this.ucfirst = function () {
            string += '';
            string = string.substring(0, 1).toUpperCase() + string.substring(1);
            return this;
        }

        this.lcfirst = function () {
            string += '';
            string = string.substring(0, 1).toLowerCase() + string.substring(1);
            return this;
        }

        this.limit = function (len, placeholder) {
            var str = string + '';
            if (!str) {
                return '';
            }
            len = len || 50;
            if (str.length > len) {
                str = str.substring(0, len - 2) + (placeholder || '...');
            }
            return str;
        }

        this.removeMarks = function () {
            var rules = {
                a: ["à", "á", "ạ", "ả", "ã", "â", "ầ", "ấ", "ậ", "ẩ", "ẫ", "ă", "ằ", "ắ", "ặ", "ẳ", "ẵ"],
                e: ["è", "é", "ẹ", "ẻ", "ẽ", "ê", "ề", "ế", "ệ", "ể", "ễ"],
                i: ["ì", "í", "ị", "ỉ", "ĩ"],
                o: ["ò", "ó", "ọ", "ỏ", "õ", "ô", "ồ", "ố", "ộ", "ổ", "ỗ", "ơ", "ờ", "ớ", "ợ", "ở", "ỡ"],
                u: ["ù", "ú", "ụ", "ủ", "ũ", "ư", "ừ", "ứ", "ự", "ử", "ữ"],
                y: ["ỳ", "ý", "ỵ", "ỷ", "ỹ"],
                d: ["đ"],
                A: ["À", "Á", "Ạ", "Ả", "Ã", "Â", "Ầ", "Ấ", "Ậ", "Ẩ", "Ẫ", "Ă", "Ằ", "Ắ", "Ặ", "Ẳ", "Ẵ"],
                E: ["È", "É", "Ẹ", "Ẻ", "Ẽ", "Ê", "Ề", "Ế", "Ệ", "Ể", "Ễ"],
                I: ["Ì", "Í", "Ị", "Ỉ", "Ĩ"],
                O: ["Ò", "Ó", "Ọ", "Ỏ", "Õ", "Ô", "Ồ", "Ố", "Ộ", "Ổ", "Ỗ", "Ơ", "Ờ", "Ớ", "Ợ", "Ở", "Ỡ"],
                U: ["Ù", "Ú", "Ụ", "Ủ", "Ũ", "Ư", "Ừ", "Ứ", "Ự", "Ử", "Ữ"],
                Y: ["Ỳ", "Ý", "Ỵ", "Ỷ", "Ỹ"],
                D: ["Đ"]
            }
            var regex;
            for (var replaceChar in rules) {
                var findChar = rules[replaceChar];
                for (var i in findChar) {
                    regex = new RegExp(findChar[i], "g");
                    string = string.replace(regex, replaceChar);
                }
            }
            if (string.length) {
                for (var i in string) {
                    if (string.charCodeAt(i) > 255) {
                        string = string.replace(string[i], '');
                    }
                }
            }
            return this;
        }

        this.cleanSpecialChars = function () {
            string = string.replace(/[^\w\s]/gi, '');
            return this;
        }

        this.trim = function () {

        }
        
        this.sprintf = function() {
            var parameters = arguments;
            var pattern = /\{\{|\}\}|\{(\d+)\}/g;
            return string.replace(pattern, function (match, group) {
                var value;
                if (match === "{{")
                    return "{";
                if (match === "}}")
                    return "}";
                value = parameters[parseInt(group, 10)];
                return value ? value.toString() : "";
            });
        }
    }
    
    Nth.Helper.String = String;
    
    return String;
});