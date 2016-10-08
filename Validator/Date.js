;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth', 
            'moment',
            'Nth/Validator',
            'Nth/Helper/String',
            'Nth/DateTime'
        ], factory);
    } else {
        factory(Nth, moment);
    }
})(function(Nth, moment) {
    
    var DateValidator = function (options) {
        options = $.extend({}, {
            format: 'DD/MM/YYYY', //String: accept moment javascript format only
            min: null,
            max: null,
            invalidDateFormat: '{0} không hợp lệ'
        }, options);
        options.format = this.parseFormat(options.format);
        Nth.Validator.call(this, options);
        this.errors = ['Năm', 'Tháng', 'Ngày', 'Giờ', 'Phút', 'Giây', 'Mili giây'];
        this.element = null;
    }
    
    DateValidator.prototype = Object.create(Nth.Validator.prototype);
    
    DateValidator.prototype.constructor = DateValidator;
    
    DateValidator.prototype.__CLASS__ = 'Nth.Validator.Date';
    
    DateValidator.prototype.getLeastFormatName = function () {
        var format = this.getOption('format');
        if (format.indexOf('D') > -1) {
            return 'ngày';
        }
        if (format.indexOf('M') > -1) {
            return 'tháng';
        }
        if (format.indexOf('YY') > -1) {
            return 'năm';
        }
        return 'ngày/giờ';
    }
    
    DateValidator.prototype.parseFormat = function (format) {//Support for formats in old version
        if ((format + '').match(/d|m/)) {
            if (format === 'm/Y') {
                return 'MM/YYYY';
            } else if (format === 'Y') {
                return 'YYYY';
            }
            return 'DD/MM/YYYY';
        }
        return format;
    }
    
    DateValidator.prototype.isValid = function (dateString) {
        var format = this.getOption('format');
        var strHelper = new Nth.Helper.String();
        var dt = moment(dateString, format);
        if (!dt.isValid()) {
            strHelper.setString(this.getOption('invalidDateFormat'));
            this.setMessage(strHelper.sprintf(this.errors[dt.invalidAt()]));
            return false;
        }
        var min = this.getOption('min');
        var max = this.getOption('max');
        var name = this.getElement().getValidName();
        var lfname = this.getLeastFormatName();
        if (min) {
            var dt1 = moment(dateString, format);
            var dt2 = Nth.DateTime.parseInputDate(min, format)
            if (dt1.isBefore(dt2)) {
                var cpdtName = dt2.isToday() ? 'hiện tại' : dt2.format(format);
                strHelper.setString(this.getOption('valueTooSmall'));
                this.setMessage(strHelper.sprintf(name || 'Giá trị ', lfname + ' ' + cpdtName));
                return false;
            }
        }
        if (max) {
            var dt1 = moment(dateString, format);
            var dt2 = Nth.DateTime.parseInputDate(max, format);
            if (dt1.isAfter(dt2)) {
                var cpdtName = dt2.isToday() ? lfname + ' hiện tại' : dt2.format(format);
                strHelper.setString(this.getOption('valueTooLarge'));
                this.setMessage(strHelper.sprintf(name || 'Giá trị ', lfname + ' ' + cpdtName));
                return false;
            }
        }
        return true;
    }
    
    DateValidator.prototype.onHook = function () {
        var element = this.getElement();
        var defaultValue = element.getDefaultValue();
        if (defaultValue) {
            element.setValue(defaultValue);
        }
        var inst = this;
        element.getWrapper().getNode().on('nth.fb.import-data.DateValidator', function (e, item) {
            if (item.value && !item.format) {//Support multi-format for elements in old version
                item.format = element.diagnoseFormatByValue(item.value);
                if (item.format) {
                    element.setFormat(item.format);
                }
            }
        });
        element.getWrapper().getNode().on('nth.fb.export-data.DateValidator', function (e, item) {
            item.format = inst.getOption('format');
        });
        return this;
    }
    
    DateValidator.prototype.onUnhook = function () {
        var element = this.getElement();
        element.getWrapper().getNode().off('nth.fb.export-data.DateValidator nth.fb.export-data.DateValidator');
        return this;
    }
    
    DateValidator.prototype.getSetterOptions = function () {
        var element = this.getElement();
        var fieldset = new Nth.FormBuilder.Fieldset('datev-fieldset');
        var row_1 = new Nth.FormBuilder.Row('datev-row-1', {
            parentComponent: fieldset
        });
        var row_2 = new Nth.FormBuilder.Row('datev-row-2', {
            parentComponent: fieldset
        });
        var row_3 = new Nth.FormBuilder.Row('datev-row-3', {
            parentComponent: fieldset
        });
        var col_1 = new Nth.FormBuilder.Column('datev-column-1', {
            parentComponent: row_1,
            wrapperAttributes: {
                'class': 'col-md-6'
            }
        });
        var col_2 = new Nth.FormBuilder.Column('datev-column-2', {
            parentComponent: row_2,
            wrapperAttributes: {
                'class': 'col-md-6'
            }
        });
        var col_3 = new Nth.FormBuilder.Column('datev-column-3', {
            parentComponent: row_2,
            wrapperAttributes: {
                'class': 'col-md-6'
            }
        });
        var col_4 = new Nth.FormBuilder.Column('datev-column-4', {
            parentComponent: row_3,
            wrapperAttributes: {
                'class': 'col-md-6'
            }
        });
        var col_5 = new Nth.FormBuilder.Column('datev-column-5', {
            parentComponent: row_3,
            wrapperAttributes: {
                'class': 'col-md-6'
            }
        });
        var col_6 = new Nth.FormBuilder.Column('datev-column-6', {
            parentComponent: row_1,
            wrapperAttributes: {
                'class': 'col-md-6'
            }
        });
        var formatElement = new Nth.FormBuilder.Element.Select('datev-format-option', {
            parentComponent: col_1,
            label: 'Định dạng ngày',
            selectItemData: [
                ['DD/MM/YYYY', 'Ngày/Tháng/Năm (DD/MM/YYYY)', true],
                ['MM/YYYY', 'Tháng/Năm (MM/YYYY)'],
                ['YYYY', 'Năm (YYYY)']
            ],
            value: this.getOption('format'),
            autoInit: false
        });
        var currvalueElement = new Nth.FormBuilder.Element.Checkbox('datev-current-value-option', {
            parentComponent: col_6,
            label: 'Lấy ngày hiện tại làm giá trị mặc định',
            value: 'c',
            checked: element.getDefaultValue() === 'c'
        });
        currvalueElement.getControl().getNode().on('change', function () {
            if (currvalueElement.checked()) {
                element.setDefaultValue('c').setValue('c');
            } else {
                element.setDefaultValue(null).setValue(null);
            }
        });
        var minElement = new Nth.FormBuilder.Element.Date('datev-min-option', {
            parentComponent: col_2,
            label: 'Giá trị nhỏ nhất',
            value: this.getOption('min') === 'c' ? null : this.getOption('min'),
            disabled: this.getOption('min') === 'c',
            validators: [
                new Nth.Validator.Date({format: this.getOption('format')})
            ]
        });
        var currminElement = new Nth.FormBuilder.Element.Checkbox('datev-current-min-option', {
            parentComponent: col_3,
            label: 'Lấy ngày hiện tại làm giá trị nhỏ nhất',
            value: 'c',
            checked: this.getOption('min') === 'c'
        });
        var maxElement = new Nth.FormBuilder.Element.Date('datev-max-option', {
            parentComponent: col_4,
            label: 'Giá trị lớn nhất',
            value: this.getOption('max') === 'c' ? null : this.getOption('max'),
            disabled: this.getOption('max') === 'c',
            validators: [
                new Nth.Validator.Date({format: this.getOption('format')})
            ]
        });
        var currmaxElement = new Nth.FormBuilder.Element.Checkbox('datev-current-max-option', {
            parentComponent: col_5,
            label: 'Lấy ngày hiện tại làm giá trị lớn nhất',
            value: 'c',
            checked: this.getOption('max') === 'c'
        });
        formatElement.getWrapper().getNode().on('nth.fb.bound', function () {
            minElement.getDateTimePicker().hide();
            maxElement.getDateTimePicker().hide();
            var format = formatElement.getValue();
            minElement.setFormat(format);
            maxElement.setFormat(format);
            element.setFormat(format);
        });
        formatElement.init();
        currminElement.getControl().getNode().on('change', function () {
            if (currminElement.checked()) {
                minElement.disable();
            } else {
                minElement.enable();
            }
        });
        currmaxElement.getControl().getNode().on('change', function () {
            if (currmaxElement.checked()) {
                maxElement.disable();
            } else {
                maxElement.enable();
            }
        });
        fieldset.addComponent(row_1);
        fieldset.addComponent(col_1);
        fieldset.addComponent(col_6);
        fieldset.addComponent(formatElement);
        fieldset.addComponent(currvalueElement);
        fieldset.addComponent(row_2);
        fieldset.addComponent(col_2);
        fieldset.addComponent(minElement);
        fieldset.addComponent(col_3);
        fieldset.addComponent(currminElement);
        fieldset.addComponent(row_3);
        fieldset.addComponent(col_4);
        fieldset.addComponent(maxElement);
        fieldset.addComponent(col_5);
        fieldset.addComponent(currmaxElement);
        var result = {
            subject: 'Định dạng theo kiểu ngày',
            fieldset: fieldset,
            options: function () {
                var options = {};
                options.format = formatElement.getValue();
                if (currminElement.checked()) {
                    options.min = 'c';
                } else if (minElement.getValue()) {
                    options.min = minElement.getValue();
                }
                if (currmaxElement.checked()) {
                    options.max = 'c';
                } else if (maxElement.getValue()) {
                    options.max = maxElement.getValue();
                }
                return options;
            }
        }
        return result;
    }
    
    DateValidator.prototype.toJson = function () {
        return {
            name: this.__CLASS__,
            options: {
                format: this.getOption('format'),
                min: this.getOption('min'),
                max: this.getOption('max')
            }
        }
    }
    
    Nth.Validator.Date = DateValidator;
    
    return DateValidator;
});