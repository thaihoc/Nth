;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/Alert',
            'Nth/Helper/Number',
            'Nth/Filter/StringToUpper',
            'Nth/Validator/Number',
            'Nth/Validator/Cmnd',
            'Nth/Validator/PhoneNumber',
            'Nth/Validator/EmailAddress',
            'Nth/Validator/Cdpwd',
            'Nth/Validator/Unit',
            'Nth/FormBuilder/Element'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Text Element
     */
    var Text = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_text_',
            creatorIconClass: 'icon text',
            creatorLabel: 'Text',
            controlAttributes: {
                type: 'text'
            }
        }, options));
        name = this.getName();
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        var controlAttributes = this.getOption('controlAttributes', {});
        var controlId = this.getConfigParam('controlIdPrefix') + name;
        var attrs = $.extend({}, {
            id: controlId,
            name: name,
            'class': this.getConfigParam('elementClass')
        }, controlAttributes);
        var autocomplete = attrs['autocomplete'];
        autocomplete && delete attrs['autocomplete'];
        var $control = $('<input/>', attrs);
        autocomplete && $control.attr('autocomplete', autocomplete);
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
        if (this.getOption('autoInit', true)) {
            this.init();
        }
        if (this.getOption('disabled')) {
            this.disable();
        }
    }
    
    Text.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Text.prototype.constructor = Text;
    
    Text.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Text';
    
    Text.prototype.init = function() {
        this.initFilters().hookFilters();
        this.initValidators().hookValidators();
        this.getWrapper().getNode().trigger('nth.fb.bound', [this]);
        return this;
    }
    
    Text.prototype.getSupportFilters = function () {
        return {
            removable: true,
            filters: [
                {filter: new Nth.Filter.StringToUpper()}
            ]
        }
    }
    
    Text.prototype.enable = function () {
        this.getControl().getNode().removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    Text.prototype.disable = function () {
        this.getControl().getNode().attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    Text.prototype.getControl = function() {
        return this.control;
    }
    
    Text.prototype.setValue = function(value) {
        this.getControl().getNode().val(value);
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    Text.prototype.getValue = function() {
        return this.getControl().getNode().val();
    }
    
    Text.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue(),
            columnRefer: this.getOption('columnRefer')
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }
    
    Text.prototype.focus = function() {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }
    
    Text.prototype.blur = function() {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }
    
    Text.prototype.enable = function () {
        this.getWrapper().getNode().removeClass('disabled');
        this.getControl().getNode().removeAttr('disabled');
        return this;
    }
    
    Text.prototype.disable = function () {
        this.getWrapper().getNode().addClass('disabled');
        this.getControl().getNode().attr('disabled', 'disabled');
        return this;
    }
    
    Text.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Text element to DrawingBoard');
            return;
        }
        var text = new Text(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(text);
        text.inactiveOthers();
        return this;
    }
    
    Text.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Text element to DrawingBoard');
            return;
        }
        var text = new Text(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(text);
        text.inactiveOthers();
        return this;
    }
    
    Text.prototype.getSupportValidators = function () {
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
    
    Text.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Element.prototype.getPropertySetters.call(this);
        var propertySetter= new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getTypeSetter()
            , propertySetter.getDefaultValueSetter()
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
            , propertySetter.getAutocompleteSetter()
            , propertySetter.getPlaceholderSetter()
            , propertySetter.getElementTitleSetter()
            , propertySetter.getBindBySetter()
            , propertySetter.getBindNameSetter()
            , propertySetter.getAuthElementSetter()
            , propertySetter.getValidElementRequiredSetter()
            , propertySetter.getBindIndexSetter()
        ]);
        return options;
    }
    
    Text.prototype.toJson = function () {
        var json = Nth.FormBuilder.Element.prototype.toJson.call(this);
        var controlAttributes = this.getControl().getAttributes();
        if (this.isEmpty() || this.hasDefaultValue()) {
            delete controlAttributes.value;
        } else {
            controlAttributes.value = this.getValue();
            delete json.options.defaultValue;
        }
        json.options.controlAttributes = controlAttributes;
        return json;
    }
    
    Text.__fromXml = function(xml, options) {
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
        return new Text(name, options);
    }
    
    Nth.FormBuilder.Element.Text = Text;
    
    return Text;
});