;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/Confirm',
            'Nth/Validator',
            'Nth/Dom/Node',
            'Nth/Helper/String',
            'Nth/FormBuilder/FormBuilder',
            'Nth/FormBuilder/Component',
            'Nth/FormBuilder/Fieldset'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {

    var Element = function (name, options) {
        var inst = this;
        Nth.FormBuilder.Component.call(this, name, $.extend(true, {
            showLabel: true,
            controlOnly: false,
            idPrefix: '_element_',
            marksMandatory: 1,
            bindIndex: 0,
            bindConstraint: 1
        }, options));
        name = this.getName();
        var $label = $('<label/>', $.extend({}, {
            id: '_lbl_' + name,
            'class': this.getConfigParam('elementLabelClass')
        }, this.getOption('labelAttributes')));
        var label = this.getOption('label');
        if (label === null) {
            label = this.getOption('creatorLabel') + ' ' + this.getCurrentIndex();
        } else if (label === false) {
            $label.hide();
        }
        var $labelContent = $('<span/>', {
            'class': this.getConfigParam('elementLabelContentClass')
        }).html(label);
        this.label = new Nth.Dom.Node($label.append($labelContent));
        this.checkForMarkingMandatory();
        this.getWrapper().getNode().addClass(this.getConfigParam('elementWrapperClass')).append(this.getLabel().getNode());
        if (this.hasDrawingBoard()) {
            var $toolbox = this.createToolbox();
            this.getWrapper().getNode().append($toolbox).on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var actived = inst.actived();
                if (!e.ctrlKey) {
                    inst.getDrawingBoard().getFieldset().inactiveElements();
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

    Element.prototype = Object.create(Nth.FormBuilder.Component.prototype);

    Element.prototype.constructor = Element;

    Element.prototype.__CLASS__ = 'Nth.FormBuilder.Element';
    
    Element.prototype.bound = function (args) {
        this.trigger('nth.fb.bound', args);
        return this;
    }
    
    Element.prototype.setName = function (name) {
        Nth.FormBuilder.Component.prototype.setName.call(this, name);
        this.getLabel().getNode().attr('id', '_lbl_' + name);
        return this;
    }

    Element.prototype.getLabel = function () {
        return this.label;
    }
    
    Element.prototype.getDefaultValue = function () {
        return this.getOption('defaultValue');
    }
    
    Element.prototype.setDefaultValue = function (defaultValue) {
        this.setOption('defaultValue', defaultValue);
        return this;
    }
    
    Element.prototype.hasDefaultValue = function () {
        return this.existsOption('defaultValue');
    }

    Element.prototype.getValue = function () {
        return null;
    }
    
    Element.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue()
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }

    Element.prototype.setValue = function () {
        return this;
    }

    Element.prototype.reset = function () {
        if (this.getOption('disabled')) {
            this.disable();
        } else {
            this.enable();
        }
        this.setValue(this.getDefaultValue());
        return this;
    }

    Element.prototype.getLabelContent = function () {
        return this.getLabel().getNode().find('.' + this.getConfigParam('elementLabelContentClass'));
    }

    Element.prototype.getLabelOption = function () {
        return this.getLabelContent().html();
    }

    Element.prototype.setLabelOption = function (label) {
        this.getLabelContent().html(label);
        this.setOption('label', label);
        return this;
    }

    Element.prototype.getLabelMandatory = function () {
        return this.getLabel().getNode().find('.' + this.getConfigParam('elementRequiredLabelClass'));
    }

    Element.prototype.checkForMarkingMandatory = function () {
        if (this.getOption('required') && this.getOption('marksMandatory')) {
            var $mandatory = this.getLabel().getNode().find('.' + this.getConfigParam('elementRequiredLabelClass'));
            if (!$mandatory.length) {
                var $mandatory = $('<span/>', {
                    'class': this.getConfigParam('elementRequiredLabelClass'),
                    title: this.getConfigParam('mandatoryTitle')
                }).html(this.getConfigParam('elementRequiredLabelContent'));
                this.getLabel().getNode().append($mandatory);
            }
        } else if (!this.getOption('required') || !this.getOption('marksMandatory')) {
            this.getLabel().getNode().find('.' + this.getConfigParam('elementRequiredLabelClass')).remove();
        }
        return this;
    }

    Element.prototype.getBindName = function () {
        if (this.getOption('bindName')) {
            return this.getOption('bindName');
        }
        return this.getName();
    }

    Element.prototype.getValidName = function () {
        if (this.getOption('validName')) {
            return this.getOption('validName');
        }
        return this.getLabel().getNode().find('.' + this.getConfigParam('elementLabelContentClass')).html();
    }

    Element.prototype.setRequired = function (required) {
        this.setOption('required', required).checkForMarkingMandatory();
        return this;
    }

    Element.prototype.getDependentElements = function () {
        var bindBy = this.getOption('bindBy');
        return this.query(bindBy);
    }

    Element.prototype.query = function (cond) {
        var inst = this;
        var elements = [];
        if ($.isArray(cond)) {
            $.each(cond, function (i, item) {
                if ($.type(item) === 'string') {
                    elements.push.apply(elements, inst.queryBySelector(item));
                } else if (item instanceof Element) {
                    elements.push(item);
                }
            });
        } else if ($.type(cond) === 'string') {
            elements.push.apply(elements, this.queryBySelector(cond));
        } else if (cond instanceof Element) {
            elements.push(cond);
        }
        return elements.sort(function (a, b) {
            return a.getOption('bindIndex') - b.getOption('bindIndex');
        });
    }

    Element.prototype.queryBySelector = function (selector) {
        var elements = [];
        var fieldset = this.getFieldsetContainer();
        if (!fieldset) {
            return elements;
        }
        try {
            var elementWrapperClass = this.getConfigParam('elementWrapperClass');
            fieldset.getDomNode().find(selector).each(function () {
                var $wrapper = $(this);
                if (!$wrapper.hasClass(elementWrapperClass)) {
                    $wrapper = $wrapper.closest('.' + elementWrapperClass);
                }
                var name = $wrapper.attr('id');
                var element = fieldset.getComponent(name);
                if (element instanceof Element) {
                    elements.push(element);
                }
            });
            return elements.sort(function (a, b) {
                return a.getOption('bindIndex') - b.getOption('bindIndex');
            });
        } catch(e) {
            console.warn(e);
            return elements;
        }
    }

    Element.prototype.isEmpty = function () {
        return !this.getValue();
    }

    Element.prototype.isDependent = function () {
        return this.getDependentElements().length > 0;
    }

    Element.prototype.getDependentBindData = function () {
        var data = {};
        $.each(this.getDependentElements(), function (i, element) {
            data[element.getBindName()] = element.getValue();
        });
        return data;
    }

    Element.prototype.actived = function () {
        return this.getWrapper().getNode().hasClass(this.getConfigParam('activeElementClass'));
    }

    Element.prototype.active = function () {
        return this.getWrapper().getNode().addClass(this.getConfigParam('activeElementClass'));
    }
    
    Element.prototype.inactiveOthers = function () {
        if (this.hasDrawingBoard()) {
            this.getDrawingBoard().getFieldset().inactiveElements();
            this.active();
        }
        return this;
    }

    Element.prototype.getCreatorDraggableOptions = function () {
        var options = Nth.FormBuilder.Component.prototype.getCreatorDraggableOptions.call(this);
        if (this.hasDrawingBoard()) {
            var id = this.getDrawingBoard().getContainer().attr('id');
            var wrapperNodeName = this.getDrawingBoard().getFieldset().getOption('wrapperNodeName')
            options.connectToSortable = '#' + id + ' ' + wrapperNodeName + ' .' + this.getConfigParam('componentRowClass') + ' .' + this.getConfigParam('componentColumnClass');
        }
        return options;
    }

    Element.prototype.getOptionsCopy = function () {
        var options = Nth.FormBuilder.Component.prototype.getOptionsCopy.call(this);
        if (this.hasDrawingBoard()) {
            var drawingBoard = this.getDrawingBoard();
            var $dragging = drawingBoard.getDragging();
            if ($dragging.length) {
                options.addingRelative = $dragging;
                options.addingMethod = 'replaceWith';
                options.parentComponent = this.getParentColumnByNode($dragging);
            } else {
                if (!options.parentComponent) {
                    var columns = drawingBoard.getFieldset().queryColumns();
                    var activeColumn = null;
                    $.each(columns, function (i, column) {
                        if (column.actived()) {
                            activeColumn = column;
                        }
                    });
                    options.parentComponent = activeColumn ? activeColumn : columns[columns.length - 1];
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

    Element.prototype.getOptionsClone = function () {
        var options = $.extend(true, {
            wrapperAttributes: {},
            labelAttributes: {},
            controlAttributes: {}
        }, this.getOptionsCopy());
        delete options.wrapperAttributes.id;
        delete options.wrapperAttributes.name;
        delete options.labelAttributes.id;
        delete options.labelAttributes['for'];
        delete options.controlAttributes.id;
        delete options.controlAttributes.name;
        delete options.columnRefer;
        options.label = this.getLabelOption();
        return options;
    }

    Element.prototype.getParentColumnByNode = function ($node) {
        var fieldset = this.getFieldsetContainer();
        if (!fieldset || !$node.length) {
            return null;
        }
        var name = $node.closest('.' + this.getConfigParam('componentColumnClass')).attr('id');
        return fieldset.getComponent(name);
    }

    Element.prototype.findParentColumn = function () {
        var fieldset = this.getFieldsetContainer();
        if (fieldset) {
            var name = this.getWrapper().getNode().closest('.' + this.getConfigParam('componentColumnClass')).attr('id');
            return fieldset.getComponent(name);
        }
        return null;
    }

    Element.prototype.createToolbox = function () {
        var inst = this;
        var name = this.getName();
        var $wrapper = $('<div/>', {'class': 'control-toolpalette'});
        var $duplicate = $('<span/>', {
            'class': 'duplicate',
            title: 'Duplicate'
        });
        $duplicate.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            inst.cloneToDrawingBoard();
        });
        var $edit = $('<span/>', {
            'class': 'edit',
            title: 'Property of ' + name
        });
        $edit.on('click', function (e) {
            e.preventDefault();
            if (inst.actived()) {
                e.stopPropagation();
            }
            inst.loadProperty();
        });
        var $delete = $('<span/>', {
            'class': 'delete',
            title: 'Remove ' + name
        });
        $delete.on('click', function (e) {
            e.preventDefault();
            if (inst.actived()) {
                e.stopPropagation();
            }
            Nth.Confirm('Có chắc bạn muốn xóa?', function (choosed) {
                if (choosed === Nth.Confirm.OK) {
                    if (inst.hasToolPalette()) {
                        inst.getToolPalette().deleteComponent(inst);
                    }
                    inst.getDrawingBoard().getFieldset().removeComponent(name);
                }
            });
        });
        return $wrapper.append($duplicate, $edit, $delete);
    }

    Element.prototype.getPropertySetters = function () {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Component.prototype.getPropertySetters.call(this);
        var propertySetter = new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getElementLabelSetter()
        ]);
        return options;
    }

    Element.prototype.getFilters = function () {
        if (!$.isArray(this.getOption('filters'))) {
            this.setOption('filters', []);
        }
        return this.getOption('filters');
    }

    Element.prototype.setFilters = function (filters) {
        if (!$.isArray(filters)) {
            throw 'filters must be an array';
        }
        this.setOption('filters', filters);
        return this;
    }
    
    Element.prototype.getFiltersJson = function () {
        var filters = [];
        $.each(this.getFilters(), function (i, filter) {
            filters.push(filter.toJson());
        });
        return filters;
    }
    
    Element.prototype.initFilters = function () {
        var inst = this;
        var filters = [];
        $.each(this.getFilters(), function(i, filter) {
            if ($.isPlainObject(filter)) {
                var cls = new Nth.ReflectionClass(filter.name).getClass();
                filter = new cls(filter.options);
            }
            filters.push(filter.setElement(inst));
        });
        this.setFilters(filters);
        return this;
    }
    
    Element.prototype.hookFilters = function () {
        var inst = this;
        $.each(this.getSupportFilters().filters, function (i, options) {
            options.filter.setElement(inst).onUnhook();
        });
        $.each(this.getFilters(), function(i, filter) {
            filter.onHook();
        });
        return this;
    }

    Element.prototype.getFilter = function (name) {
        var rs = this.getFilters().filter(function (a) {
            return a.__CLASS__ === name;
        });
        return rs.length === 1 ? rs[0] : null;
    }
    
    Element.prototype.hasFilter = function (name) {
        return !!this.getFilter(name);
    }
    
    Element.prototype.removeFilters = function () {
        $.each(this.getFilters(), function(i, filter) {
            filter.onUnhook();
        });
        this.removeOption('filters');
        return this;
    }
    
    Element.prototype.removeFilter = function (name) {
        var inst = this;
        $.each(this.getFilters(), function(i, filter) {
            if (filter.__CLASS__ === name) {
                filter.onUnhook();
                inst.getFilters().splice(i, 1);
                return false;
            }
        });
        return this;
    }

    Element.prototype.setFilter = function (name, options) {
        var obj = null;
        if (typeof name === 'string') {
            var cls = new Nth.ReflectionClass(name).getClass();
            obj = new cls(options);
        } else if (name instanceof Nth.Filter) {
            obj = name;
        } else if ($.isPlainObject(name)) {
            var cls = new Nth.ReflectionClass(name.name).getClass();
            obj = new cls(name.options);
        }
        if (obj instanceof Nth.Filter) {
            this.removeFilter(obj.__CLASS__);
            this.getFilters().push(obj);
            obj.setElement(this).onHook();
        }
        return this;
    }
    
    Element.prototype.getValidators = function () {
        if (!$.isArray(this.getOption('validators'))) {
            this.setOption('validators', []);
        }
        return this.getOption('validators');
    }

    Element.prototype.setValidators = function (validators) {
        if (!$.isArray(validators)) {
            throw 'validators must be an array';
        }
        this.setOption('validators', validators);
        return this;
    }
    
    Element.prototype.getValidatorsJson = function () {
        var validators = [];
        $.each(this.getValidators(), function (i, validator) {
            validators.push(validator.toJson());
        });
        return validators;
    }
    
    Element.prototype.initValidators = function () {
        var inst = this;
        var validators = [];
        $.each(this.getValidators(), function(i, validator) {
            if ($.isPlainObject(validator)) {
                var cls = new Nth.ReflectionClass(validator.name).getClass();
                validator = new cls(validator.options);
            }
            validators.push(validator.setElement(inst));
        });
        this.setValidators(validators);
        return this;
    }
    
    Element.prototype.hookValidators = function () {
        var inst = this;
        $.each(this.getSupportValidators().validators, function (i, options) {
            options.validator.setElement(inst).onUnhook();
        });
        $.each(this.getValidators(), function(i, validator) {
            validator.onHook();
        });
        return this;
    }

    Element.prototype.getValidator = function (name) {
        var rs = this.getValidators().filter(function (a) {
            return a.__CLASS__ === name;
        });
        return rs.length === 1 ? rs[0] : null;
    }
    
    Element.prototype.hasValidator = function (name) {
        return !!this.getValidator(name);
    }
    
    Element.prototype.removeValidators = function () {
        $.each(this.getValidators(), function(i, validator) {
            validator.onUnhook();
        });
        this.removeOption('validators');
        return this;
    }
    
    Element.prototype.removeValidator = function (name) {
        var inst = this;
        $.each(this.getValidators(), function(i, validator) {
            if (validator.__CLASS__ === name) {
                validator.onUnhook();
                inst.getValidators().splice(i, 1);
                return false;
            }
        });
        return this;
    }

    Element.prototype.setValidator = function (name, options) {
        var obj = null;
        if (typeof name === 'string') {
            var cls = new Nth.ReflectionClass(name).getClass();
            obj = new cls(options);
        } else if (name instanceof Nth.Validator) {
            obj = name;
        } else if ($.isPlainObject(name)) {
            var cls = new Nth.ReflectionClass(name.name).getClass();
            obj = new cls(name.options);
        }
        if (obj instanceof Nth.Validator) {
            this.removeValidator(obj.__CLASS__);
            this.getValidators().push(obj);
            obj.setElement(this).onHook();
        }
        return this;
    }
    
    Element.prototype.getSupportValidators = function () {
        return {
            removable: true,
            validators: [
                {validator: new Nth.Validator.Cmnd()},
                {validator: new Nth.Validator.Date()},
                {validator: new Nth.Validator.EmailAddress()},
                {validator: new Nth.Validator.Number()},
                {validator: new Nth.Validator.PhoneNumber()},
                {validator: new Nth.Validator.Unit()}
            ]
        }
    }
    
    Element.prototype.getSupportFilters = function () {
        return {
            removable: true,
            filters: []
        }
    }
    
    Element.prototype.isValid = function (options) {
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
        var value = this.getValue();
        var strHelper = new Nth.Helper.String();
        var validator = Nth.Validator.__getInstance();
        var validName = this.getValidName();
        if (this.getOption('required') && this.isEmpty()) {
            var requiredText = validator.getOption('retypeText');
            strHelper.setString(requiredText);
            this.setMessage(strHelper.sprintf(validName));
            return done();
        }
        var authElement = this.getOption('authElement');
        if (authElement) {
            var elements = this.query(authElement);
            if (elements.length === 1) {
                var element = elements[elements.length - 1];
                if (!element.isEmpty() && this.isEmpty()) {
                    strHelper.setString(validator.getOption('retypeText'));
                    this.setMessage(strHelper.sprintf(validName));
                    return done();
                }
                var authValue = element.getValue();
                if (value !== authValue) {
                    strHelper.setString(validator.getOption('notRight'));
                    this.setMessage(strHelper.sprintf(validName));
                    return done();
                }
            }
        }
        if (this.isEmpty()) {
            return done();
        }
        $.each(this.getValidators(), function(i, validator) {
            if (!validator.isValid(value)) {
                inst.setMessage(validator.getMessage());
                return false;
            }
        });
        return done();
    }

    Element.prototype.is = function (cls) {
        return this instanceof Element[cls];
    }
    
    Element.prototype.toJson = function () {
        var json = Nth.FormBuilder.Component.prototype.toJson.call(this);
        json.options.label = this.getLabelContent().html();
        json.options.labelAttributes = this.getLabel().getAttributes();
        json.options.validators = this.getValidatorsJson();
        json.options.filters = this.getFiltersJson();
        return json;
    }

    Nth.FormBuilder.Element = Element;

    return Element;
});