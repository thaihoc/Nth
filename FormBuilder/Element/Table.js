;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/FormBuilder/Element',
            'autogrow'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Table Element
     */
    var Table = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_table_',
            creatorIconClass: 'icon table',
            creatorLabel: 'Table',
            columnHeaders: [
                ['Column 1', 'auto'],
                ['Column 2', 'auto']
            ],
            minRow: 3,
            maxRow: 10
        }, options));
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        this.control = this.createControl();
        this.createColumnHeaders();
        var $wrapper = $('<div/>', { 'class': 'table-responsive' });
        this.getWrapper().getNode().addClass(rc.getShortName().toLowerCase()).append($wrapper.append(this.getControl().getNode()));
        if (this.existsOption('value')) {
            this.setValue(this.getOption('value'));
        } else if (this.hasDefaultValue()) {
            this.setValue(this.getDefaultValue());
        }
        if (this.getOption('disabled')) {
            this.disable();
        }
    }
    
    Table.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Table.prototype.constructor = Table;
    
    Table.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Table';
    
    Table.prototype.enable = function () {
        this.getControl().getNode().find('.' + this.getConfigParam('elementClass')).removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    Table.prototype.disable = function () {
        this.getControl().getNode().find('.' + this.getConfigParam('elementClass')).attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    Table.prototype.getControl = function() {
        return this.control;
    }
    
    Table.prototype.isEmpty = function() {
        return !this.getValue().length;
    }
    
    Table.prototype.getDefaultValue = function () {
        var defaultValue = Nth.FormBuilder.Element.prototype.getDefaultValue.call(this);
        return $.isArray(defaultValue) ? defaultValue : [];
    }
    
    Table.prototype.setDefaultValue = function (defaultValue) {
        if (!$.isArray(defaultValue)) {
            console.warn('Default value must be an two demension array');
            return this;
        }
        return this.getOption('defaultValue', defaultValue);
    }
    
    Table.prototype.getValue = function() {
        var value = [];
        var inst = this;
        this.getRows().each(function() {
            var arr = [];
            $(this).find('.' + inst.getConfigParam('elementClass')).each(function(){
                arr.push($(this).val());
            });
            var filtered = arr.filter(function (v) {
                return v !== '';
            });
            if (filtered.length) {
                value.push(arr);
            }
        });
        return value;
    }
    
    Table.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue(),
            columnRefer: this.getOption('columnRefer')
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }
    
    Table.prototype.setValue = function(value) {
        if (!$.isArray(value)) {
            console.warn('Value must be an two demension array');
            return this;
        }
        this.cleanValue();
        if (!value.length) {
            return this;
        }
        var inst = this;
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
        $.each(value, function(i, arr) {
            var $row = inst.getRowByIndex(i + 1);
            $.each(arr, function(j, _value) {
                $row.find('.' + inst.getConfigParam('elementClass')).eq(j).val(_value).autogrow('resize');
            });
        });
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    Table.prototype.setMinRow = function (minRow) {
        var value = this.getValue();
        this.setOption('minRow', minRow);
        this.createRowBody();
        this.setValue(value);
        return this;
    }
    
    Table.prototype.setMaxRow = function (maxRow) {
        var value = this.getValue();
        this.setOption('maxRow', maxRow);
        this.createRowBody();
        this.setValue(value);
        return this;
    }
    
    Table.prototype.createControl = function() {
        var name = this.getName();
        var $ul = $('<table/>', $.extend(true, {
            id: this.getConfigParam('controlIdPrefix') + name
        }, this.getOption('controlAttributes')));
        return new Nth.Dom.Node($ul);
    }
    
    Table.prototype.createColumnHeaders = function() {
        this.getControl().getNode().html(null);
        var columnHeaders = this.getOption('columnHeaders');
        var $colgroup = $('<colgroup/>');
        var $thead = $('<thead/>');
        var $tr = $('<tr/>');
        $.each(columnHeaders, function(i, option) {
            var $th = $('<th/>').html(option[0]);
            if (option[1]) {
                var $col = $('<col/>').attr('width', option[1]);
                $colgroup.append($col);
            }
            $tr.append($th);
        })
        var $act = $('<th/>', {'class': 'act'}).html('&nbsp;');
        this.getControl().getNode().html(null).append($colgroup, $thead.html($tr.append($act)));
        this.createRowBody();
        return this;
    }
    
    Table.prototype.createRowBody = function() {
        this.getControl().getNode().find('tbody').remove();
        this.getControl().getNode().append($('<tbody/>'));
        var minRow = this.getOption('minRow', 3);
        while (minRow > 0) {
            this.addRow();
            minRow--;
        }
        return this;
    }
    
    Table.prototype.cleanValue = function() {
        this.getRows().find('.' + this.getConfigParam('elementClass')).val(null);
        return this;
    }
    
    Table.prototype.getRowByIndex = function(index) {
        return this.getControl().getNode().find('tbody #' + this.getName() + '_tr_' +  index);
    }
    
    Table.prototype.addRow = function($relative) {
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
            this.getControl().getNode().find('tbody').append($row);
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
    
    Table.prototype.createRow = function(index) {
        var inst = this;
        var name = this.getName();
        var columnHeaders = this.getOption('columnHeaders');
        var $tr = $('<tr/>', {
            id: name + '_tr_' +  index,
            'data-index': index
        });
        $.each(columnHeaders, function(n) {
            var $td = $('<td/>');
            var $textarea = $('<textarea/>', {
                id: name + '_cell_' + index + n,
                name: name + '_cell_' + index + n,
                'class': inst.getConfigParam('elementClass')
            }).autogrow({
                context: inst.getControl().getNode(),
                animate: false,
                fixMinHeight: true
            });
            $tr.append($td.append($textarea));
        });
        var $rowAction = this.createRowAction(index);
        return $tr.append($('<td/>').append($rowAction));
    }
    
    Table.prototype.createRowAction = function(index) {
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
    
    Table.prototype.disableAddRowAction = function() {
        this.getRows().find('.act.add').attr('disabled', true).prop('disabled', true);
    }
    
    Table.prototype.enableAddRowAction = function() {
        this.getRows().find('.act.add').removeAttr('disabled').prop('disabled', false);
    }
    
    Table.prototype.disableRemoveRowAction = function() {
        this.getRows().find('.act.remove').attr('disabled', true).prop('disabled', true);
    }
    
    Table.prototype.enableRemoveRowAction = function() {
        this.getRows().find('.act.remove').removeAttr('disabled').prop('disabled', false);
    }
    
    Table.prototype.getNumberRows = function() {
        return this.getRows().length;
    }
    
    Table.prototype.getNumberColumns = function () {
        return this.getOption('columnHeaders', []).length;
    }
    
    Table.prototype.getMaxRowIndex = function() {
        var maxRowIndex = 0;
        this.getRows().each(function() {
            var rowIndex = $(this).attr('data-index');
            if (Number(rowIndex) > maxRowIndex) {
                maxRowIndex = Number(rowIndex);
            }
        });
        return maxRowIndex;
    }
    
    Table.prototype.getRows = function() {
        return this.getControl().getNode().find('tbody tr');
    }
    
    Table.prototype.removeRow = function(index) {
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
    
    Table.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Table element to DrawingBoard');
            return;
        }
        var table = new Table(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(table);
        table.inactiveOthers();
        return this;
    }
    
    Table.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Table element to DrawingBoard');
            return;
        }
        var table = new Table(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(table);
        table.inactiveOthers();
        return this;
    }
    
    Table.prototype.getPropertySetters = function() {
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
            , propertySetter.getColumnHeadersSetter()
            , propertySetter.getElementIdSetter()
            , propertySetter.getElementClassSetter()
            , propertySetter.getElementStyleSetter()
            , propertySetter.getElementTitleSetter()
            , propertySetter.getBindIndexSetter()
        ]);
        return options;
    }
    
    Table.prototype.toJson = function () {
        var json = Nth.FormBuilder.Element.prototype.toJson.call(this);
        if (this.isEmpty()) {
            delete json.options.value;
        } else {
            json.options.value = this.getValue();
        }
        json.options.controlAttributes = this.getControl().getAttributes();
        return json;
    }
    
    Table.__fromXml = function(xml, options) {
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
        return new Table(name, options);
    }
    
    Nth.FormBuilder.Element.Table = Table;
    
    return Table;
});