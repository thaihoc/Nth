;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Element'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Checkbox Element
     * Support jQuery iCheck plugin
     */
    var Checkbox = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            bindName: '',
            columnRefer: null,
            idPrefix: '_checkbox_',
            creatorIconClass: 'icon checkbox',
            creatorLabel: 'Checkbox',
            controlAttributes: {
                type: 'checkbox'
            }
        }, options));
        name = this.getName();
        var inst = this;
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
        if (this.existsOption('value')) {
            this.setValue(this.getOption('value'));
        }
        if (typeof $().iCheck === 'function') {
            $control.iCheck(inst.getiCheckOptions());
            $control.on('ifChanged', function () {
                $(this).trigger('change');
            });
        }
        if (this.getOption('checked')) {
            this.check();
        }
        if (this.getOption('disabled')) {
            this.disable();
        }
    }
    
    Checkbox.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Checkbox.prototype.constructor = Checkbox;
    
    Checkbox.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Checkbox';
    
    Checkbox.prototype.getControl = function() {
        return this.control;
    }
    
    Checkbox.prototype.getValue = function() {
        return this.getControl().getNode().val();
    }
    
    Checkbox.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue(),
            columnRefer: this.getOption('columnRefer'),
            checked: this.checked()
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }
    
    Checkbox.prototype.setValue = function(value) {
        this.getControl().getNode().val(value);
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    Checkbox.prototype.enable = function () {
        this.getControl().getNode().removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    Checkbox.prototype.disable = function () {
        this.getControl().getNode().attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    Checkbox.prototype.isEmpty = function() {
        return !this.checked();
    }
    
    Checkbox.prototype.checked = function() {
        return this.getControl().getNode().prop('checked');
    }
    
    Checkbox.prototype.check = function() {
        var $control = this.getControl().getNode();
        if ($control.data('iCheck')) {
            $control.iCheck('check');
        } else {
            $control.prop('checked', true).attr('checked', true);
        }
        return this;
    }
    
    Checkbox.prototype.uncheck = function() {
        var $control = this.getControl().getNode();
        if ($control.data('iCheck')) {
            $control.iCheck('uncheck');
        } else {
            $control.prop('checked', false).removeAttr('checked');
        }
        return this;
    }
    
    Checkbox.prototype.getiCheckOptions = function() {
        return this.getOption('iCheckOptions', {
            checkboxClass: 'icheckbox_minimal',
            radioClass: 'iradio_minimal'
        });
    }
    
    Checkbox.prototype.reset = function() {
        if (this.getOption('checked')) {
            this.check();
        } else {
            this.uncheck();
        }
        return this;
    }
    
    Checkbox.prototype.focus = function() {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }
    
    Checkbox.prototype.blur = function() {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }
    
    Checkbox.prototype.isValid = function (options) {
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
        var strHelper = new Nth.Helper.String();
        var validator = Nth.Validator.__getInstance();
        var validName = this.getValidName();
        if (this.getOption('required') && this.isEmpty()) {
            var requiredText = validator.getOption('reselectText');
            strHelper.setString(requiredText);
            this.setMessage(strHelper.sprintf(validName));
            return done();
        }
        return done();
    }
    
    Checkbox.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Checkbox element to DrawingBoard');
            return;
        }
        var checkbox = new Checkbox(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(checkbox);
        checkbox.inactiveOthers();
        return this;
    }
    
    Checkbox.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Checkbox element to DrawingBoard');
            return;
        }
        var checkbox = new Checkbox(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(checkbox);
        checkbox.inactiveOthers();
        return this;
    }
    
    Checkbox.prototype.getPropertySetters = function() {
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
    
    Checkbox.prototype.toJson = function () {
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
    
    Checkbox.__fromXml = function(xml, options) {
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
        return new Checkbox(name, options);
    }
    
    Nth.FormBuilder.Element.Checkbox = Checkbox;
    
    return Checkbox;
});