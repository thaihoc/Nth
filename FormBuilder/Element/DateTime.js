;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/DateTime',
            'Nth/Validator/DateTime',
            'Nth/FormBuilder/Element',
            'bootstrap-datetimepicker'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * DateTime Element
     * Support multi-format, time formats
     */
    var DateTime = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_datetime_',
            creatorIconClass: 'icon date',
            creatorLabel: 'DateTime',
            triggerHtml: '<i class="fa fa-calendar"></i>',
            controlAttributes: {
                type: 'text'
            }
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
        $control.addClass(this.getConfigParam('elementClass'));
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
    
    DateTime.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    DateTime.prototype.constructor = DateTime;
    
    DateTime.prototype.__CLASS__ = 'Nth.FormBuilder.Element.DateTime';
    
    DateTime.prototype.init = function() {
        var inst = this;
        this.initFilters().hookFilters();
        this.initValidators();
        if (!this.hasValidator('Nth.Validator.DateTime')) {            
            this.setValidator(new Nth.Validator.DateTime({
                formats: this.getOption('formats')
            }));
        }
        this.getInputGroup().getNode().datetimepicker(this.getDefaultDpOptions());
        this.dateTimePicker = this.getInputGroup().getNode().data('DateTimePicker');
        this.hookValidators();
        this.createFormatDropdown();
        if (this.existsOption('value')) {
            this.setValue(this.getOption('value'));
        } else if (this.hasDefaultValue()) {
            this.setValue(this.getDefaultValue());
        }
        if (this.getOption('disabled')) {
            this.disable();
        }
        this.getWrapper().getNode().trigger('nth.fb.bound', [this]);
        this.getWrapper().getNode().on('nth.fb.import-data.myself', function (e, item) {
            if (!item.format || typeof item.format !== 'string') {
                if (item.value.length === 4) {
                    item.format = 'YYYY';
                } else if (item.value.length === 7) {
                    item.format = 'MM/YYYY';
                } else {
                    item.format = 'DD/MM/YYYY';
                }
            }
            inst.setCurrentFormat(item.format);
        });
        return this;
    }
    
    DateTime.prototype.getControl = function() {
        return this.control;
    }
    
    DateTime.prototype.getInputGroup = function() {
        return this.inputGroup;
    }
    
    DateTime.prototype.getInputGroupAddon = function() {
        return this.inputGroupAddon;
    }
    
    DateTime.prototype.getDateTimePicker = function() {
        return this.dateTimePicker;
    }
    
    DateTime.prototype.getFormatDropdown = function () {
        return this.formatDropdown;
    }
    
    DateTime.prototype.createFormatDropdown = function () {
        var inst = this;
        var $ipgrp = $('<div/>', {'class': 'input-group-btn'});
        var $button = $('<button/>', {
            type: "button",
            'class': "btn btn-default dropdown-toggle",
            'data-toggle': "dropdown",
            'aria-haspopup': true,
            'aria-expanded': false
        }).html('<span class="caret"></span>');
        var $dropdown = $('<ul/>', {'class': "dropdown-menu"});
        var formats = this.getFormats();
        var cf = this.getCurrentFormat();
        $.each(formats, function (i, options) {
            var $li = $('<li/>').data('options', options);
            var $a = $('<a/>', {href: '#'}).on('click.dateTimePicker', function (e) {
                e.preventDefault();
                inst.setDefaultValue(options.defaultValue);
                inst.setCurrentFormat(options.format);
            }).html(options.name);
            if (options.format === cf.format) {
                inst.setDefaultValue(options.defaultValue);
            }
            $dropdown.append($li.append($a));
        });
        $ipgrp.on('shown.bs.dropdown', function () {
            var cf = inst.getCurrentFormat();
            $dropdown.children('li').each(function () {
                var options = $(this).data('options');
                if (cf.format === options.format) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            });
        });
        if (formats.length < 2) {
            $ipgrp.hide();
        }
        this.formatDropdown = new Nth.Dom.Node($ipgrp);
        this.getInputGroup().getNode().prepend($ipgrp.append($button, $dropdown));
        return this;
    }
    
    DateTime.prototype.getDefaultDpOptions = function () {
        var options = $.extend(true, {
            format: this.getCurrentFormat().format,
            showTodayButton: true,
            showClear: true,
            showClose: true,
            focusOnShow: false,
            locale: 'vi',
            allowInputToggle: false,
            useCurrent: false
        }, this.getOption('dateTimePickerOptions'));
        return options;
    }
    
    DateTime.prototype.focus = function() {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }
    
    DateTime.prototype.blur = function() {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }
    
    DateTime.prototype.enable = function () {
        this.getControl().getNode().removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    DateTime.prototype.disable = function () {
        this.getDateTimePicker().hide();
        this.getControl().getNode().attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    DateTime.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add DateTime element to DrawingBoard');
            return;
        }
        var date = new DateTime(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(date);
        date.inactiveOthers();
        return this;
    }
    
    DateTime.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone DateTime element to DrawingBoard');
            return;
        }
        var date = new DateTime(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(date);
        date.inactiveOthers();
        return this;
    }
    
    DateTime.prototype.getCurrentFormat = function () {
        return this.getValidator('Nth.Validator.DateTime').getCurrentFormat();
    }
    
    DateTime.prototype.setCurrentFormat = function (format) {
        this.getValidator('Nth.Validator.DateTime').setCurrentFormat(format);
        this.getDateTimePicker().hide().options({format: format});
        return this;
    }
    
    DateTime.prototype.setFormats = function (formats) {
        if (!$.isArray(formats)) {
            throw "formats must be an array";
        }
        this.getValidator('Nth.Validator.DateTime').setFormats(formats);
        this.createFormatDropdown();
        return this;
    }
    
    DateTime.prototype.getFormats = function () {
        return this.getValidator('Nth.Validator.DateTime').getFormats();
    }
    
    DateTime.prototype.getFormat = function (format) {
       return this.getValidator('Nth.Validator.DateTime').getFormat(format); 
    }
    
    DateTime.prototype.setValue = function(value) {
        if (value) {
            var options = this.getCurrentFormat();
            value = Nth.DateTime.parseInputDate(value, options.format);
        }
        this.getDateTimePicker().date(value);
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    DateTime.prototype.getValue = function() {
        return this.getControl().getNode().val();
    }
    
    DateTime.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue(),
            columnRefer: this.getOption('columnRefer')
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }
    
    DateTime.prototype.isValid = function (options) {
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
        var validator = this.getValidator('Nth.Validator.DateTime');
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
        if (!validator.isValid(value)) {
            inst.setMessage(validator.getMessage());
            return false;
        }
        return done();
    }
    
    DateTime.prototype.getSupportValidators = function () {
        return {
            removable: false,
            validators: [
                {validator: new Nth.Validator.DateTime(), checked: true}
            ]
        }
    }
    
    DateTime.prototype.getPropertySetters = function() {
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
    
    DateTime.prototype.toJson = function () {
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
    
    DateTime.__fromXml = function(xml, options) {
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
        return new DateTime(name, options);
    }
    
    Nth.FormBuilder.Element.DateTime = DateTime; 
    
    return DateTime;
});