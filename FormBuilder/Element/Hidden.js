;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Element'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Hidden Element
     */
    var Hidden = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_hidden_',
            creatorIconClass: 'icon hidden',
            creatorLabel: 'Hidden',
            controlAttributes: {
                type: 'hidden'
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
        var $control = $('<input/>', attrs);
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
        this.hide();
    }
    
    Hidden.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Hidden.prototype.constructor = Hidden;
    
    Hidden.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Hidden';
    
    Hidden.prototype.getControl = function() {
        return this.control;
    }
    
    Hidden.prototype.setValue = function(value) {
        this.getControl().getNode().val(value);
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    Hidden.prototype.getValue = function() {
        return this.getControl().getNode().val();
    }
    
    Hidden.prototype.focus = function() {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }
    
    Hidden.prototype.blur = function() {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }
    
    Hidden.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Hidden element to DrawingBoard');
            return;
        }
        var hidden = new Hidden(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(hidden);
        hidden.inactiveOthers();
        return this;
    }
    
    Hidden.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Hidden element to DrawingBoard');
            return;
        }
        var hidden = new Hidden(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(hidden);
        hidden.inactiveOthers();
        return this;
    }
    
    Hidden.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Element.prototype.getPropertySetters.call(this);
        var propertySetter= new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getDefaultValueSetter()
            , propertySetter.getColumnReferSetter()
            , propertySetter.getElementIdSetter()
            , propertySetter.getElementNameSetter()
            , propertySetter.getElementClassSetter()
            , propertySetter.getElementStyleSetter()
            , propertySetter.getBindIndexSetter()
        ]);
        return options;
    }
    
    Hidden.prototype.isValid = function(options) {
        if (typeof options === 'function') {
            options = {done: options}
        }
        options = new Nth.Options($.extend({}, {
            start: function() {},
            done: function() {}
        }, options));
        var inst = this;
        var done = function() {
            options.getOption('done').call(inst);
            return inst;
        }
        this.hideMessage().setMessage(null);
        return done();
    }
    
    Hidden.prototype.toJson = function () {
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
    
    Hidden.__fromXml = function(xml, options) {
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
        return new Hidden(name, options);
    }
    
    Nth.FormBuilder.Element.Hidden = Hidden;
    
    return Hidden;
});