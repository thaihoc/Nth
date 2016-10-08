;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Element'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Textarea Element
     */
    var Textarea = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_textarea_',
            creatorIconClass: 'icon textarea',
            creatorLabel: 'Textarea'
        }, options));
        name = this.getName();
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        var controlAttributes = this.getOption('controlAttributes', {});
        var controlId = this.getConfigParam('controlIdPrefix') + name;
        var $control = $('<textarea/>', $.extend({}, {
            id: controlId,
            name: name,
            'class': this.getConfigParam('elementClass')
        }, controlAttributes));
        this.control = new Nth.Dom.Node($control);
        var labelAttributes = this.getOption('labelAttributes', {});
        if (labelAttributes['for'] === undefined) {
            this.getLabel().getNode().attr('for', controlId);
        }
        this.getWrapper().getNode().addClass(rc.getShortName().toLowerCase()).append($control);
        if (this.existsOption('value')) {
            this.setValue(this.getOption('value'));
        } else if (this.hasDefaultValue()) {
            this.setValue(this.getDefaultValue());
        }
        this.getWrapper().getNode().trigger('nth.fb.bound', [this]);
        if (this.getOption('autoInit', true)) {
            this.init();
        }
        if (this.getOption('disabled')) {
            this.disable();
        }
    }
    
    Textarea.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Textarea.prototype.constructor = Textarea;
    
    Textarea.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Textarea';
    
    Textarea.prototype.init = function() {
        this.initFilters().hookFilters();
        this.initValidators().hookValidators();
        this.getWrapper().getNode().trigger('nth.fb.bound', [this]);
        return this;
    }
    
    Textarea.prototype.getSupportFilters = function () {
        return {
            removable: true,
            filters: [
                {filter: new Nth.Filter.StringToUpper()}
            ]
        }
    }
    
    Textarea.prototype.enable = function () {
        this.getControl().getNode().removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    Textarea.prototype.disable = function () {
        this.getControl().getNode().attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    Textarea.prototype.getControl = function() {
        return this.control;
    }
    
    Textarea.prototype.setValue = function(value) {
        this.getControl().getNode().val(value);
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    Textarea.prototype.getValue = function() {
        return this.getControl().getNode().val();
    }
    
    Textarea.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue(),
            columnRefer: this.getOption('columnRefer')
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }
    
    Textarea.prototype.focus = function() {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }
    
    Textarea.prototype.blur = function() {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }
    
    Textarea.prototype.enable = function () {
        this.getWrapper().getNode().removeClass('disabled');
        this.getControl().getNode().removeAttr('disabled');
        return this;
    }
    
    Textarea.prototype.disable = function () {
        this.getWrapper().getNode().addClass('disabled');
        this.getControl().getNode().attr('disabled', 'disabled');
        return this;
    }
    
    Textarea.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Textarea element to DrawingBoard');
            return;
        }
        var textarea = new Textarea(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(textarea);
        textarea.inactiveOthers();
        return this;
    }
    
    Textarea.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Textarea element to DrawingBoard');
            return;
        }
        var textarea = new Textarea(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(textarea);
        textarea.inactiveOthers();
        return this;
    }
    
    Textarea.prototype.getSupportValidators = function () {
        return {
            removable: true,
            validators: [
                {validator: new Nth.Validator.Cmnd()},
                {validator: new Nth.Validator.EmailAddress()},
                {validator: new Nth.Validator.Number()},
                {validator: new Nth.Validator.PhoneNumber()},
                {validator: new Nth.Validator.Unit()}
            ]
        }
    }
    
    Textarea.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Element.prototype.getPropertySetters.call(this);
        var propertySetter= new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getDefaultValueSetter()
            , propertySetter.getRequiredSetter()
            , propertySetter.getMarksMandatorySetter()
            , propertySetter.getFiltersSetter()
            , propertySetter.getValidatorsSetter()
            , propertySetter.getValidNameSetter()
            , propertySetter.getColumnReferSetter()
            , propertySetter.getElementIdSetter()
            , propertySetter.getElementNameSetter()
            , propertySetter.getElementClassSetter()
            , propertySetter.getElementStyleSetter()
            , propertySetter.getDisabledSetter()
            , propertySetter.getReadonlySetter()
            , propertySetter.getPlaceholderSetter()
            , propertySetter.getElementTitleSetter()
            , propertySetter.getBindBySetter()
            , propertySetter.getBindNameSetter()
            , propertySetter.getValidElementRequiredSetter()
            , propertySetter.getBindIndexSetter()
        ]);
        return options;
    }
    
    Textarea.prototype.toJson = function () {
        var json = Nth.FormBuilder.Element.prototype.toJson.call(this);
        if (this.isEmpty() || this.hasDefaultValue()) {
            delete json.options.value;
        } else {
            json.options.value = this.getValue();
            delete json.options.defaultValue;
        }
        json.options.controlAttributes = this.getControl().getAttributes();
        return json;
    }
    
    Textarea.__fromXml = function(xml, options) {
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
        return new Textarea(name, options);
    }
    
    Nth.FormBuilder.Element.Textarea = Textarea;
    
    return Textarea;
});