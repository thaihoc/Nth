;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Options', 'Nth/FormBuilder/FormBuilder'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var ToolPalette = function(options) {
        Nth.Options.call(this, {
            container: '',
            tabContainer: '',
            settingContainer: '',
            addElementTabText: 'Add Element',
            elementPropertyTabText: 'Element Property',
            fieldsetPropertyTabText: 'Fieldset Property',
            addComponentAreaId: 'add-element',
            componentPropertyAreaId: 'element-property',
            fieldsetPropertyAreaId: 'fieldset-property',
            componentCreators: ['Text', 'Label', 'Textarea', 'Checkbox', 'DateTime', 'Radio', 'Select', 'List', 'Table', 'Row', 'Column'],
            componentSettingLabel: 'Settings',
            drawingBoard: null
        });
        this.mergeOptions(options);
        this.tab = this.createTab();
    }
    
    ToolPalette.prototype = Object.create(Nth.Options.prototype);
    
    ToolPalette.prototype.constructor = ToolPalette;
    
    ToolPalette.prototype.__CLASS__ = 'Nth.FormBuilder.ToolPalette';
    
    ToolPalette.prototype.init = function() {
        if (this.hasDrawingBoard()) {
            var fieldset = this.getDrawingBoard().getFieldset();
            if (fieldset) {
                fieldset.loadProperty();
            }
        }
        this.createComponentCreators();
    }
    
    ToolPalette.prototype.getTab = function() {
        return this.tab;
    }
    
    ToolPalette.prototype.getDrawingBoard = function() {
        return this.getOption('drawingBoard');
    }
    
    ToolPalette.prototype.setDrawingBoard = function(drawingBoard) {
        if (!(drawingBoard instanceof Nth.FormBuilder.DrawingBoard)) {
            throw '"drawingBoard" argument must be an instanceof Nth.FormBuilder.DrawingBoard';
        }
        this.setOption('drawingBoard', drawingBoard);
        return this;
    }
    
    ToolPalette.prototype.hasDrawingBoard = function() {
        return this.getDrawingBoard() instanceof Nth.FormBuilder.DrawingBoard;
    }
    
    ToolPalette.prototype.getContainer = function() {
        return $.getElement(this.getOption('container'));
    }
    
    ToolPalette.prototype.getTabContainer = function() {
        return $.getElement(this.getOption('tabContainer'));
    }
    
    ToolPalette.prototype.getAddComponentArea = function() {
        return this.getOption('addComponentAreaId') ? $('#' + this.getOption('addComponentAreaId')) : $();
    }
    
    ToolPalette.prototype.getComponentPropertyArea = function() {
        return this.getOption('componentPropertyAreaId') ? $('#' + this.getOption('componentPropertyAreaId')) : $();
    }
    
    ToolPalette.prototype.getFieldsetPropertyArea = function() {
        return this.getOption('fieldsetPropertyAreaId') ? $('#' + this.getOption('fieldsetPropertyAreaId')) : $();
    }
    
    ToolPalette.prototype.createComponentCreators = function() {
        var $addElementArea = this.getAddComponentArea();
        var componentCreators = this.getOption('componentCreators');
        if (!$addElementArea.length || !componentCreators) {
            throw 'Can\'t create element creators';
        }
        var $creatorList = $('<div/>', { 'class': 'creator-list clearfix' });
        for (var i in componentCreators) {
            var creatorClass = componentCreators[i];
            var name = creatorClass + '_creator';
            var options = {
                creatorContainer: $creatorList,
                drawingBoard: this.getDrawingBoard(),
                toolPalette: this
            }
            if (typeof Nth.FormBuilder[creatorClass] === 'function' && Nth.FormBuilder[creatorClass].prototype instanceof Nth.FormBuilder.Component) {
                var component = new Nth.FormBuilder[creatorClass](name, options);
                component.createCreator();
            } else if (typeof Nth.FormBuilder.Element[creatorClass] === 'function' && Nth.FormBuilder.Element[creatorClass].prototype instanceof Nth.FormBuilder.Element) {
                var element = new Nth.FormBuilder.Element[creatorClass](name, options);
                element.createCreator();
            } else {
                console.warn('FormBuilder does not support "' + componentCreators[i] + '" element');
                continue;
            }
        }
        $creatorList.disableSelection();
        $addElementArea.append($creatorList, this.createComponentSettingArea());
    }
    
    ToolPalette.prototype.createTab = function() {
        var $tabContainer = this.getTabContainer();
        if (!$tabContainer.length) {
            throw 'Can\'t create tab. "tabContainer" seem not set';
        }
        var $nav = $('<ul/>', {'class': "nav nav-tabs", 'role': "tablist"});
        var $addElementItem = $('<li/>', {'role': "presentation", 'class': "active"});
        $addElementItem.append($('<a/>', {
            'href': "#" + this.getOption('addComponentAreaId'), 
            'aria-controls': this.getOption('addComponentAreaId'),
            'role': "tab",
            'data-toggle': "tab"
        }).html('<i class="fa fa-plus"></i> ' + this.getOption('addElementTabText')));
        var $elementPropertyItem = $('<li/>', {'role': "presentation"});
        $elementPropertyItem.append($('<a/>', {
            'href': "#" + this.getOption('componentPropertyAreaId'), 
            'aria-controls': this.getOption('componentPropertyAreaId'),
            'role': "tab",
            'data-toggle': "tab"
        }).html('<i class="fa fa-edit"></i> ' + this.getOption('elementPropertyTabText')));
        var $fieldsetPropertyItem = $('<li/>', {'role': "presentation"});
        $fieldsetPropertyItem.append($('<a/>', {
            'href': "#" + this.getOption('fieldsetPropertyAreaId'), 
            'aria-controls': this.getOption('fieldsetPropertyAreaId'),
            'role': "tab",
            'data-toggle': "tab"
        }).html('<i class="fa fa-edit"></i> ' + this.getOption('fieldsetPropertyTabText')));
        $nav.append($addElementItem, $elementPropertyItem, $fieldsetPropertyItem);
        var $tabContent = $('<div/>', {'class': "tab-content"});
        $tabContent.append($('<div/>', {'class': "tab-pane fade in active", 'id': this.getOption('addComponentAreaId')}));
        $tabContent.append($('<div/>', {'class': "tab-pane fade in", 'id': this.getOption('componentPropertyAreaId')}));
        $tabContent.append($('<div/>', {'class': "tab-pane fade in", 'id': this.getOption('fieldsetPropertyAreaId')}));
        $tabContainer.html(null).append($nav, $tabContent);
        return $nav.tab();
    }
    
    ToolPalette.prototype.createComponentSettingArea = function() {
        var $wrapper = $('<div/>', {
            id: 'component-setting', 
            'class': 'component-setting clearfix'
        });
        var $h5 = $('<h5/>').html(this.getOption('componentSettingLabel'));
        var $table = $('<table/>', {'class': 'settings'});
        //Row 1: Position to add
        var $tr1 = $('<tr/>');
        var $td11 = $('<td/>').html('Location added');
        var $before = $('<input/>', {
            type: 'radio',
            id: 'setting-position-before',
            name: 'setting-position-to-add',
            value: 'before'
        })
        var $beforeLabel = $('<label/>', { 'for': 'setting-position-before' }).html('Above');
        var $after = $('<input/>', {
            type: 'radio',
            id: 'setting-position-after',
            name: 'setting-position-to-add',
            value: 'after',
            checked: true
        });
        var $afterLabel = $('<label/>', {'for': 'setting-position-after'}).html('Below&nbsp;&nbsp;');
        var $td12 = $('<td/>').append($after, $afterLabel, $before, $beforeLabel);
        $tr1.append($td11, $td12);
        //Row 2: Type to add, Now is hide
        var $tr2 = $('<tr/>');
        var $td21 = $('<td/>').html('Type to add');
        var $prepend = $('<input/>', {
            type: 'radio',
            id: 'setting-type-prepend',
            name: 'setting-type-to-add',
            value: 'prepend'
        })
        var $prependLabel = $('<label/>', { 'for': 'setting-type-prepend' }).html('Prepend');
        var $append = $('<input/>', {
            type: 'radio',
            id: 'setting-type-append',
            name: 'setting-type-to-add',
            value: 'append',
            checked: true
        });
        var $appendLabel = $('<label/>', {'for': 'setting-type-append'}).html('Append&nbsp;&nbsp;');
        var $td22 = $('<td/>').append($append, $appendLabel, $prepend, $prependLabel);
        $tr2.append($td21, $td22).hide();
        return $wrapper.append($h5, $table.append($tr1, $tr2));
    }
    
    ToolPalette.prototype.getComponentSetting = function() {
        var $settingTable = this.getContainer().find('#component-setting table');
        return {
            positionToAdd: $settingTable.find('input[name=setting-position-to-add]:checked').val(),
            typeToAdd: $settingTable.find('input[name=setting-type-to-add]:checked').val()
        }
    }
    
    ToolPalette.prototype.loadComponentProperty = function(component, tabIndex) {
        if (!(component instanceof Nth.FormBuilder.Component)) {
            throw "The argument was passed must be an instance of Nth.FormBuilder.Component class";
        }
        var $table = $('<table/>', {'class': 'element-property'});
        var $thead = $('<thead/>');
        var $tr = $('<tr/>');
        var $th = $('<th/>', {'colspan': 2}).html(component.getOption('creatorLabel') + ' property');
        var $tbody = $('<tbody/>');
        $table.append($thead.append($tr.append($th)), $tbody);
        $.each(component.getPropertySetters(), function(i, options) {
            var $tr = $('<tr/>');
            var $div = $('<div/>', {'class': 'property-name'}).html(options.name);
            var $td1 = $('<td/>').html($div);
            var $td2 = $('<td/>').html(options.setter);
            $tbody.append($tr.append($td1, $td2));
        });
        if (tabIndex === undefined || tabIndex === 1) {
            this.setOption('currentComponentProperty', component);
            this.getComponentPropertyArea().html($table);
            this.activeTabByIndex(1);
        } else if(tabIndex === 2) {
            this.setOption('currentFieldsetProperty', component);
            this.getFieldsetPropertyArea().html($table);
            this.activeTabByIndex(2);
        }
        return this;
    }
    
    ToolPalette.prototype.activeTabByIndex = function(index) {
        this.getTab().find('li').eq(index).find('a').tab('show');
        return this;
    }
    
    ToolPalette.prototype.deleteComponent = function(component) {
        var currentComponent = this.getOption('currentComponentProperty');
        if (currentComponent instanceof Nth.FormBuilder.Component && currentComponent.getName() == component.getName()) {
            this.getComponentPropertyArea().html(null);
            this.activeTabByIndex(0);
        }
        return this;
    }
    
    Nth.FormBuilder.ToolPalette = ToolPalette;
    
    return ToolPalette;
});