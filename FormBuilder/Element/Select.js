;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/Helper/Json', 
            'Nth/FormBuilder/Element'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Select Element
     */
    var Select = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_select_',
            creatorIconClass: 'icon select',
            creatorLabel: 'Select',
            waitingText: 'Loading..',
            emptyText: '-- Chưa chọn --',
            selectItemData: [
                ['', '-- Nothing selected --']
            ]
        }, options));
        name = this.getName();
        var controlId = this.getConfigParam('controlIdPrefix') + name;
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        var $control = $('<select/>', $.extend({}, {
            id: controlId,
            name: name,
            'class': this.getConfigParam('elementClass')
        }, this.getOption('controlAttributes')));
        this.control = new Nth.Dom.Node($control);
        var labelAttributes = this.getOption('labelAttributes', {});
        if (labelAttributes['for'] === undefined) {
            this.getLabel().getNode().attr('for', controlId);
        }
        this.getWrapper().getNode().addClass(rc.getShortName().toLowerCase()).append($control);
        if (this.getOption('autoInit', true)) {
            this.init();
        }        
        if (this.getOption('disabled')) {
            this.disable();
        }
    }
    
    Select.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Select.prototype.constructor = Select;
    
    Select.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Select';
    
    Select.prototype.init = function () {
        this.startBinding();
        if (!this.isDependent()) {
            this.createSelectItems();
        }
        this.handleBindByEvent();
        return this;
    }
    
    Select.prototype.getControl = function() {
        return this.control;
    }
    
    Select.prototype.setValue = function(value) {
        this.setOption('value', value);
        this.getControl().getNode().val(value);
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    Select.prototype.getValue = function() {
        return this.getControl().getNode().val();
    }
    
    Select.prototype.getData = function () {
        var item = {
            name: this.getName(),
            value: this.getValue(),
            columnRefer: this.getOption('columnRefer'),
            selectedText: this.getSelectedText()
        }
        this.getWrapper().getNode().trigger('nth.fb.export-data', [item, this]);
        return item;
    }
    
    Select.prototype.getSelectedText = function() {
        return this.getControl().getNode().find('option:selected').text();
    }
    
    Select.prototype.enable = function () {
        this.getControl().getNode().removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    Select.prototype.disable = function () {
        this.getControl().getNode().attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    Select.prototype.focus = function() {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }
    
    Select.prototype.blur = function() {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }
    
    Select.prototype.handleBindByEvent = function() {
        var inst = this;
        var deps = this.getDependentElements();
        var bindConstraint = this.getOption('bindConstraint');
        if (deps.length && bindConstraint === 1) {
            deps = [deps[deps.length - 1]];
        }
        $.each(deps, function(i, element) {
            var evtName = 'nth.fb.bound.' + inst.getName();
            element.getWrapper().getNode().off(evtName).on(evtName, function() {
                inst.createSelectItems();
            });
        });
        var evtName = 'change.nth.fb.' + inst.getName();
        this.getControl().getNode().off(evtName).on(evtName, function() {
            inst.bound([inst, $(this).find('option').html()]);
        });
    }
    
    Select.prototype.startBinding = function() {
        var $waitingOption = $('<option/>', {value: ''}).html(this.getOption('waitingText'));
        this.getControl().getNode().html($waitingOption);
        return this;
    }
    
    Select.prototype.ajaxLoadSelectItems = function(){
        var fb = Nth.FormBuilder.__getInstance();
        var url = this.getOption('selectItemUrl');
        if (!$.trim(url).match(/^https?:\/\//)) {
            url = this.getConfigParam('siteRoot') + url;
        }
        fb.getAsyncTaskManager().add(this, function() {
            this.startBinding();
            var inst = this;
            var data = $.extend({}, {
                'selected': this.getValue()
            }, this.getOption('selectItemRequestData'));
            var bindConstraint = this.getOption('bindConstraint');
            var dependentBindData = this.getDependentBindData();
            var jsonHelper = new Nth.Helper.Json(dependentBindData);
            if (bindConstraint === 1 && !$.isEmptyObject(dependentBindData) && jsonHelper.existsEmptyElement()) {
                var option = '<option value="">' + this.getOption('emptyText') + '</option>';
                this.getControl().getNode().html(option);
                this.bound([this, option]);
                fb.getAsyncTaskManager().done(url);
                return this;
            }
            data = $.extend({}, data, dependentBindData);
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(option) {
                    inst.getControl().getNode().html(option);
                    if (inst.existsOption('value')) {
                        inst.setValue(inst.getOption('value'));
                    } else if (inst.hasDefaultValue()) {
                        inst.setValue(inst.getDefaultValue());
                    }
                    inst.bound([inst, option]);
                    fb.getAsyncTaskManager().done(url);
                },
                error: function (e) {
                    fb.getAsyncTaskManager().done(e);
                }
            });    
        }, [] , url, this.getOption('debug'));
        return this;
    }
    
    Select.prototype.createSelectItems = function() {
        var selectItemData = this.getOption('selectItemData');
        if (this.getOption('selectItemUrl')) {
            this.ajaxLoadSelectItems();
        } else if (selectItemData) {
            var inst = this;
            var option = '';
            if (typeof selectItemData === 'string') {
                option = selectItemData;
            } else if ($.isArray(selectItemData)) {
                $.each(selectItemData, function(i, item) {
                    var value = item[0];
                    var name = item[1];
                    var selected = item[2] ? ' selected' : '';
                    option += '<option value="' + value + '"' + selected + '>' + name + '</option>';
                });
            }
            this.getControl().getNode().html(option);
            if (this.existsOption('value')) {
                this.setValue(this.getOption('value'));
            } else if (this.hasDefaultValue()) {
                this.setValue(this.getDefaultValue());
            }
            this.bound([inst, option]);
        }
        return this;
    }
    
    Select.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Select element to DrawingBoard');
            return;
        }
        var select = new Select(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(select);
        select.inactiveOthers();
        return this;
    }
    
    Select.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Select element to DrawingBoard');
            return;
        }
        var select = new Select(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(select);
        select.inactiveOthers();
        return this;
    }
    
    Select.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Element.prototype.getPropertySetters.call(this);
        var propertySetter= new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getDefaultValueSetter()
            , propertySetter.getRequiredSetter()
            , propertySetter.getMarksMandatorySetter()
            , propertySetter.getValidNameSetter()
            , propertySetter.getBindNameSetter()
            , propertySetter.getColumnReferSetter()
            , propertySetter.getSelectItemDataSetter()
            , propertySetter.getSelectItemUrlSetter()
            , propertySetter.getBindBySetter()
            , propertySetter.getBindConstraintSetter()
            , propertySetter.getValidElementRequiredSetter()
            , propertySetter.getBindIndexSetter()
            , propertySetter.getElementIdSetter()
            , propertySetter.getElementNameSetter()
            , propertySetter.getElementClassSetter()
            , propertySetter.getElementStyleSetter()
            , propertySetter.getDisabledSetter()
            , propertySetter.getElementTitleSetter()
        ]);
        return options;
    }
    
    Select.prototype.isValid = function (options) {
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
        if (false === options.getOption('start').call(this)) {
            return done();
        }
        var value = this.getValue();
        var strHelper = new Nth.Helper.String();
        var validator = Nth.Validator.__getInstance();
        var validName = this.getValidName();
        if (this.getOption('required') && this.isEmpty()) {
            var requiredText = validator.getOption('reselectText');
            strHelper.setString(requiredText);
            this.setMessage(strHelper.sprintf(validName));
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
    
    Select.prototype.toJson = function () {
        var json = Nth.FormBuilder.Element.prototype.toJson.call(this);
        if (this.isEmpty() && this.hasDefaultValue()) {
            delete json.options.value;
        } else {
            json.options.value = this.getValue();
            delete json.options.defaultValue;
        }
        json.options.controlAttributes = this.getControl().getAttributes();
        return json;
    }    
    
    Select.__fromXml = function(xml, options) {
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
        return new Select(name, options);
    }
    
    Nth.FormBuilder.Element.Select = Select;
    
    return Select;
});