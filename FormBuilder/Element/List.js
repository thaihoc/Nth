;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Element'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * List Element
     */
    var List = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_list_',
            creatorIconClass: 'icon list',
            creatorLabel: 'List',
            minRow: 3,
            maxRow: 10
        }, options));
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        this.control = this.createControl();
        this.createRowBody();
        this.getWrapper().getNode().addClass(rc.getShortName().toLowerCase()).append(this.getControl().getNode());
        if (this.existsOption('value')) {
            this.setValue(this.getOption('value'));
        } else if (this.hasDefaultValue()) {
            this.setValue(this.getDefaultValue());
        }
        if (this.getOption('disabled')) {
            this.disable();
        }
    }
    
    List.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    List.prototype.constructor = List;
    
    List.prototype.__CLASS__ = 'Nth.FormBuilder.Element.List';
    
    List.prototype.enable = function () {
        this.getControl().getNode().find('.' + this.getConfigParam('elementClass')).removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    List.prototype.disable = function () {
        this.getControl().getNode().find('.' + this.getConfigParam('elementClass')).attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    List.prototype.createRowBody = function() {
        this.getControl().getNode().html(null);
        var minRow = this.getOption('minRow', 3);
        while (minRow > 0) {
            this.addRow();
            minRow--;
        }
        return this;
    }
    
    List.prototype.getControl = function() {
        return this.control;
    }
    
    List.prototype.isEmpty = function() {
        return !this.getValue().length;
    }
    
    List.prototype.getDefaultValue = function () {
        var defaultValue = Nth.FormBuilder.Element.prototype.getDefaultValue.call(this);
        return $.isArray(defaultValue) ? defaultValue : [];
    }
    
    List.prototype.setDefaultValue = function (defaultValue) {
        if (!$.isArray(defaultValue)) {
            console.warn('Default value must be array type');
            return this;
        }
        return this.getOption('defaultValue', defaultValue);
    }
    
    List.prototype.getValue = function() {
        var inst = this;
        var value = [];
        this.getRows().each(function() {
            var _value = $(this).find('.' + inst.getConfigParam('elementClass')).val();
            if (_value !== '') {
                value.push(_value);
            }
        });
        return value;
    }
    
    List.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue(),
            columnRefer: this.getOption('columnRefer')
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }
    
    List.prototype.setValue = function(value) {
        if (!$.isArray(value)) {
            console.warn('Value must be array type');
            return this;
        }
        this.cleanValue();
        if (!value.length) {
            return this;
        }
        var numberRows = this.getNumberRows();
        if (value.length > numberRows) {
            var rowIncreased = value.length - numberRows;
            if (value.length > this.getOption('maxRow')) {
                console.warn('The length of value greater than the number of rows accept');
                rowIncreased = this.getOption('maxRow') - numberRows;
            }
            for (var i = 0; i < rowIncreased; i++) {
                this.addRow();
            }
        }
        var inst = this;
        this.getRows().each(function(index) {
            $(this).find('.' + inst.getConfigParam('elementClass')).val(value[index]);
        });
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    List.prototype.cleanValue = function() {
        this.getRows().find('.' + this.getConfigParam('elementClass')).val(null);
        return this;
    }
    
    List.prototype.setMinRow = function (minRow) {
        var value = this.getValue();
        this.setOption('minRow', minRow);
        this.createRowBody();
        this.setValue(value);
        return this;
    }
    
    List.prototype.setMaxRow = function (maxRow) {
        var value = this.getValue();
        this.setOption('maxRow', maxRow);
        this.createRowBody();
        this.setValue(value);
        return this;
    }
    
    List.prototype.createControl = function() {
        var name = this.getName();
        var $ul = $('<ul/>', $.extend(true, {
            id: this.getConfigParam('controlIdPrefix') + name
        }, this.getOption('controlAttributes')));
        return new Nth.Dom.Node($ul);
    }
    
    List.prototype.getNumberRows = function() {
        return this.getRows().length;
    }
    
    List.prototype.getRowByIndex = function(index) {
        return this.getControl().getNode().find('#' + this.getName() + '_lr_' +  index);
    }
    
    List.prototype.addRow = function($relative) {
        var index = this.getMaxRowIndex() + 1;
        var numberRows = this.getNumberRows();
        if (this.getOption('maxRow') < numberRows) {
            console.warn('The number of rows added exceed the max row setting');
            return this;
        }
        var $row = this.createRow(index);
        if ($relative) {
            $relative.after($row);
        } else {
            this.getControl().getNode().append($row);
        }
        if (this.getOption('maxRow') === numberRows + 1) {
            this.disableAddRowAction();
        }
        if (numberRows + 1 > this.getOption('minRow')) {
            this.enableRemoveRowAction();
        } else {
            this.disableRemoveRowAction();
        }
        return this;
    }
    
    List.prototype.disableAddRowAction = function() {
        this.getRows().find('.act.add').attr('disabled', true).prop('disabled', true);
    }
    
    List.prototype.enableAddRowAction = function() {
        this.getRows().find('.act.add').removeAttr('disabled').prop('disabled', false);
    }
    
    List.prototype.disableRemoveRowAction = function() {
        this.getRows().find('.act.remove').attr('disabled', true).prop('disabled', true);
    }
    
    List.prototype.enableRemoveRowAction = function() {
        this.getRows().find('.act.remove').removeAttr('disabled').prop('disabled', false);
    }
    
    List.prototype.createRow = function(index) {
        var name = this.getName();
        var $li = $('<li/>', {
            id: name + '_lr_' +  index,
            'data-index': index
        });
        var $wrapper = $('<div/>', {
            id: name + '_iglr_' + index,
            'class': 'lr-ctrl'
        });
        var $input = $('<input/>', {
            id: name + '_lc_' + index,
            name: name + '_lc_' + index,
            type: 'text',
            'class': this.getConfigParam('elementClass')
        });
        var $rowAction = this.createRowAction(index);
        return $li.append($wrapper.append($input, $rowAction));
    }
    
    List.prototype.removeRow = function(index) {
        var numberRows = this.getNumberRows();
        if (numberRows > this.getOption('minRow')) {        
            this.getRowByIndex(index).remove();
            if (this.getOption('minRow') === numberRows - 1) {
                this.disableRemoveRowAction();
            }
            if (this.getOption('maxRow') > numberRows - 1) {
                this.enableAddRowAction();
            }
        } else {
            console.warn('Can\'t remove row. The list must have least ' + this.getOption('minRow') + ' row(s)');
        }
        return this;
    }
    
    List.prototype.getMaxRowIndex = function() {
        var maxRowIndex = 0;
        this.getRows().each(function() {
            var rowIndex = $(this).attr('data-index');
            if (Number(rowIndex) > maxRowIndex) {
                maxRowIndex = Number(rowIndex);
            }
        });
        return maxRowIndex;
    }
    
    List.prototype.getRows = function() {
        return this.getControl().getNode().find('li');
    }
    
    List.prototype.createRowAction = function(index) {
        var inst = this;
        var name = this.getName();
        var $wrapper = $('<div/>', { 
            id: name + '_actwrp_' + index,
            'class': 'act-wrapper' 
        });
        var $add = $('<input/>', {
            id: name + '_actadd_' + index,
            type: 'button', 
            'class': 'act add', 
            value: '+', 
            title: 'Thêm dòng'
        }).on('click', function() {
            inst.addRow(inst.getRowByIndex(index));
        });
        var $sub = $('<input/>', {
            id: name + '_actrm_' + index,
            type: 'button', 
            'class': 'act remove', 
            value: '-', 
            title: 'Xóa dòng này'
        }).on('click', function() {
            inst.removeRow(index);
        });
        return $wrapper.append($add, $sub);
    }
    
    List.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add List element to DrawingBoard');
            return;
        }
        var list = new List(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(list);
        list.inactiveOthers();
        return this;
    }
    
    List.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone List element to DrawingBoard');
            return;
        }
        var list = new List(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(list);
        list.inactiveOthers();
        return this;
    }
    
    List.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Element.prototype.getPropertySetters.call(this);
        var propertySetter= new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getRequiredSetter()
            , propertySetter.getMarksMandatorySetter()
            , propertySetter.getValidNameSetter()
            , propertySetter.getColumnReferSetter()
            , propertySetter.getMaxRowSetter()
            , propertySetter.getMinRowSetter()
            , propertySetter.getElementIdSetter()
            , propertySetter.getElementClassSetter()
            , propertySetter.getElementStyleSetter()
            , propertySetter.getElementTitleSetter()
            , propertySetter.getBindIndexSetter()
        ]);
        return options;
    }
    
    List.prototype.toJson = function () {
        var json = Nth.FormBuilder.Element.prototype.toJson.call(this);
        if (this.isEmpty()) {
            delete json.options.value;
        } else {
            json.options.value = this.getValue();
        }
        json.options.controlAttributes = this.getControl().getAttributes();
        return json;
    }
    
    List.__fromXml = function(xml, options) {
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
        return new List(name, options);
    }
    
    Nth.FormBuilder.Element.List = List;
    
    return List;
});