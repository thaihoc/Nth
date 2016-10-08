;
(function (factory) {

    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function (Nth) {

    var NumberHelper = function (number, fraction) {
        this.setNumber(number);
        this.setFraction(fraction);
    }

    NumberHelper.prototype.getNumber = function () {
        return this.number;
    }

    NumberHelper.prototype.setNumber = function (number) {
        this.number = '';
        if (typeof number === 'number') {
            this.number = number + '';
        } else if (typeof number === 'string') {
            this.number = number;
        }
        return this;
    }

    NumberHelper.prototype.getFraction = function () {
        return this.fraction;
    }

    NumberHelper.prototype.setFraction = function (fraction) {
        this.fraction = fraction || ',';
        return this;
    }

    NumberHelper.prototype.getSeparator = function () {
        return this.getFraction() === ',' ? '.' : ',';
    }

    NumberHelper.prototype.isOddNumber = function () {
        var arr = this.getNumber().split(this.getFraction());
        return arr.length === 2 && arr[1];
    }

    NumberHelper.prototype.addCommas = function () {
        return this.addSeparator(',');
    }

    NumberHelper.prototype.removeCommas = function () {
        return this.removeSeparator(',');
    }

    NumberHelper.prototype.addDotted = function () {
        return this.addSeparator('.');
    }

    NumberHelper.prototype.removeDotted = function () {
        return this.removeSeparator('.');
    }

    NumberHelper.prototype.addSeparator = function (o) {
        o = o || this.getSeparator();
        var s = o === ',' ? '.' : ',';
        var fraction = this.getFraction();
        if (fraction === o) {
            this.removeSeparator(s).replaceSeparator(o, s).setFraction(s);
        } else {
            this.removeSeparator(o);
        }
        var x = this.getArrayPartly();
        var x1 = x[0];
        var x2 = x.length > 1 ? s + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + o + '$2');
        }
        this.setNumber(x1 + x2);
        return this;
    }

    NumberHelper.prototype.removeSeparator = function (s) {
        this.replaceSeparator(s, '');
        return this;
    }

    NumberHelper.prototype.replaceSeparator = function (s, r) {
        var n = this.getNumber();
        if (n === '') {
            return n;
        }
        var stringHelper = new Nth.Helper.String(s);
        var rex = new RegExp(stringHelper.escapeRegexp(), 'g');
        this.setNumber(n.replace(rex, r));
        return this;
    }

    NumberHelper.prototype.clean = function () {
        var separator = this.getSeparator();
        var n = this.removeSeparator(separator).getNumber();
        n = n.replace(/^[0]+/g, '');
        if (this.isOddNumber()) {
            n = n.replace(/[0]+$/g, '');
        }
        this.setNumber(n);
        return this;
    }
    
    NumberHelper.prototype.getArrayPartly = function () {
        return this.getNumber().split(this.getFraction());
    }

    NumberHelper.prototype.read = function (o) {
        o = o || ',';
        var clone = this.clone();
        var s = [];
        var nts = {0: 'không', 1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 5: 'năm', 6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín'};
        var n = clone.clean().getArrayPartly();        
        var chan = n[0] ? n[0] : '';
        var le = n[1] ? n[1] : '';
        function push(v) {
            if (v && v.length) {
                if (typeof v == 'string') {
                    if (!s.length) {
                        s.push(v);
                    } else {
                        s.push(' ');
                        s.push(v);
                    }
                } else {
                    for (var i in v) {
                        push(v[i]);
                    }
                }
            }
        }
        function read3(n3, dl, ex) {
            var r = [], donvi, chuc, tram;
            if (n3.length === 3) {
                donvi = Number(n3[2]);
                chuc = Number(n3[1]);
                tram = Number(n3[0]);
                if (tram === 0 && chuc === 0 && donvi === 0) {
                    if (dl && ex) {
                        //console.log('Đọc hàng %s: %s -> %s', dl, n3, dl );
                        return dl;
                    } else {
                        //console.log('Đọc hàng %s: %s -> ', dl == undefined ? 'đơn vị' : dl, n3 );
                        return '';
                    }
                }
            } else if (n3.length === 2) {
                donvi = Number(n3[1]);
                chuc = Number(n3[0]);
            } else if (n3.length === 1) {
                donvi = Number(n3[0]);
            }
            if (!isNaN(tram)) {
                r.push(nts[tram]);
                r.push('trăm');
            }
            if (!isNaN(chuc) && chuc !== 0) {
                if (chuc === 1) {
                    r.push('mười');
                } else if (!isNaN(tram) && chuc === 0) {
                    r.push('lẻ');
                } else {
                    r.push(nts[chuc]);
                    r.push('mươi');
                }
            }
            if (!isNaN(donvi)) {
                if (chuc === 0 && donvi > 0) {
                    r.push('lẻ');
                    r.push(nts[donvi]);
                } else if (!isNaN(chuc) && chuc !== 1 && donvi === 1) {
                    r.push('mốt');
                } else if (!isNaN(chuc) && chuc !== 0 && donvi === 5) {
                    r.push('lăm');
                } else if (donvi !== 0 || (isNaN(tram) && isNaN(chuc))) {
                    r.push(nts[donvi]);
                }
            }
            //if( dl ){ console.log('Đọc hàng %s: %s -> %s', dl, n3, r.join(' ') ); }
            if (dl && (r.length || ex)) {
                r.push(dl);
            }
            return r;
        }
        function readAll(rn) {
            var nh = new NumberHelper(rn, clone.getFraction());
            var s = nh.addSeparator().getNumber().split(nh.getSeparator());
            for (var i = 0, l = s.length; i < l; i++) {
                var tty = l - i - 4,
                        ttrieu = l - i - 3,
                        ttram = l - i - 2;

                if (tty % 3 === 0 && tty >= 0) {
                    var ty = s[i];
                    push(read3(ty, 'tỷ', !0));
                }
                if (ttrieu % 3 === 0 && ttrieu >= 0) {
                    var trieu = s[i];
                    push(read3(trieu, 'triệu'));
                }
                if (ttram % 3 === 0 && ttram >= 0) {
                    var nghin = s[i];
                    push(read3(nghin, 'nghìn'));
                }
                if (l - i === 1) {
                    var donvi = s[i];
                    push(read3(donvi));
                }
            }
        }
        if (chan) {
            readAll(chan);
        }
        if (le) {
            push('phẩy');
            readAll(le);
        }
        var stringHelper = new Nth.Helper.String(s.join(''));
        return stringHelper.ucfirst().getString();
    }
    
    NumberHelper.prototype.clone = function () {
        return new NumberHelper(this.getNumber(), this.getFraction());
    }

    Nth.Helper.Number = NumberHelper;

    return NumberHelper;
});

