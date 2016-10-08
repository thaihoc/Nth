;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/DateTime',
            'Nth/Validator/Date',
            'Nth/FormBuilder/Element',
            'bootstrap-datetimepicker'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Date Element
     */
    var Date = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_date_',
            creatorIconClass: 'icon date',
            creatorLabel: 'Date',
            triggerHtml: '<i class="fa fa-calendar"></i>',
            controlAttributes: {
                type: 'text'
            },
            validators: [new Nth.Validator.Date()]
        }, options));
        name = this.getName();
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        var controlAttributes = this.getOption('controlAttributes', {});
        var controlId = this.getConfigParam('controlIdPrefix') + name;
        var $inputGroup = $('<div/>', { 'class': 'input-group' });
        this.inputGroup = new Nth.Dom.Node($inputGroup);
        var $control = $('<input/>', $.extend({}, {
            id: controlId,
            name: name
        }, controlAttributes));
        $control.addClass(this.getConfigParam('elementClass')).removeClass('hasDatepicker');
        this.control = new Nth.Dom.Node($control);
        var $inputGroupAddon = $('<span/>', { 'class': 'input-group-addon' }).html(this.getOption('triggerHtml'));
        this.inputGroupAddon = new Nth.Dom.Node($inputGroupAddon);
        $inputGroup.append($control, $inputGroupAddon);
        this.getWrapper().getNode().addClass(rc.getShortName().toLowerCase()).append($inputGroup);
        var labelAttributes = this.getOption('labelAttributes', {});
        if (typeof labelAttributes['for'] === 'undefined') {
            this.getLabel().getNode().attr('for', controlId);
        }
        if (this.getOption('autoInit', true)) {
            this.init();
        }
    }
    
    Date.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Date.prototype.constructor = Date;
    
    Date.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Date';
    
    Date.prototype.init = function() {
        this.initFilters().hookFilters();
        this.initValidators().hookValidators();
        var dpOptions = this.getDefaultDpOptions();
        if (dpOptions.format) {
            this.getInputGroup().getNode().datetimepicker(dpOptions);
            this.dateTimePicker = this.getInputGroup().getNode().data('DateTimePicker');
        }
        if (this.existsOption('value')) {
            this.setValue(this.getOption('value'));
        } else if (this.hasDefaultValue()) {
            this.setValue(this.getDefaultValue());
        }
        if (this.getOption('disabled')) {
            this.disable();
        } else {
            this.enableTrigger();
        }
        this.getWrapper().getNode().trigger('nth.fb.bound', [this]);
        return this;
    }
    
    Date.prototype.getControl = function() {
        return this.control;
    }
    
    Date.prototype.getInputGroup = function() {
        return this.inputGroup;
    }
    
    Date.prototype.getInputGroupAddon = function() {
        return this.inputGroupAddon;
    }
    
    Date.prototype.getDateTimePicker = function() {
        return this.dateTimePicker;
    }
    
    Date.prototype.getDefaultDpOptions = function () {
        var options = $.extend(true, {
            format: 'DD/MM/YYYY',
            showTodayButton: true,
            showClear: true,
            showClose: true,
            focusOnShow: false,
            locale: 'vi',
            allowInputToggle: false,
            useCurrent: false
        }, this.getOption('dateTimePickerOptions'));
        var datev = this.getValidator('Nth.Validator.Date');
        if (datev) {
            options.format = datev.getOption('format');
        }
        return options;
    }
    
    Date.prototype.enableTrigger = function () {
        var datepicker = this.getDateTimePicker();
        if (datepicker) {
            this.disableTrigger();
            this.getInputGroupAddon().getNode().on('click.datepicker', function() {
                datepicker.show();
            });
        }
        return this;
    }
    
    Date.prototype.disableTrigger = function () {
        var datepicker = this.getDateTimePicker();
        if (datepicker) {
            datepicker.hide();
            this.getInputGroupAddon().getNode().off('click.datepicker');
        }
        return this;
    }
    
    Date.prototype.focus = function() {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }
    
    Date.prototype.blur = function() {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }
    
    Date.prototype.enable = function () {
        this.enableTrigger();
        this.getControl().getNode().removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    Date.prototype.disable = function () {
        this.disableTrigger();
        this.getControl().getNode().attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    Date.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Date element to DrawingBoard');
            return;
        }
        var date = new Date(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(date);
        date.inactiveOthers();
        return this;
    }
    
    Date.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Date element to DrawingBoard');
            return;
        }
        var date = new Date(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(date);
        date.inactiveOthers();
        return this;
    }
    
    Date.prototype.getFormat = function () {
        var datev = this.getValidator('Nth.Validator.Date');
        if (datev) {
            return datev.getOption('format');
        }
        var dp = this.getDateTimePicker();
        if (dp) {
            return dp.options().format;
        }
        return null;
    }
    
    Date.prototype.setFormat = function (format) {
        var datev = this.getValidator('Nth.Validator.Date');
        if (datev) {
            datev.setOption('format', format);
        }
        var dp = this.getDateTimePicker();
        if (dp) {
            dp.options({format: format});
        }
        return this;
    }
    
    Date.prototype.diagnoseFormatByValue = function (value) {
        if (typeof value === 'string' && value) {
            if (value.length === 4) {
                return 'YYYY';
            }
            if (value.length > 4 && value.length < 8) {
                return 'MM/YYYY';
            }
            if (value.length > 7 && value.length < 11) {
                return 'DD/MM/YYYY';
            }
        }
        return null;
    }
    
    Date.prototype.setValue = function(value, format) {
        format = format || this.getFormat();
        value = value ? Nth.DateTime.parseInputDate(value, format) : null;
        var datepicker = this.getDateTimePicker();
        if (datepicker) {
            datepicker.date(value);
        } else {
            this.getControl().getNode().val(value ? value.format(format) : null);
        }
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    Date.prototype.getValue = function() {
        return this.getControl().getNode().val();
    }
    
    Date.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue(),
            columnRefer: this.getOption('columnRefer')
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }
    
    Date.prototype.isValid = function (options) {
        if (typeof options === 'function') {
            options = {done: options}
        }
        options = new Nth.Options($.extend({}, {
            start: function() {},
            done: function() {}
        }, options));
        this.hideMessage().setMessage(null);
        var inst = this;
        var done = function() {
            options.getOption('done').call(inst);
            return inst;
        }
        if (false === options.getOption('start').call(this)) {
            return done();
        }
        var value = this.getValue();
        var strHelper = new Nth.Helper.String();
        var validator = Nth.Validator.__getInstance();
        var validName = this.getValidName();
        if (this.getOption('required') && this.isEmpty()) {
            var requiredText = validator.getOption('retypeText');
            strHelper.setString(requiredText);
            this.setMessage(strHelper.sprintf(validName));
            return done();
        }
        if (this.isEmpty()) {
            return done();
        }
        $.each(this.getValidators(), function(i, validator) {
            if (!validator.isValid(value)) {
                inst.setMessage(validator.getMessage());
                return false;
            }
        });
        return done();
    }
    
    Date.prototype.getSupportValidators = function () {
        return {
            removable: false,
            validators: [
                {validator: new Nth.Validator.Date(), checked: true}
            ]
        }
    }
    
    Date.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Element.prototype.getPropertySetters.call(this);
        var propertySetter= new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getRequiredSetter()
            , propertySetter.getMarksMandatorySetter()
            , propertySetter.getValidatorsSetter()
            , propertySetter.getValidNameSetter()
            , propertySetter.getColumnReferSetter()
            , propertySetter.getElementIdSetter()
            , propertySetter.getElementNameSetter()
            , propertySetter.getElementClassSetter()
            , propertySetter.getElementStyleSetter()
            , propertySetter.getReadonlySetter()
            , propertySetter.getAutocompleteSetter()
            , propertySetter.getPlaceholderSetter()
            , propertySetter.getElementTitleSetter()
            , propertySetter.getBindBySetter()
            , propertySetter.getBindNameSetter()
            , propertySetter.getValidElementRequiredSetter()
            , propertySetter.getBindConstraintSetter()
            , propertySetter.getBindIndexSetter()
        ]);
        return options;
    }
    
    Date.prototype.toJson = function () {
        var json = Nth.FormBuilder.Element.prototype.toJson.call(this);
        var controlAttributes = this.getControl().getAttributes();
        if (this.isEmpty() || this.getDefaultValue()) {
            delete controlAttributes.value;
        } else {
            controlAttributes.value = this.getValue();
            delete json.options.defaultValue;
        }
        json.options.controlAttributes = controlAttributes;
        return json;
    }
    
    Date.__fromXml = function(xml, options) {
        options = $.extend({}, {
            drawingBoard: null,
            toolPalette: null,
            parentComponent: null
        }, options);
        var fb = Nth.FormBuilder.__getInstance();
        var $xml = fb.getXmlObject(xml, 'component');
        var name = $xml.attr('name');
        $xml.children('options').children('option').each(function() {
            options[$(this).attr('name')] = fb.decodeXmlData($(this).text());
        });
        options['validators'] = [
            new Nth.Validator.DateTime({
                formats: [
                    {
                        name: 'Ngày/Tháng/Năm',
                        format: 'DD/MM/YYYY',
                        isCurrent: true
                    },
                    {
                        name: 'Tháng/Năm',
                        format: 'MM/YYYY'
                    },
                    {
                        name: 'Năm',
                        format: 'YYYY'
                    }
                ]
            })
        ];
        return new Nth.FormBuilder.Element.DateTime(name, options);
    }
    
    Nth.FormBuilder.Element.Date = Date; 
    
    return Date;
});