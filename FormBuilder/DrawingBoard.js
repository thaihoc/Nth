;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth', 
            'Nth/Options',
            'Nth/FormBuilder/Fieldset'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var DrawingBoard = function(options) {
        var nth = new Nth.Nth();
        if (typeof $.ui === 'undefined' || nth.versionCompare($.ui.version, '1.11.4') === -1) {
            console.warn('FormBuider DrawingBoard class required jquery ui version equal to 1.11.4 or higher');
            return;
        }
        Nth.Options.call(this, {
            xmlConstruction: null,
            htmlConstruction: null, //using for old version
            container: '',
            toolPalette: null
        });
        this.mergeOptions(options);
    }
    
    DrawingBoard.prototype = Object.create(Nth.Options.prototype);
    
    DrawingBoard.prototype.constructor = DrawingBoard;
    
    DrawingBoard.prototype.__CLASS__ = 'Nth.FormBuilder.DrawingBoard';
    
    DrawingBoard.prototype.init = function() {
        var fieldset = null;
        if (this.getOption('xmlConstruction')) {
            fieldset = Nth.FormBuilder.Fieldset.__fromXml(this.getOption('xmlConstruction'), {
                drawingBoard: this,
                toolPalette: this.getToolPalette()
            });
        } else if (this.getOption('htmlConstruction')) {
            var convertor = new Nth.FormBuilder.Convertor(this.getOption('htmlConstruction'));
            fieldset = convertor.toFieldset({
                drawingBoard: this,
                toolPalette: this.getToolPalette()
            });
        } else {
            fieldset = new Nth.FormBuilder.Fieldset(true, {
                drawingBoard: this,
                toolPalette: this.getToolPalette()
            });
            var row = new Nth.FormBuilder.Row(true, {
                drawingBoard: this,
                toolPalette: this.getToolPalette(),
                parentComponent: fieldset
            });
            var column = new Nth.FormBuilder.Column(true, {
                drawingBoard: this,
                toolPalette: this.getToolPalette(),
                parentComponent: row,
                active: true
            });
            fieldset.addComponent(row).addComponent(column);
        }
        this.setFieldset(fieldset);
        this.getContainer().html(fieldset.getDomNode());
        return this;
    }
    
    DrawingBoard.prototype.getToolPalette = function() {
        return this.getOption('toolPalette');
    }
    
    DrawingBoard.prototype.setToolPalette = function(toolPalette) {
        if (!(toolPalette instanceof Nth.FormBuilder.ToolPalette)) {
            console.warn('The argument was passed must be an instance of FormBuilder.ToolPalette');
            return this;
        }
        this.setOption('toolPalette', toolPalette);
        return this;
    }
    
    DrawingBoard.prototype.hasToolPalette = function() {
        return this.getToolPalette() instanceof Nth.FormBuilder.ToolPalette;
    }
    
    DrawingBoard.prototype.getFieldset = function() {
        return this.fieldset;
    }
    
    DrawingBoard.prototype.setFieldset = function(fieldset) {
        if (!(fieldset instanceof Nth.FormBuilder.Fieldset)) {
            console.warn('The argument was passed must be an instance of FormBuilder.Fieldset');
            return this;
        }
        this.fieldset = fieldset;
        return this;
    }
    
    DrawingBoard.prototype.getContainer = function() {
        return $.getElement(this.getOption('container'));
    }
    
    DrawingBoard.prototype.getDragging = function() {
        return this.getContainer().find('.ui-draggable-dragging');
    }
    
    DrawingBoard.prototype.removeDragging = function() {
        this.getDragging().remove();
        return this;
    }
    
    DrawingBoard.prototype.removeActiveComponents = function() {
        var fieldset = this.getFieldset();
        var components = fieldset.getActiveComponents();
        if (components.length) {
            Nth.Confirm('Xóa ' + components.length + ' phần tử và con của ' + (components.length > 1 ? 'chúng' : 'nó') + ' ra khỏi biểu mẫu?', function(choosed) {
                if (Nth.Confirm.OK === choosed) {
                    fieldset.removeComponent(components);
                }
            });
            return this;
        }
        Nth.Alert('Không có phần tử nào được chọn!');
        return this;
    }
    
    Nth.FormBuilder.DrawingBoard = DrawingBoard;
    
    return DrawingBoard;
});