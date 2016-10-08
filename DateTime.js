;
(function (factory) {

    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'moment', 'Nth/Helper/String'], factory);
    } else {
        factory(Nth, moment);
    }
})(function (Nth, moment) {

    /**
     * DateTime plugin
     */
    var DateTime = function (dateTime) {
        if (typeof dateTime === 'undefined') {
            dateTime = new Date();
        }
        this.setDateTime(dateTime);
    }

    DateTime.prototype.__CLASS__ = 'Nth.DateTime';

    DateTime.prototype.getDateTime = function () {
        return this.dateTime;
    }

    DateTime.prototype.setDateTime = function (dateTime) {
        if (!(dateTime instanceof Date)) {
            throw 'dateTime argument must be an instance of Date function';
        }
        this.dateTime = dateTime;
        return this;
    }

    DateTime.prototype.clarification = function () {
        var date = this.toObject(true);
        var now = (new DateTime()).toObject();
        var diff = null;
        var result = '';
        now.i = parseInt(now.i);
        date.i = parseInt(date.i);
        diff = now.Y - date.Y;
        if (diff === 0) {
            diff = now.n - date.n;
            if (diff === 0) {
                diff = now.j - date.j;
                if (diff === 0) {
                    diff = now.G - date.G;
                    if (diff === 0) {
                        diff = now.i - date.i;
                        if (diff === 0) {
                            result = 'Mới đây';
                        } else if (diff > 0) {
                            result = diff + ' phút trước';
                        } else if (diff < 0) {
                            result = Math.abs(diff) + ' phút sau';
                        }
                    } else if (diff > 0) {
                        if (diff === 1) {
                            diff = now.i + 60 - date.i
                            if (diff < 60) {
                                result = diff + ' phút trước';
                            } else {
                                result = '1 giờ trước';
                            }
                        } else {
                            result = diff + ' giờ trước';
                        }
                    } else if (diff < 0) {
                        result = Math.abs(diff) + ' giờ sau';
                    }
                } else if (diff > 0) {
                    if (diff === 1) {
                        result = 'Hôm qua';
                    } else if (diff === 2) {
                        result = 'Hôm kia';
                    } else {
                        result = diff + ' ngày trước';
                    }
                } else if (diff < 0) {
                    diff = Math.abs(diff);
                    if (diff === 1) {
                        result = 'Ngày mai';
                    } else if (diff === 2) {
                        result = 'Ngày mốt';
                    } else {
                        result = diff + ' ngày sau';
                    }
                }
            } else if (diff > 0) {
                if (diff === 1) {
                    diff = now.j + DateTime.daysInMonth(date.n, date.Y) - date.j;
                    if (diff < 28) {
                        if (diff === 1) {
                            result = 'Hôm qua';
                        } else if (diff === 2) {
                            result = 'Hôm kia';
                        } else {
                            result = diff + ' ngày trước';
                        }
                    } else {
                        result = '1 tháng trước';
                    }
                } else {
                    result = diff + ' tháng trước';
                }
            } else if (diff < 0) {
                result = Math.abs(diff) + ' tháng sau';
            }
        } else if (diff > 0) {
            if (diff === 1) {
                diff = now.n + 12 - date.n;
                if (diff < 12) {
                    result = diff + ' tháng trước';
                } else {
                    result = '1 năm trước';
                }
            } else {
                result = diff + ' năm trước';
            }
        } else if (diff < 0) {
            result = Math.abs(diff) + ' năm sau';
        }
        return result;
    }

    DateTime.prototype.isToday = function () {
        var now = new Date();
        var dt = this.getDateTime();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0);
        return now.getTime() == dt.getTime();
    }

    DateTime.prototype.isYesterday = function () {
        var now = new Date();
        var dt = this.getDateTime();
        now.setDate(now.getDate() - 1);
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0);
        return now.getTime() == dt.getTime();
    }
    
    DateTime.prototype.compare = function (dt) {
        if (!(dt instanceof DateTime)) {
            throw 'The argument was passed must be an instance of DateTime class';
        }
        var t1 = this.getDateTime().getTime();
        var t2 = dt.getDateTime().getTime();
        if (t1 === t2) {
            return 0;
        } else if (t1 > t2) {
            return 1;
        }
        return -1;
    }

    DateTime.prototype.toObject = function (interpolate) {
        var dt = this.getDateTime();
        var translator = DateTime.translator;
        var date = dt.getDate();
        var day = dt.getDay();
        var fullyear = dt.getFullYear();
        var hours = dt.getHours();
        var milliseconds = dt.getMilliseconds();
        var minutes = dt.getMinutes();
        var month = dt.getMonth();
        var seconds = dt.getSeconds();
        var time = dt.getTime();
        var fo = {};
        //Day
        fo.d = date < 10 ? '0' + date : date;
        fo.D = translator.day[day];
        fo.j = date;
        fo.l = translator.dayFull[day];
        fo.L = translator.dayFull[day].toLowerCase();
        fo.N = day + 1;
        fo.S = DateTime.getDayOrdinalSuffix(fo.j);
        fo.w = day;
        fo.z = null;
        //Week
        fo.W = null;
        //Month
        fo.F = translator.monthFull[month];
        fo.n = month + 1;
        fo.m = fo.n < 10 ? '0' + fo.n : fo.n;
        fo.M = translator.month[month];
        fo.t = null;
        //Year
        fo.L = null;
        fo.o = fullyear;
        fo.Y = fullyear;
        fo.y = fullyear.toString().substr(-2, 2);
        //Time
        fo.a = hours > 0 && hours < 13 ? 'am' : 'pm';
        fo.A = fo.a == 'am' ? 'AM' : 'PM';
        fo.B = null;
        fo.g = hours === 12 || hours === 0 ? 12 : hours % 12;
        fo.G = hours;
        fo.h = fo.g < 10 ? '0' + fo.g : fo.g;
        fo.H = fo.G < 10 ? '0' + fo.G : fo.G;
        fo.i = minutes < 10 ? '0' + minutes : minutes;
        fo.s = seconds < 10 ? '0' + seconds : seconds;
        fo.u = milliseconds;
        //Timezone
        fo.e = null;
        fo.I = null;
        fo.O = null;
        fo.P = null;
        fo.T = null;
        fo.Z = null;
        //Full Date/Time,
        fo.c = null;
        fo.r = null;
        fo.U = time;
        if (interpolate) {
            return DateTime.interpolate(fo);
        }
        return fo;
    }

    DateTime.prototype.toString = function (format) {
        if (typeof format !== 'string') {
            format = 'd/m/Y H:i:s';
        }
        var result = '';
        var fo = this.toObject()
        for (var i = 0; i < format.length; i++) {
            var j = format.indexOf(format[i]);
            if (format[j - 1] != '\\' && typeof fo[format[i]] !== 'undefined') {
                result += fo[format[i]];
            } else {
                result += format[i];
            }
        }
        return result;
    }

    DateTime.formatOffsets = [
        'd', 'D', 'j', 'l', 'N', 'S', 'w', 'z', //Day
        'W', //Week
        'F', 'n', 'm', 'M', 't', //Month
        'L', 'o', 'Y', 'y', //Year
        'a', 'A', 'B', 'g', 'G', 'h', 'H', 'i', 's', 'u', //Time
        'e', 'I', 'O', 'P', 'T', 'Z', //Timezone
        'c', 'r', 'U' //Full Date/Time,
    ]

    DateTime.translator = {
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        monthFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }

    DateTime.getDayOrdinalSuffix = function (j) {
        switch (j) {
            case 1 || 21 || 31:
                return 'st';
            case 2 || 22:
                return 'nd';
            case 3 || 23:
                return 'rd';
            default:
                return 'th';
        }
    }

    DateTime.isLeapYear = function (Y) { //By Gregorian Calendar
        if (Y % 4 == 0) {
            if (Y % 100 == 0) {
                return Y % 400 == 0 ? 1 : 0;
            }
            return 1;
        }
        return 0;
    }

    DateTime.daysInMonth = function (n, Y) { //By Gregorian Calendar
        var t = 0;
        if ([1, 3, 5, 7, 8, 10, 12].indexOf(n) > -1) {
            t = 31;
        } else if ([4, 6, 9, 11].indexOf(n) > -1) {
            t = 30;
        } else if (n == 2) {
            this.isLeapYear(Y) ? t = 29 : t = 28;
        }
        return t;
    }

    DateTime.interpolate = function (fo) {
        var strHelper = new Nth.Helper.String();
        var formatOffsets = DateTime.formatOffsets;
        var translator = DateTime.translator;
        var saturated = false;
        var weHave = [];
        var weDontHave = [];
        if (typeof fo == 'object') {
            for (var i = 0, len = formatOffsets.length; i < len; i++) {
                var f = formatOffsets[i];
                (typeof fo[f] == 'undefined' || fo[f] == null) ?
                        weDontHave.push(f) : weHave.push(f);
            }
        }
        while (weHave.length && weDontHave.length && !saturated) {
            var firstLength = weHave.length;
            for (var i = 0; i < weDontHave.length; i++) {
                if (weDontHave[i] == 'd') {
                    //get from j
                    if (weHave.indexOf('j') > -1) {
                        fo.d = parseInt(fo.j) < 10 ? '0' + fo.j : fo.j;
                        weHave.push('d');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'D') {
                    //get from l
                    if (weHave.indexOf('l') > -1) {
                        fo.D = fo.l.substr(0, 3);
                        weHave.push('D');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from L
                    else if (weHave.indexOf('L') > -1) {
                        fo.D = strHelper.setString(fo.L.substr(0, 3)).ucfirst().getString();
                        weHave.push('D');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from N
                    else if (weHave.indexOf('N') > -1) {
                        fo.D = translator.day[fo.N === 7 ? 0 : fo.N];
                        weHave.push('D');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'j') {
                    //get from d
                    if (weHave.indexOf('d') > -1) {
                        fo.j = parseInt(fo.d);
                        weHave.push('j');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'l') {
                    //get from D
                    if (weHave.indexOf('D') > -1) {
                        var idx = translator.day.indexOf(fo.D);
                        fo.l = translator.dayFull[idx];
                        weHave.push('l');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from L
                    if (weHave.indexOf('L') > -1) {
                        fo.l = strHelper.setString(fo.L).ucfirst().getString();
                        weHave.push('l');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'L') {
                    //get from D
                    if (weHave.indexOf('D') > -1) {
                        var idx = translator.day.indexOf(fo.D);
                        fo.L = translator.dayFull[idx].toLowerCase();
                        weHave.push('L');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from l
                    if (weHave.indexOf('l') > -1) {
                        fo.L = fo.l.toLowerCase();
                        weHave.push('L');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'N') {
                    //get from D
                    if (weHave.indexOf('D') > -1) {
                        var idx = translator.day.indexOf(fo.D)
                        idx === 0 ? fo.N = 7 : fo.N = idx;
                        weHave.push('N');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from l
                    else if (weHave.indexOf('l') > -1) {
                        var idx = translator.dayFull.indexOf(fo.l)
                        idx === 0 ? fo.N = 7 : fo.N = idx;
                        weHave.push('N');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from L
                    else if (weHave.indexOf('L') > -1) {
                        var idx = translator.dayFull.indexOf(strHelper.setString(fo.L).ucfirst().getString())
                        idx === 0 ? fo.N = 7 : fo.N = idx;
                        weHave.push('N');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'S') {
                    //get from j
                    if (weHave.indexOf('j') > -1) {
                        fo.S = DateTime.getDayOrdinalSuffix(fo.j);
                        weHave.push('S');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from d
                    else if (weHave.indexOf('d') > -1) {
                        fo.S = DateTime.getDayOrdinalSuffix(parseInt(fo.d));
                        weHave.push('S');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'w') {
                    //get from N
                    if (weHave.indexOf('N') > -1) {
                        fo.w = fo.N === 7 ? 0 : fo.N;
                        weHave.push('w');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from D
                    else if (weHave.indexOf('D') > -1) {
                        fo.w = translator.day.indexOf(fo.D);
                        weHave.push('w');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from l
                    else if (weHave.indexOf('l') > -1) {
                        fo.w = translator.dayFull.indexOf(fo.l);
                        weHave.push('w');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from L
                    else if (weHave.indexOf('L') > -1) {
                        fo.w = translator.dayFull.indexOf(strHelper.setString(fo.L).ucfirst().getString());
                        weHave.push('w');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'z') {
                    //get from j + n + Y
                    if (weHave.indexOf('j') > -1 && weHave.indexOf('n') > -1 && weHave.indexOf('Y') > -1) {
                        var z = fo.j, n = fo.n;
                        while (n > 1) {
                            z += DateTime.daysInMonth(n, fo.Y);
                            n--;
                        }
                        fo.z = z;
                        weHave.push('z');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'W') {
                    //get from z
                    if (weHave.indexOf('z') > -1) {
                        fo.W = Math.ceil(fo.z / 7);
                        weHave.push('W');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'F') {
                    //get from m
                    if (weHave.indexOf('m') > -1) {
                        fo.F = translator.monthFull[parseInt(fo.m) - 1]
                        weHave.push('F');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from M
                    else if (weHave.indexOf('M') > -1) {
                        var w = translator.month.indexOf(fo.M);
                        fo.F = translator.monthFull[w]
                        weHave.push('F');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from n
                    else if (weHave.indexOf('n') > -1) {
                        fo.F = translator.monthFull[fo.n - 1]
                        weHave.push('F');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'm') {
                    //get from F
                    if (weHave.indexOf('F') > -1) {
                        var n = translator.monthFull.indexOf(fo.F) + 1;
                        fo.m = n > 10 ? n : '0' + n;
                        weHave.push('m');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from M
                    else if (weHave.indexOf('M') > -1) {
                        var n = translator.month.indexOf(fo.M) + 1;
                        fo.m = n > 10 ? n : '0' + n;
                        weHave.push('m');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from n
                    else if (weHave.indexOf('n') > -1) {
                        ;
                        fo.m = fo.n > 10 ? fo.n : '0' + fo.n;
                        weHave.push('m');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'M') {
                    //get from F
                    if (weHave.indexOf('F') > -1) {
                        var idx = translator.monthFull.indexOf(fo.F);
                        fo.M = translator.month[idx];
                        weHave.push('M');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from m
                    else if (weHave.indexOf('m') > -1) {
                        fo.M = translator.month[parseInt(fo.m) - 1];
                        weHave.push('m');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from n
                    else if (weHave.indexOf('n') > -1) {
                        fo.M = translator.month[fo.n - 1];
                        weHave.push('m');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'n') {
                    //get from F
                    if (weHave.indexOf('F') > -1) {
                        fo.n = translator.monthFull.indexOf(fo.F) + 1;
                        weHave.push('n');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from m
                    else if (weHave.indexOf('m') > -1) {
                        fo.n = parseInt(fo.m);
                        weHave.push('n');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from M
                    else if (weHave.indexOf('M') > -1) {
                        fo.n = translator.month.indexOf(fo.M) + 1;
                        weHave.push('n');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 't') {
                    //get from F + Y
                    if (weHave.indexOf('F') > -1 && weHave.indexOf('Y') > -1) {
                        var n = translator.monthFull.indexOf(fo.F) + 1;
                        fo.t = DateTime.daysInMonth(n, fo.Y);
                        weHave.push('t');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from m + Y
                    else if (weHave.indexOf('m') > -1 && weHave.indexOf('Y') > -1) {
                        var n = parseInt(fo.m);
                        fo.t = DateTime.daysInMonth(n, fo.Y);
                        weHave.push('t');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from M + Y
                    else if (weHave.indexOf('M') > -1 && weHave.indexOf('Y') > -1) {
                        var n = translator.month.indexOf(fo.M) + 1;
                        fo.t = DateTime.daysInMonth(n, fo.Y);
                        weHave.push('t');
                        weDontHave.splice(i, 1);
                        break;
                    }
                    //get from n + Y
                    else if (weHave.indexOf('n') > -1 && weHave.indexOf('Y') > -1) {
                        fo.t = DateTime.daysInMonth(fo.n, fo.Y);
                        weHave.push('t');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'L') {
                    //get from Y
                    if (weHave.indexOf('Y') > -1) {
                        fo.L = DateTime.isLeapYear(fo.Y);
                        weHave.push('L');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'y') {
                    //get from Y
                    if (weHave.indexOf('Y') > -1) {
                        fo.y = fo.Y.toString().substr(2, 2)
                        weHave.push('y');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'a') {
                    //get from A
                    if (weHave.indexOf('A') > -1) {
                        fo.a = fo.A.toLowerCase();
                        weHave.push('a');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'A') {
                    //get from a
                    if (weHave.indexOf('a') > -1) {
                        fo.A = fo.a.toUpperCase();
                        weHave.push('A');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'g') {
                    //get from h
                    if (weHave.indexOf('h') > -1) {
                        fo.g = parseInt(fo.h);
                        weHave.push('g');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'G') {
                    //get from H
                    if (weHave.indexOf('H') > -1) {
                        fo.G = parseInt(fo.H);
                        weHave.push('G');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'h') {
                    //get from g
                    if (weHave.indexOf('g') > -1) {
                        fo.h = fo.g > 10 ? fo.g : '0' + fo.g;
                        weHave.push('h');
                        weDontHave.splice(i, 1);
                        break;
                    }
                } else if (weDontHave[i] == 'H') {
                    //get from G
                    if (weHave.indexOf('G') > -1) {
                        fo.H = fo.G > 10 ? fo.G : '0' + fo.G;
                        weHave.push('H');
                        weDontHave.splice(i, 1);
                        break;
                    }
                }
            }
            saturated = weHave.length == firstLength;
        }
        return fo;
    }

    DateTime.getInfoFromFormat = function (dateString, format) {
        format = format || 'd/m/Y H:i:s';
        var formatOffsets = DateTime.formatOffsets;
        var translator = DateTime.translator;
        var fo = {}
        for (var i = 0, len = format.length; i < len; i++) {
            if (formatOffsets.indexOf(format[i]) > -1) {
                //Day
                if (format[i] == 'd') {
                    fo.d = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                } else if (format[i] == 'D') {
                    fo.D = dateString.substr(0, 3);
                    dateString = dateString.substr(3, dateString.length - 3);
                } else if (format[i] == 'j') {
                    var j = dateString[0];
                    if (parseInt(dateString[1])) {
                        j += dateString[1];
                    }
                    fo.j = parseInt(j);
                    dateString = dateString.substr(j.length, dateString.length - j.length);
                } else if (format[i] == 'l') {
                    for (var k = 0, j = translator.dayFull.length; k < j; k++) {
                        var l = translator.dayFull[k]
                                , reg = new RegExp('^' + l, 'm');
                        if (reg.test(dateString)) {
                            fo.l = l;
                            dateString = dateString.substr(l.length, dateString.length - l.length);
                            break;
                        }
                    }
                } else if (format[i] == 'L') {
                    for (var k = 0, j = translator.dayFull.length; k < j; k++) {
                        var L = translator.dayFull[k].toLowerCase()
                                , reg = new RegExp('^' + L, 'm');
                        if (reg.test(dateString)) {
                            fo.L = L;
                            dateString = dateString.substr(L.length, dateString.length - L.length);
                            break;
                        }
                    }
                } else if (format[i] == 'N') {
                    fo.N = dateString.substr(0, 1);
                    dateString = dateString.substr(1, dateString.length - 1);
                } else if (format[i] == 'S') {
                    fo.S = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                } else if (format[i] == 'w') {
                    fo.w = dateString.substr(0, 1);
                    dateString = dateString.substr(1, dateString.length - 1);
                } else if (format[i] == 'z') {
                    var z = dateString[0];
                    if (parseInt(dateString[1])) {
                        z += dateString[1];
                    }
                    if (parseInt(dateString[2])) {
                        z += dateString[2];
                    }
                    fo.z = parseInt(z);
                    dateString = dateString.substr(z.length, dateString.length - z.length);
                }
                //Week
                else if (format[i] == 'W') {
                    var W = dateString[0];
                    if (parseInt(dateString[1])) {
                        W += dateString[1];
                    }
                    fo.W = parseInt(W);
                    dateString = dateString.substr(W.length, dateString.length - W.length);
                }
                //Month
                else if (format[i] == 'F') {
                    for (var k = 0, j = translator.monthFull.length; k < j; k++) {
                        var F = translator.monthFull[k]
                                , reg = new RegExp('^' + F, 'm');
                        if (reg.test(dateString)) {
                            fo.F = F;
                            dateString = dateString.substr(F.length, dateString.length - F.length);
                            break;
                        }
                    }
                } else if (format[i] == 'n') {
                    var n = dateString[0];
                    if (parseInt(dateString[1])) {
                        n += dateString[1];
                    }
                    fo.n = parseInt(n);
                    dateString = dateString.substr(n.length, dateString.length - n.length);
                } else if (format[i] == 'm') {
                    fo.m = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                } else if (format[i] == 'M') {
                    fo.M = dateString.substr(0, 3);
                    dateString = dateString.substr(3, dateString.length - 3);
                } else if (format[i] == 't') {
                    fo.t = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                }
                //Year
                else if (format[i] == 'L') {
                    fo.L = dateString.substr(0, 1);
                    dateString = dateString.substr(1, dateString.length - 1);
                } else if (format[i] == 'o') {
                    fo.o = dateString.substr(0, 4);
                    dateString = dateString.substr(4, dateString.length - 4);
                } else if (format[i] == 'Y') {
                    fo.Y = parseInt(dateString.substr(0, 4));
                    dateString = dateString.substr(4, dateString.length - 4);
                } else if (format[i] == 'y') {
                    fo.y = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                }
                //Time
                else if (format[i] == 'a') {
                    fo.a = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                } else if (format[i] == 'A') {
                    fo.A = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                } else if (format[i] == 'B') {
                    fo.B = dateString.substr(0, 3);
                    dateString = dateString.substr(3, dateString.length - 3);
                } else if (format[i] == 'g') {
                    var g = dateString[0];
                    if (parseInt(dateString[1])) {
                        g += dateString[1];
                    }
                    fo.g = parseInt(g);
                    dateString = dateString.substr(g.length, dateString.length - g.length);
                } else if (format[i] == 'G') {
                    var G = dateString[0];
                    if (parseInt(dateString[1])) {
                        G += dateString[1];
                    }
                    fo.G = parseInt(G);
                    dateString = dateString.substr(G.length, dateString.length - G.length);
                } else if (format[i] == 'h') {
                    fo.h = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                } else if (format[i] == 'H') {
                    fo.H = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                } else if (format[i] == 'i') {
                    fo.i = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                } else if (format[i] == 's') {
                    fo.s = dateString.substr(0, 2);
                    dateString = dateString.substr(2, dateString.length - 2);
                }
                //Timezone
                else if (format[i] == 'e') {
                    console.warn('Timezone ' + format[i] + ' is not supported!');
                } else if (format[i] == 'I') {
                    console.warn('Timezone ' + format[i] + ' is not supported!');
                } else if (format[i] == 'O') {
                    console.warn('Timezone ' + format[i] + ' is not supported!');
                } else if (format[i] == 'P') {
                    console.warn('Timezone ' + format[i] + ' is not supported!');
                } else if (format[i] == 'T') {
                    console.warn('Timezone ' + format[i] + ' is not supported!');
                } else if (format[i] == 'Z') {
                    console.warn('Timezone ' + format[i] + ' is not supported!');
                }
                //Full Date/Time,
                else if (format[i] == 'c') {
                    console.warn('Full Date/Time ' + format[i] + ' is not supported!');
                } else if (format[i] == 'r') {
                    console.warn('Full Date/Time ' + format[i] + ' is not supported!');
                } else if (format[i] == 'U') {
                    console.warn('Full Date/Time ' + format[i] + ' is not supported!');
                }
            } else {
                dateString = dateString.substr(1, dateString.length - 1);
            }
        }
        return fo;
    }

    DateTime.createFromFormat = function (dateString, format) {
        if (dateString === 'c') {
            return DateTime.createFromObject(new Date());
        }
        format = format || 'd/m/Y H:i:s';
        var fo = DateTime.getInfoFromFormat(dateString, format);
        var year = fo.Y ? fo.Y : 1900;
        var month = fo.m ? fo.m : fo.M ? fo.M : fo.n ? fo.n : 1;
        var date = fo.d ? fo.d : fo.j ? fo.j : 1;
        var hours = fo.H ? fo.H : fo.G ? fo.G : 0;
        var minutes = fo.i ? fo.i : 0;
        var seconds = fo.s ? fo.s : 0;
        var dateTime = new Date(year, parseInt(month) - 1, date, hours, minutes, seconds);
        return new DateTime(dateTime);
    }

    DateTime.createFromObject = function (obj) {
        var fo = (new DateTime(obj)).toObject();
        var dateTime = new Date(fo.Y, parseInt(fo.m) - 1, fo.d, fo.H || 0, fo.i || 0, fo.s || 0);
        return new DateTime(dateTime);
    }
    
    DateTime.create = function(value, format) {
        if (value instanceof Date) {
            return DateTime.createFromObject(value);
        } else if (typeof value === 'string') {
            if ('c' === value) {
                return DateTime.createFromObject(new Date());
            }
            return DateTime.createFromFormat(value, format);
        } else {
            throw 'Can\'t create DateTime object';
        }
    }
    
    DateTime.parseRelativeDate = function (relativeDate) {
        switch (relativeDate) {
            case 'c':
                return moment()
            case 'today':
                return moment()
            case 'yesterday':
                return moment().subtract(1, 'day');
            default:
                return moment().subtract(Number(relativeDate.replace("days ago", "").trim()), 'days');
        }
    }
    
    DateTime.parseInputDate = function (inputDate, format) {
        if (moment.isMoment(inputDate) || inputDate instanceof Date) {
            return moment(inputDate);
        }
        var relativeDate = inputDate.match(/c|today|yesterday|[0-9]+\s+(days ago)/);
        if (relativeDate !== null) {
            var rs = DateTime.parseRelativeDate(relativeDate[0]);
            if (format) {
                rs = moment(rs.format(format), format);
            }
            return rs;
        } else if (format) {
            return moment(inputDate, format);
        }
        return momment();
    }
    

    Nth.DateTime = DateTime;

    return DateTime;
});