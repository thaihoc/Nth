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
    
    var DateTime = function (options) {
        Nth.Validator.call(this, $.extend({}, {
            invalidFormat: '{0} Không hợp lệ'
        }, options));
        if (!$.isArray(this.getOption('formats'))) {
            this.setOption('formats', [
                {
                    name: 'Ngày/Tháng/Năm',
                    format: 'DD/MM/YYYY', //used as an unique key
                    defaultValue: null,
                    minValue: null,
                    maxValue: null,
                    isCurrent: true
                }
            ]);
        }
    }
    
    DateTime.prototype = Object.create(Nth.Validator.prototype);
    
    DateTime.prototype.constructor = DateTime;
    
    DateTime.prototype.__CLASS__ = 'Nth.Validator.DateTime';
    
    DateTime.prototype.getSupportFormats = function () {
        return [
            {
                name: 'Ngày/Tháng/Năm',
                format: 'DD/MM/YYYY',
                defaultValue: null,
                minValue: null,
                maxValue: null
            },
            {
                name: 'Tháng/Năm',
                format: 'MM/YYYY',
                defaultValue: null,
                minValue: null,
                maxValue: null
            },
            {
                name: 'Năm',
                format: 'YYYY',
                defaultValue: null,
                minValue: null,
                maxValue: null
            },
            {
                name: 'Ngày/Tháng/Năm Giờ:Phút',
                format: 'DD/MM/YYYY HH:mm',
                defaultValue: null,
                minValue: null,
                maxValue: null
            },
            {
                name: 'Giờ:Phút',
                format: 'HH:mm',
                defaultValue: null,
                minValue: null,
                maxValue: null
            }
        ];
    }
    
    DateTime.prototype.getInvalidName = function (at) {
        return ['Năm', 'Tháng', 'Ngày', 'Giờ', 'Phút', 'Giây', 'Mili giây'][at];
    }
    
    DateTime.prototype.getFormats = function () {
        return this.getOption('formats', []);
    }
    
    DateTime.prototype.setFormats = function (formats) {
        this.setOption('formats', formats);
        return this;
    }
    
    DateTime.prototype.getFormat = function (format, def) {
        var rs = this.getFormats().filter(function (a) {
            return a.format === format;
        });
        return rs.length === 1 ? rs[0] : def;
    }
    
    DateTime.prototype.existsFormat = function (format) {
        return !!this.getFormat(format);
    }
    
    DateTime.prototype.setFormat = function (format, option, value) {
        var options = {};
        if ($.isPlainObject(format)) {
            options = format;
        } else if (typeof format === 'string') {
            options['format'] = format;
        }
        if (option && typeof value !== 'undefined') {
            options[option] = value;
        }
        if (!$.isPlainObject(options) || !options['format']) {
            throw "options is invalid";
        }
        options = $.extend({}, this.getFormat(options.format), options);
        this.removeFormat(options.format).getFormats().push(options);
        return this;
    }
    
    DateTime.prototype.removeFormat = function (format) {
        var inst = this;
        $.each(this.getFormats(), function (i, a) {
            if (a.format === format) {
                inst.getFormats().splice(i, 1);
                return false;
            }
        });
        return this;
    }
    
    DateTime.prototype.getCurrentFormat = function () {
        var formats = this.getFormats();
        var rs = formats.filter(function (a) {
            return a.isCurrent;
        });
        return rs.length === 1 ? rs[0] : formats[0];
    }
    
    DateTime.prototype.setCurrentFormat = function (format) {
        if (this.existsFormat(format)) {
            $.each(this.getFormats(), function (i, a) {
                a.isCurrent = a.format === format ? true : false;
            });
        } else if (typeof format === 'string') {
            this.setFormat({
                name: format,
                format: format,
                isCurrent: true
            });
        } else if ($.isPlainObject(format)) {
            this.setFormat(format);
        }
        return this;
    }
    
    DateTime.prototype.isValid = function (dateString) {
        var options = this.getCurrentFormat();
        var strHelper = new Nth.Helper.String();
        var dt = moment(dateString, options.format);
        if (!dt.isValid()) {
            strHelper.setString(this.getOption('invalidFormat'));
            this.setMessage(strHelper.sprintf(this.getInvalidName[dt.invalidAt()]));
            return false;
        }
        var name = this.getElement() ? this.getElement().getValidName() : options.name;
        if (options.minValue) {
            var dt1 = moment(dateString, options.format);
            var dt2 = Nth.DateTime.parseInputDate(options.minValue, options.format)
            if (dt1.isBefore(dt2)) {
                strHelper.setString(this.getOption('valueTooSmall'));
                this.setMessage(strHelper.sprintf(name, dt2.format(options.format)));
                return false;
            }
        }
        if (options.maxValue) {
            var dt1 = moment(dateString, options.format);
            var dt2 = Nth.DateTime.parseInputDate(options.maxValue, options.format);
            if (dt1.isAfter(dt2)) {
                strHelper.setString(this.getOption('valueTooLarge'));
                this.setMessage(strHelper.sprintf(name, dt2.format(options.format)));
                return false;
            }
        }
        return true;
    }
    
    DateTime.prototype.onHook = function () {
        var inst = this;
        var element = this.getElement();
        element.getWrapper().getNode().on('nth.fb.import-data.DateTime', function (e, item) {
            inst.setCurrentFormat(item.format);
        });
        element.getWrapper().getNode().on('nth.fb.export-data.DateTime', function (e, item) {
            item.format = inst.getCurrentFormat().format;
        });
        return this;
    }
    
    DateTime.prototype.onUnhook = function () {
        this.getElement().getWrapper().getNode().off('nth.fb.export-data.DateTime nth.fb.export-data.DateTime');
        return this;
    }
    
    DateTime.prototype.getSetterOptions = function () {
        var inst = this;
        var fieldset = new Nth.FormBuilder.Fieldset(true, {
            componentNamePrefix: 'fs-datetimev'
        });
        var $panelGroup = $('<div/>', {
            role: "tablist",
            'class': "panel-group", 
            'aria-multiselectable': true
        }).appendTo(fieldset.getDomNode());
        $.each(this.getSupportFormats(), function (i, options) {
            var set = inst.getFormat(options.format, {});
            var $panel = $('<div/>', {'class': 'panel panel-default'}).appendTo($panelGroup);
            var $panelHeading = $('<div/>', {
                'class': 'panel-heading',
                 role: "tab",
                 id: "heading" + i
            }).appendTo($panel);
            var row_1 = new Nth.FormBuilder.Row(true, {
                parentComponent: fieldset,
                addingRelative: $panelHeading
            });
            var col_1 = new Nth.FormBuilder.Column(true, {
                parentComponent: row_1,
                wrapperAttributes: {
                    'class': 'col-xs-7'
                }
            });
            var col_2 = new Nth.FormBuilder.Column(true, {
                parentComponent: row_1,
                wrapperAttributes: {
                    'class': 'col-xs-5 text-right'
                }
            });
            var include = new Nth.FormBuilder.Element.Checkbox(i + '-include', {
                parentComponent: col_1,
                label: options.name,
                value: options.format,
                checked: set.format
            });
            include.getLabel().getNode().css('margin', 0);
            include.getWrapper().getNode().css({margin: 0, 'font-size': '13px'});
            var $collapseTrigger = $('<a/>', {
                href: "#collapse" + i,
                role: "button",
                style: 'font-size:13px;' + (set.format ? '' : 'display:none'),
                'data-toggle': "collapse",
                'aria-expanded': "true",
                'aria-controls': "collapse" + i
            }).html('<i class="fa fa-gear"></i>').appendTo(col_2.getDomNode());
            if (set.isCurrent) {
                col_2.getDomNode().prepend('<em>(mặc định)&nbsp;&nbsp;</em>');
            }
            var $collapseWrapper = $('<div/>', {
                id: "collapse" + i,
                role: "tabpanel",
                'class': "panel-collapse collapse",
                'data-toggle': false,
                'aria-labelledby': "heading" + i
            }).appendTo($panel);
            var $panelBody = $('<div/>', {'class': 'panel-body'}).appendTo($collapseWrapper);
            var row_2 = new Nth.FormBuilder.Row(true, {
                parentComponent: fieldset,
                addingRelative: $panelBody
            });
            var col_3 = new Nth.FormBuilder.Column(true, {
                parentComponent: row_2,
                wrapperAttributes: {
                    'class': 'col-md-6'
                }
            });
            var col_4 = new Nth.FormBuilder.Column(true, {
                parentComponent: row_2,
                wrapperAttributes: {
                    'class': 'col-md-6'
                }
            });
            var setAsCurrent = new Nth.FormBuilder.Element.Radio(i + '-set-as-current', {
                parentComponent: col_4,
                label: 'Sử dụng mặc định',
                controlAttributes: {
                    name: 'dtv-option-set-as-current'
                },
                checked: set.isCurrent
            });
            setAsCurrent.getControl().getNode().on('change', function () {
                $panelGroup.find('.panel-heading em').remove();
                if (setAsCurrent.checked()) {
                    col_2.getDomNode().prepend('<em>(mặc định)&nbsp;&nbsp;</em>');
                }
            });
            var defaultValue = new Nth.FormBuilder.Element.DateTime(i + '-default-value', {
                parentComponent: col_3,
                label: 'Giá trị mặc định',
                formats: [{format: options.format}],
                value: set.defaultValue,
                disabled: set.defaultValue === 'today'
            });
            var currentValueAsDefault = new Nth.FormBuilder.Element.Checkbox(i + '-current-value-as-default', {
                parentComponent: col_4,
                label: 'Lấy thời gian hiện tại làm giá trị mặc định',
                value: 'today',
                checked: set.defaultValue === 'today'
            });
            currentValueAsDefault.getControl().getNode().on('change', function () {
                if (currentValueAsDefault.checked()) {
                    defaultValue.disable();
                } else {
                    defaultValue.enable();
                }
            });
            var minValue = new Nth.FormBuilder.Element.DateTime(i + '-min-value', {
                parentComponent: col_3,
                label: 'Giá trị nhỏ nhất',
                formats: [{format: options.format}],
                value: set.minValue,
                disabled: set.minValue === 'today'
            });
            var currentValueAsMin = new Nth.FormBuilder.Element.Checkbox(i + '-current-value-as-min', {
                parentComponent: col_4,
                label: 'Lấy thời gian hiện tại làm giá trị nhỏ nhất',
                value: 'today',
                checked: set.minValue === 'today'
            });
            currentValueAsMin.getControl().getNode().on('change', function () {
                if (currentValueAsMin.checked()) {
                    minValue.disable();
                } else {
                    minValue.enable();
                }
            });
            var maxValue = new Nth.FormBuilder.Element.DateTime(i + '-max-value', {
                parentComponent: col_3,
                label: 'Giá trị lớn nhất',
                formats: [{format: options.format}],
                value: set.maxValue,
                disabled: set.maxValue === 'today'
            });
            var currentValueAsMax = new Nth.FormBuilder.Element.Checkbox(i + '-current-value-as-max', {
                parentComponent: col_4,
                label: 'Lấy thời gian hiện tại làm giá trị lớn nhất',
                value: 'today',
                checked: set.maxValue === 'today'
            });
            currentValueAsMax.getControl().getNode().on('change', function () {
                if (currentValueAsMax.checked()) {
                    maxValue.disable();
                } else {
                    maxValue.enable();
                }
            });
            include.getControl().getNode().on('change', function () {
                if (include.checked()) {
                    $collapseTrigger.show();
                } else {
                    $collapseTrigger.hide();
                    $collapseWrapper.collapse('hide');
                    row_2.reset(function () {
                        if (this.is('Radio') || this.is('Checkbox')) {
                            this.setOption('checked', false);
                        }
                    });
                    col_2.getDomNode().children('em').remove();
                }
            });
            fieldset.addComponent(row_1, row_2);
            fieldset.addComponent(col_1, col_2, col_3, col_4);
            fieldset.addComponent(include);
            fieldset.addComponent(setAsCurrent);
            fieldset.addComponent(defaultValue);
            fieldset.addComponent(currentValueAsDefault);
            fieldset.addComponent(minValue);
            fieldset.addComponent(currentValueAsMin);
            fieldset.addComponent(maxValue);
            fieldset.addComponent(currentValueAsMax);
        });
        return {
            subject: 'Định dạng theo kiểu ngày/giờ',
            fieldset: fieldset,
            beforeSave: function () {
                var result = true;
                fieldset.isValid(function () {
                    if (this.hasMessage()) {
                        result = false;
                        return this.showMessage();
                    }
                    var formats = [];
                    var prefix = fieldset.getConfigParam('componentNamePrefix');
                    $.each(inst.getSupportFormats(), function (i) {
                        var include = fieldset.getComponent(prefix + i + '-include');
                        var setAsCurrent = fieldset.getComponent(prefix + i + '-set-as-current');
                        var defaultValue = fieldset.getComponent(prefix + i + '-default-value');
                        var currentValueAsDefault = fieldset.getComponent(prefix + i + '-current-value-as-default');
                        var minValue = fieldset.getComponent(prefix + i + '-min-value');
                        var currentValueAsMin = fieldset.getComponent(prefix + i + '-current-value-as-min');
                        var maxValue = fieldset.getComponent(prefix + i + '-max-value');
                        var currentValueAsMax = fieldset.getComponent(prefix + i + '-current-value-as-max');
                        if (include.checked()) {
                            formats.push({
                                name: include.getLabelOption(),
                                format: include.getValue(),
                                isCurrent: setAsCurrent.checked(),
                                defaultValue: currentValueAsDefault.checked() ? currentValueAsDefault.getValue() : defaultValue.getValue(),
                                minValue: currentValueAsMin.checked() ? currentValueAsMin.getValue() : minValue.getValue(),
                                maxValue: currentValueAsMax.checked() ? currentValueAsMax.getValue() : maxValue.getValue()
                            });
                        }
                    });
                    if (formats.length === 0) {
                        fieldset.setMessage('Bạn phải chọn ít nhất 1 định dạng.');
                        fieldset.showMessage();
                        result = false;
                    } else {
                        inst.setOption('formats', formats);
                    }
                });                
                return result;
            }
        }
    }
    
    DateTime.prototype.toJson = function () {
        return {
            name: this.__CLASS__,
            options: {
                formats: this.getFormats()
            }
        }
    }
    
    Nth.Validator.DateTime = DateTime;
    
    return DateTime;
});