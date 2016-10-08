;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Element'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Label Element
     */
    var Label = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_label_',
            creatorIconClass: 'icon label',
            creatorLabel: 'Label'
        }, options));
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        this.getWrapper().getNode().addClass(rc.getShortName().toLowerCase());
    }
    
    Label.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Label.prototype.constructor = Label;
    
    Label.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Label';
    
    Label.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Label element to DrawingBoard');
            return;
        }
        var label = new Label(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(label);
        label.inactiveOthers();
        return this;
    }
    
    Label.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Label element to DrawingBoard');
            return;
        }
        var label = new Label(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(label);
        label.inactiveOthers();
        return this;
    }
    
    Label.prototype.isValid = function(options) {
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
    
    Label.__fromXml = function(xml, options) {
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
        return new Label(name, options);
    }
    
    Nth.FormBuilder.Element.Label = Label;
    
    return Label;
});