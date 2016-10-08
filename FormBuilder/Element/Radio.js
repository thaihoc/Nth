;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Element'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Radio Element
     * Support jQuery iCheck plugin
     */
    var Radio = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_radio_',
            creatorIconClass: 'icon radio',
            creatorLabel: 'Radio',
            controlAttributes: {
                type: 'radio'
            }
        }, options));
        name = this.getName();
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        var controlAttributes = this.getOption('controlAttributes', {});
        var controlId = this.getConfigParam('controlIdPrefix') + name;
        var $control = $('<input/>', $.extend({}, {
            id: controlId,
            name: name
        }, controlAttributes));
        $control.addClass(this.getConfigParam('elementClass') + ' simple');
        this.control = new Nth.Dom.Node($control);
        var labelAttributes = this.getOption('labelAttributes', {});
        if (labelAttributes['for'] === undefined) {
            this.getLabel().getNode().attr('for', controlId);
        }
        this.getWrapper().getNode().addClass(rc.getShortName().toLowerCase()).prepend($control);
        if (typeof $().iCheck === 'function') {
            $control.iCheck(this.getiCheckOptions());
            $control.on('ifChanged', function () {
                $(this).trigger('change');
            });
        }
        if (this.existsOption('value')) {
            this.setValue(this.getOption('value'));
        }
        if (this.getOption('checked')) {
            this.check();
        }
        if (this.getOption('disabled')) {
            this.disable();
        }
    }
    
    Radio.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Radio.prototype.constructor = Radio;
    
    Radio.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Radio';
    
    Radio.prototype.getValue = function() {
        return this.getControl().getNode().val();
    }
    
    Radio.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue(),
            columnRefer: this.getOption('columnRefer'),
            checked: this.checked()
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }
    
    Radio.prototype.setValue = function(value) {
        this.getControl().getNode().val(value);
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    Radio.prototype.enable = function () {
        this.getControl().getNode().removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    Radio.prototype.disable = function () {
        this.getControl().getNode().attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    Radio.prototype.isEmpty = function() {
        return !this.checked();
    }
    
    Radio.prototype.checked = function() {
        return this.getControl().getNode().prop('checked');
    }
    
    Radio.prototype.check = function() {
        var $control = this.getControl().getNode();
        if ($control.data('iCheck')) {
            $control.iCheck('check');
        } else {
            $control.prop('checked', true).attr('checked', true);
        }
        return this;
    }
    
    Radio.prototype.uncheck = function() {
        var $control = this.getControl().getNode();
        if ($control.data('iCheck')) {
            $control.iCheck('uncheck');
        } else {
            $control.prop('checked', false).removeAttr('checked');
        }
        return this;
    }
    
    Radio.prototype.getiCheckOptions = function() {
        return this.getOption('iCheckOptions', {
            checkboxClass: 'icheckbox_minimal',
            radioClass: 'iradio_minimal'
        });
    }
    
    Radio.prototype.reset = function() {
        if (this.getOption('checked')) {
            this.check();
        } else {
            this.uncheck();
        }
        return this;
    }
    
    Radio.prototype.getControl = function() {
        return this.control;
    }
    
    Radio.prototype.focus = function() {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }
    
    Radio.prototype.blur = function() {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }
    
    Radio.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Radio element to DrawingBoard');
            return;
        }
        var radio = new Radio(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(radio);
        radio.inactiveOthers();
        return this;
    }
    
    Radio.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Radio element to DrawingBoard');
            return;
        }
        var radio = new Radio(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(radio);
        radio.inactiveOthers();
        return this;
    }
    
    Radio.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Element.prototype.getPropertySetters.call(this);
        var propertySetter= new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getValueSetter()
            , propertySetter.getCheckedSetter()
            , propertySetter.getRequiredSetter()
            , propertySetter.getMarksMandatorySetter()
            , propertySetter.getValidNameSetter()
            , propertySetter.getColumnReferSetter()
            , propertySetter.getElementIdSetter()
            , propertySetter.getElementNameSetter()
            , propertySetter.getElementClassSetter()
            , propertySetter.getElementStyleSetter()
            , propertySetter.getElementTitleSetter()
            , propertySetter.getBindNameSetter()
            , propertySetter.getBindIndexSetter()
        ]);
        return options;
    }
    
    Radio.prototype.toJson = function () {
        var json = Nth.FormBuilder.Element.prototype.toJson.call(this);
        var controlAttributes = this.getControl().getAttributes();
        if (this.checked()) {
            controlAttributes.checked = true;
        } else {
            delete controlAttributes.checked;
        }
        json.options.controlAttributes = controlAttributes;
        return json;
    }
    
    Radio.__fromXml = function(xml, options) {
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
        return new Radio(name, options);
    }
    
    Nth.FormBuilder.Element.Radio = Radio;
    
    return Radio;
});