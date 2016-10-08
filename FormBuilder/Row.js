;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Component'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Row Element
     */
    var Row = function(name, options) {      
        Nth.FormBuilder.Component.call(this, name, $.extend(true, {
            idPrefix: '_row_',
            creatorIconClass: 'icon row',
            creatorLabel: 'Row',
            active: false
        }, options));
        this.getWrapper().getNode().addClass(this.getConfigParam('componentRowClass'));
        if (this.hasDrawingBoard()) {
            var inst = this;
            var $wrapper = this.getWrapper().getNode();
            this.setToolbox(this.createToolbox());
            $wrapper.prepend(this.getToolbox()).sortable({
                items: '.col',
                greedy: false,
                connectWith: '.' + this.getConfigParam('componentRowClass'),
                placeholder: 'fb-placeholder',
                stop: function(e, ui) {
                    var fieldset = inst.getDrawingBoard().getFieldset();
                    var column = fieldset.findColumn(ui.item);
                    if (column) {
                        var parentComponent = column.findParentRow();
                        if (parentComponent) {
                            column.setParentComponent(parentComponent);
                        }
                    }
                }
            }).on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var actived = inst.actived();
                if (!e.ctrlKey) {
                    inst.getDrawingBoard().getFieldset().inactiveRows();
                }
                if (!actived) {
                    inst.active();
                }
            });
            if (this.getOption('active')) {
                this.active();
            }
        }
    }
    
    Row.prototype = Object.create(Nth.FormBuilder.Component.prototype);
    
    Row.prototype.constructor = Row;
    
    Row.prototype.__CLASS__ = 'Nth.FormBuilder.Row';
    
    Row.prototype.setName = function(name) {
        if (this.hasDrawingBoard()) {
            this.getToolbox().attr({
                id: '_prop_of_' + name,
                title: 'Edit property of ' + name
            });
        }
        return Nth.FormBuilder.Component.prototype.setName(this, name);
    }
    
    Row.prototype.actived = function() {
        return this.getWrapper().getNode().hasClass(this.getConfigParam('activeRowClass'));
    }
    
    Row.prototype.active = function() {
        this.getWrapper().getNode().addClass(this.getConfigParam('activeRowClass'));
        return this;
    }
    
    Row.prototype.inactiveOthers = function() {
        if (this.hasDrawingBoard()) {
            this.getDrawingBoard().getFieldset().inactiveRows();
            this.active();
        }
        return this;
    }
    
    Row.prototype.reset = function (cb) {
        $.each(this.queryElements(), function (i, element) {
            if ($.isFunction(cb) && false === cb.call(element)) {
                return;
            }
            element.reset();
        });
        return this;
    }
    
    Row.prototype.queryElements = function () {
        var elements = [];
        $.each(this.getChilds(), function (i, child) {
            if (child instanceof Nth.FormBuilder.Element) {
                elements.push(child);
            } else if (child instanceof Nth.FormBuilder.Column) {
                elements.push.apply(elements, child.queryElements());
            }
        });
        return elements;
    }
    
    Row.prototype.getCreatorDraggableOptions = function() {
        var options = Nth.FormBuilder.Component.prototype.getCreatorDraggableOptions.call(this);
        if (this.hasDrawingBoard()) {
            var id = this.getDrawingBoard().getContainer().attr('id');
            var wrapperNodeName = this.getDrawingBoard().getFieldset().getOption('wrapperNodeName')
            options.connectToSortable = '#' + id + ' ' + wrapperNodeName;
        }
        return options;
    }
    
    Row.prototype.getOptionsCopy = function () {
        var options = Nth.FormBuilder.Component.prototype.getOptionsCopy.call(this);
        if (this.hasDrawingBoard()) {
            var drawingBoard = this.getDrawingBoard();
            options.parentComponent = drawingBoard.getFieldset();
            options.addingRelative = drawingBoard.getFieldset().getDomNode();
            var $dragging = drawingBoard.getDragging();
            if ($dragging.length) {
                options.addingRelative = $dragging;
                options.addingMethod = 'replaceWith';
            } else {
                var sibling = options.parentComponent.getLastActivedChild();
                if (sibling) {
                    var setting = this.getToolPalette().getComponentSetting();
                    options.addingRelative = sibling.getDomNode();
                    options.addingMethod = setting.positionToAdd;
                }
            }
        }
        return options;
    }
    
    Row.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add row to DrawingBoard');
            return;
        }
        var options = $.extend({}, {
            active: true
        }, this.getOptionsCopy());
        var row = new Row(true, options);
        this.getDrawingBoard().getFieldset().addComponent(row);
        row.inactiveOthers();
        return this;
    }
    
    Row.prototype.createToolbox = function() {
        var inst = this;
        var id = this.getWrapper().getAttribute('id');
        var $wrapper = $('<div/>', {
            id: '_prop_of_' + id,
            'class': 'row-property',
            title: 'Edit property of ' + id
        });
        var $label = $('<span/>').html('#' + id);
        $wrapper.on('click', function(e) {
            e.preventDefault();
            if (inst.actived()) {
                e.stopPropagation();
            }
            inst.loadProperty();
        }).draggable({
            axis: 'x',
            containment: this.getWrapper().getNode(),
            create: function () {
                $(this).css({
                    position: 'absolute'
                });
            },
            start: function () {
                $(this).css({
                    right: 'auto'
                });
            }
        });
        return $wrapper.append($label);
    }
    
    Row.__fromXml = function(xml, options) {
        options = $.extend({}, {
            drawingBoard: null,
            toolPalette: null,
            parentComponent: null
        }, options);
        var fb = Nth.FormBuilder.__getInstance();
        var $row = fb.getXmlObject(xml, 'component');
        var name = $row.attr('name');
        $row.children('options').children('option').each(function() {
            options[$(this).attr('name')] = fb.decodeXmlData($(this).text());
        });
        var row = new Row(name, options);
        var childrens = [];
        var $childrens = $row.children('childrens');
        $childrens.children('component').each(function() {
            var rc = new Nth.ReflectionClass($(this).attr('class'));
            var component = rc.getClass().__fromXml(this, {
                drawingBoard: options.drawingBoard,
                toolPalette: options.toolPalette,
                parentComponent: row,
                autoInit: false
            });
            childrens.push(component);
        });
        var fieldset = row.getFieldsetContainer();
        $.each(childrens.sort(function(a, b) {
            return a.getOption('orderIndex') - b.getOption('orderIndex');
        }), function(i, component) {
            fieldset.addComponent(component);
        });
        return row;
    }
    
    Nth.FormBuilder.Row = Row;
    
    return Row;
});