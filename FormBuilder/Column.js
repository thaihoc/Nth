;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Component'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Column Element
     */
    var Column = function(name, options) {
        Nth.FormBuilder.Component.call(this, name, $.extend(true, {
            idPrefix: '_col_',
            creatorIconClass: 'icon column',
            creatorLabel: 'Column',
            active: false
        }, options));
        var wrapperAttributes = this.getOption('wrapperAttributes', {});
        if (!wrapperAttributes['class'] || !wrapperAttributes['class'].match(/col\-(xs|sm|md|lg)\-[1-9]{1,2}/)) {
            this.getWrapper().getNode().addClass(this.getConfigParam('defaultColumnSizeClass'));
        }
        this.getWrapper().getNode().addClass(this.getConfigParam('componentColumnClass'));
        if (this.hasDrawingBoard()) {
            var inst = this;
            var $wrapper = this.getWrapper().getNode();
            this.setToolbox(this.createToolbox());
            $wrapper.prepend(this.getToolbox()).sortable({
                items: '.' + this.getConfigParam('elementWrapperClass'),
                greedy: false,
                connectWith: '.' + this.getConfigParam('componentColumnClass'),
                placeholder: 'fb-placeholder',
                stop: function(e, ui) {
                    var fieldset = inst.getDrawingBoard().getFieldset();
                    var element = fieldset.findElement(ui.item);
                    if (element) {
                        var parentComponent = element.findParentColumn();
                        if (parentComponent) {
                            element.setParentComponent(parentComponent);
                        }
                    }
                }
            }).on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                var actived = inst.actived();
                if (!e.ctrlKey) {
                    inst.getDrawingBoard().getFieldset().inactiveColumns();
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
    
    Column.prototype = Object.create(Nth.FormBuilder.Component.prototype);
    
    Column.prototype.constructor = Column;
    
    Column.prototype.__CLASS__ = 'Nth.FormBuilder.Column';
    
    Column.prototype.setName = function(name) {
        if (this.hasDrawingBoard()) {
            this.getToolbox().attr({
                id: '_prop_of_' + name,
                title: 'Edit property of ' + name
            }).find('span').html('#' + name);
        }
        return Nth.FormBuilder.Component.prototype.setName.call(this, name);
    }
    
    Column.prototype.actived = function() {
        return this.getWrapper().getNode().hasClass(this.getConfigParam('activeColumnClass'));
    }
    
    Column.prototype.active = function() {
        return this.getWrapper().getNode().addClass(this.getConfigParam('activeColumnClass'));
    }
    
    Column.prototype.inactiveOthers = function() {
        if (this.hasDrawingBoard()) {
            this.getDrawingBoard().getFieldset().inactiveColumns();
            this.active();
        }
        return this;
    }
    
    Column.prototype.reset = function (cb) {
        $.each(this.queryElements(), function (i, element) {
            if ($.isFunction(cb) && false === cb.call(element)) {
                return;
            }
            element.reset();
        });
        return this;
    }
    
    Column.prototype.queryElements = function () {
        var elements = []
        $.each(this.getChilds(), function (i, child) {
            if (child instanceof Nth.FormBuilder.Element) {
                elements.push(child);
            }
        });
        return elements;
    }
    
    Column.prototype.getCreatorDraggableOptions = function() {
        var options = Nth.FormBuilder.Component.prototype.getCreatorDraggableOptions.call(this);
        if (this.hasDrawingBoard()) {
            var id = this.getDrawingBoard().getContainer().attr('id');
            var wrapperNodeName = this.getDrawingBoard().getFieldset().getOption('wrapperNodeName')
            options.connectToSortable = '#' + id + ' ' + wrapperNodeName + ' .' + this.getConfigParam('componentRowClass');
        }
        return options;
    }
    
    Column.prototype.createToolbox = function() {
        var inst = this;
        var id = this.getWrapper().getAttribute('id');
        var $wrapper = $('<div/>', {
            id: '_prop_of_' + id,
            'class': 'col-property',
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
    
    Column.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Column component to DrawingBoard');
            return;
        }
        var options = $.extend({}, {
            active: true
        }, this.getOptionsCopy());
        var column = new Column(true, options);
        this.getDrawingBoard().getFieldset().addComponent(column);
        column.inactiveOthers();
        return this;
    }
    
    Column.prototype.getOptionsCopy = function () {
        var options = Nth.FormBuilder.Component.prototype.getOptionsCopy.call(this);
        if (this.hasDrawingBoard()) {
            var drawingBoard = this.getDrawingBoard();
            var $dragging = drawingBoard.getDragging();
            if ($dragging.length) {
                options.addingRelative = $dragging;
                options.addingMethod = 'replaceWith';
                options.parentComponent = this.getParentComponentByNode($dragging);
            } else {
                if (!options.parentComponent) {
                    var rows = drawingBoard.getFieldset().queryRows();
                    var activeRow = null;
                    $.each(rows, function(i, row) {
                        if (row.actived()) {
                            activeRow = row;
                        }
                    });
                    options.parentComponent = activeRow ? activeRow : rows[rows.length - 1];
                    options.addingRelative = options.parentComponent.getDomNode();
                }
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
    
    Column.prototype.getParentComponentByNode = function($node) {
        if (!this.hasDrawingBoard() || !$node.length) {
            return null;
        }
        var drawingBoard = this.getDrawingBoard();
        var name = $node.closest('.' + this.getConfigParam('componentRowClass')).attr('id');
        return drawingBoard.getFieldset().getComponent(name);
    }
    
    Column.prototype.findParentRow = function() {
        var fieldset = this.getFieldsetContainer();
        if (fieldset) {
            var name = this.getWrapper().getNode().closest('.' + this.getConfigParam('componentRowClass')).attr('id');
            return fieldset.getComponent(name);
        }
        return null;
    }
    
    Column.__fromXml = function(xml, options) {
        options = $.extend({}, {
            drawingBoard: null,
            toolPalette: null
        }, options);
        var fb = Nth.FormBuilder.__getInstance();
        var $column = fb.getXmlObject(xml, 'component');
        var name = $column.attr('name');
        $column.children('options').children('option').each(function() {
            options[$(this).attr('name')] = fb.decodeXmlData($(this).text());
        });
        var column = new Column(name, options);
        var childrens = [];
        var $childrens = $column.children('childrens');
        $childrens.children('component').each(function() {
            var rc = new Nth.ReflectionClass($(this).attr('class'));
            var component = rc.getClass().__fromXml(this, {
                drawingBoard: options.drawingBoard,
                toolPalette: options.toolPalette,
                parentComponent: column,
                autoInit: false
            });
            childrens.push(component);
        });
        var fieldset = column.getFieldsetContainer();
        if (fieldset) {
            $.each(childrens.sort(function(a, b) {
                return a.getOption('orderIndex') - b.getOption('orderIndex');
            }), function(i, component) {
                fieldset.addComponent(component);
            });
        }
        return column;
    }
    
    Nth.FormBuilder.Column = Column;
    
    return Column;
});