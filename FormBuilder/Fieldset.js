;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/Helper/Array',
            'Nth/FormBuilder/Row',
            'Nth/FormBuilder/Column',
            'Nth/FormBuilder/Element/Captcha',
            'Nth/FormBuilder/Element/Checkbox',
            'Nth/FormBuilder/Element/Date',
            'Nth/FormBuilder/Element/DateTime',
            'Nth/FormBuilder/Element/File',
            'Nth/FormBuilder/Element/Label',
            'Nth/FormBuilder/Element/List',
            'Nth/FormBuilder/Element/Radio',
            'Nth/FormBuilder/Element/Select',
            'Nth/FormBuilder/Element/Table',
            'Nth/FormBuilder/Element/Text',
            'Nth/FormBuilder/Element/Textarea',
            'Nth/FormBuilder/Element/Hidden'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Fieldset
     */
    var Fieldset = function (name, options) {
        this.components = [];
        this.usedIds = new Nth.Helper.Array();
        Nth.FormBuilder.Component.call(this, name, $.extend(true, {
            idPrefix: '_fieldset_',
            wrapperNodeName: 'fieldset',
            creatorLabel: 'Fieldset'
        }, options));
        this.getWrapper().getNode().data(this.__CLASS__, this).addClass(this.getConfigParam('formWrapperClass'));
        if (this.hasDrawingBoard()) {
            this.getWrapper().getNode().addClass(this.getConfigParam('edittingFormClass')).sortable({
                items: '.' + this.getConfigParam('componentRowClass'),
                greedy: false,
                placeholder: 'fb-placeholder'
            });
        }
    }

    Fieldset.prototype = Object.create(Nth.FormBuilder.Component.prototype);

    Fieldset.prototype.constructor = Fieldset;

    Fieldset.prototype.__CLASS__ = 'Nth.FormBuilder.Fieldset';
    
    Fieldset.prototype.getUsedIds = function () {
        return this.usedIds;
    }
    
    Fieldset.prototype.getFieldsetContainer = function() {
        return this;
    }
   
    Fieldset.prototype.getComponents = function () {
        return this.components;
    }

    Fieldset.prototype.addComponent = function () {
        var inst = this;
        $.each(arguments, function (i, component) {
            if ($.isArray(component)) {
                Fieldset.prototype.addComponent.apply(inst, component);
            } else if (component instanceof Nth.FormBuilder.Component) {
                var name = component.getName();
                if (inst.existsComponent(name)) {
                    console.warn('Component ' + name + ' has exists');
                    return;
                }
                if (!component.hasParentComponent()) {
                    console.warn('Can\'t add ' + name + ' component');
                    return;
                }
                var method = component.getOption('addingMethod', 'append');
                var relative = component.getOption('addingRelative', component.getParentComponent().getDomNode());
                $.getElement(relative)[method](component.getDomNode());
                inst.components.push(component);
            } else {
                throw 'The argument was passed must be an instance of Nth.FormBuilder.Component';
            }
        });
        return this;
    }

    Fieldset.prototype.getComponent = function (name) {
        var rs = this.getComponents().filter(function (c) {
            return c.getName() === name;
        });
        if (rs.length === 1) {
            return rs[0];
        }
        return null;
    }

    Fieldset.prototype.existsComponent = function (name) {
        return this.getComponent(name) instanceof Nth.FormBuilder.Component;
    }

    /**
     * Remove component recursively
     * @param {array|string} name array of components or name of component
     */
    Fieldset.prototype.removeComponent = function (name) {
        var inst = this;
        if ($.isArray(name)) {
            $.each(name, function (i, n) {
                inst.removeComponent(n);
            });
        } else {
            if (name instanceof Nth.FormBuilder.Component) {
                name = name.getName();
            }
            if ($.type(name) === 'string') {
                $.each(this.getComponents(), function (i, c) {
                    if (c.getName() === name) {
                        c.getDomNode().remove();
                        inst.getComponents().splice(i, 1);
                        $.each(c.getChilds(), function (j, k) {
                            inst.removeComponent(k.getName());
                        });
                        return false;
                    }
                });
            }
        }
        return this;
    }

    Fieldset.prototype.getActiveComponents = function () {
        var components = [];
        $.each(this.getComponents(), function (i, component) {
            if (component.actived()) {
                components.push(component);
            }
        });
        return components;
    }

    Fieldset.prototype.queryRows = function () {
        var rows = []
        $.each(this.getComponents(), function (i, component) {
            if (component instanceof Nth.FormBuilder.Row) {
                rows.push(component);
            }
        });
        return rows;
    }

    Fieldset.prototype.queryColumns = function () {
        var columns = []
        $.each(this.getComponents(), function (i, component) {
            if (component instanceof Nth.FormBuilder.Column) {
                columns.push(component);
            }
        });
        return columns;
    }

    Fieldset.prototype.queryElements = function () {
        var elements = []
        $.each(this.getComponents(), function (i, component) {
            if (component instanceof Nth.FormBuilder.Element) {
                elements.push(component);
            }
        });
        return elements;
    }

    Fieldset.prototype.countElements = function () {
        return this.queryElements().length;
    }

    Fieldset.prototype.findRow = function (name) {
        if (name instanceof $) {
            if (!name.hasClass(this.getConfigParam('componentRowClass'))) {
                name = name.closest('.' + this.getConfigParam('componentRowClass'));
            }
            name = name.attr('id');
        }
        var row = name ? this.getComponent(name) : null;
        return row instanceof Nth.FormBuilder.Row ? row : null;
    }

    Fieldset.prototype.findColumn = function (name) {
        if (name instanceof $) {
            if (!name.hasClass(this.getConfigParam('componentColumnClass'))) {
                name = name.closest('.' + this.getConfigParam('componentColumnClass'));
            }
            name = name.attr('id');
        }
        var column = name ? this.getComponent(name) : null;
        return column instanceof Nth.FormBuilder.Column ? column : null;
    }

    Fieldset.prototype.findElement = function (name) {
        if (name instanceof window.Element) {
            name = $(name);
        }
        if (name instanceof $) {
            if (!name.hasClass(this.getConfigParam('elementWrapperClass'))) {
                name = name.closest('.' + this.getConfigParam('elementWrapperClass'));
            }
            name = name.attr('id');
        }
        var element = name ? this.getComponent(name) : null;
        return element instanceof Nth.FormBuilder.Element ? element : null;
    }

    Fieldset.prototype.findComponentsByOption = function (name, value) {
        var components = [];
        $.each(this.getComponents(), function (i, component) {
            if (component.getOption(name) === value) {
                components.push(component);
            }
        });
        return components;
    }

    Fieldset.prototype.inactiveComponents = function () {
        return this.inactiveRows().inactiveColumns().inactiveElements();
    }

    Fieldset.prototype.inactiveRows = function () {
        this.getDomNode().find('.' + this.getConfigParam('componentRowClass')).removeClass(this.getConfigParam('activeRowClass'));
        return this;
    }

    Fieldset.prototype.inactiveColumns = function () {
        this.getDomNode().find('.' + this.getConfigParam('componentColumnClass')).removeClass(this.getConfigParam('activeColumnClass'));
        return this;
    }

    Fieldset.prototype.inactiveElements = function () {
        this.getDomNode().find('.' + this.getConfigParam('elementWrapperClass')).removeClass(this.getConfigParam('activeElementClass'));
        return this;
    }

    Fieldset.prototype.activeComponent = function (component) {
        if ($.isArray(component)) {
            var inst = this;
            $.each(component, function (i, c) {
                inst.activeComponent(c);
            });
        }
        if ($.type(component) === 'string') {
            component = this.getComponent(component);
        }
        if (component instanceof Nth.FormBuilder.Component) {
            component.active();
        }
        return this;
    }

    Fieldset.prototype.loadProperty = function () {
        if (this.hasToolPalette()) {
            this.getToolPalette().loadComponentProperty(this, 2);
        }
        return this;
    }

    Fieldset.prototype.getData = function () {
        var data = {
            name: this.getName(),
            data: []
        }
        $.each(this.queryElements(), function (i, element) {
            if (element.is('Label')) {
                return;
            }
            data.data.push(element.getData());
        });
        this.getWrapper().getNode().trigger('nth.fb.export-data', [data, this]);
        return data;
    }

    Fieldset.prototype.setData = function (data, options) {
        if (!$.isPlainObject(data) || !$.isArray(data.data)) {
            console.warn('Data format is incorrect');
            return this;
        }
        if ($.isFunction(options)) {
            options = {findElement: options}
        }
        options = $.extend({}, {
            findElement: function(item) {
                return this.findElement(item.name);
            },
            beforeSet: function() {}
        }, options);
        var inst = this;
        this.getWrapper().getNode().trigger('nth.fb.import-data', [data, this]);
        $.each(data.data, function (i, item) {
            var element = options.findElement.call(inst, item);
            if (element instanceof Nth.FormBuilder.Element) {
                if (false === options.beforeSet.call(element, inst)) {
                    return;
                }
                element.getWrapper().getNode().trigger('nth.fb.import-data', [item, element]);
                element.setValue(item.value);
                if (element.is('Checkbox') || element.is('Radio')) {
                    if (item.checked) {
                        element.check();
                    } else {
                        element.uncheck();
                    }
                }
            }
        });
        return this;
    }

    Fieldset.prototype.getEncodingData = function () {
        return Nth.FormBuilder.__getInstance().encodeXmlData(this.getData());
    }

    Fieldset.prototype.setEncodingData = function (data, options) {
        if (typeof data === 'string') {
            data = Nth.FormBuilder.__getInstance().decodeXmlData(data);
        }
        if (!$.isPlainObject(data)) {
            console.warn('Form data format is invalid!');
            return this;
        }
        return this.setData(data, options);
    }

    Fieldset.prototype.isValid = function (options) {
        if (typeof options === 'function') {
            options = {done: options}
        }
        options = new Nth.Options($.extend({}, {
            debug: false,
            start: function () {
            },
            done: function () {
            }
        }, options));
        var atm = new Nth.AsyncTaskManager({
            debug: options.getOption('debug'),
            auto: false
        });
        var opts = {
            start: options.getOption('start'),
            done: function () {
                atm.done();
                if (!this.getMessage() && atm.count()) {
                    atm.next();
                    return;
                }
                options.getOption('done').call(this);
            }
        }
        this.hideMessage().setMessage(null);
        var elements = this.queryElements();
        if (elements.length) {
            $.each(elements, function (i, element) {
                atm.add(element, element.isValid, [opts], 'VALIDATE_ELEMENT_' + element.getName());
            });
            atm.execute();
        } else {
            options.getOption('done').call(this);
        }
        return this;
    }

    Fieldset.prototype.reset = function (cb) {
        $.each(this.queryElements(), function (i, element) {
            if ($.isFunction(cb) && false === cb.call(element)) {
                return;
            }
            element.reset();
        });
        return this;
    }

    Fieldset.prototype.updateOrderIndex = function () {
        var inst = this;
        var $wrapper = this.getDomNode();
        $.each($wrapper.find('.' + this.getConfigParam('componentRowClass')), function (i, e) {
            var row = inst.findRow($(e));
            if (row) {
                row.setOption('orderIndex', i);
            }
            $.each($(this).find('.' + inst.getConfigParam('componentColumnClass')), function (j, e) {
                var column = inst.findColumn($(e));
                if (column) {
                    column.setOption('orderIndex', j);
                }
                $.each($(this).find('.' + inst.getConfigParam('elementWrapperClass')), function (k, e) {
                    var element = inst.findElement($(e));
                    if (element) {
                        element.setOption('orderIndex', k);
                    }
                });
            });
        });
        return this;
    }
    
    Fieldset.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var propertySetter = new Nth.FormBuilder.PropertySetter(this);
        return [
            propertySetter.getNameSetter()
            , propertySetter.getWrapperClassSetter()
            , propertySetter.getWrapperStyleSetter()
            , propertySetter.getMessageNotifierSetter()
        ]
    }
    
    /**
     * Return the first pair elements that have same the control id
     * else return an empty array
     */
    Fieldset.prototype.checkControlId = function() {
        var duplicate = [];
        var elements = this.queryElements();
        $.each(elements, function(i, e1) {
            if (e1.is('Label')) {
                return true;
            } else if (duplicate.length) {
                return false;
            }
            $.each(elements, function(i, e2) {
                if (!e2.notMe(e1) || e2.is('Label')) {
                    return true;
                } else if (e1.getControl().getNode().attr('id') === e2.getControl().getNode().attr('id')) {
                    duplicate.push.apply([e1, e2]);
                }
            });
        });
        return duplicate;
    }
    
    /**
     * Return the first pair elements that have same the columnRefer option
     * else return an empty array
     */
    Fieldset.prototype.checkColumnRefer = function() {
        var duplicate = [];
        var elements = this.queryElements();
        $.each(this.queryElements(), function(i, e1) {
            if (e1.is('Label')) {
                return true;
            } else if (duplicate.length) {
                return false;
            }
            $.each(elements, function(i, e2) {
                if (!e2.notMe(e1) || e2.is('Label')) {
                    return true;
                } else if (e1.getOption('columnRefer') === e2.getOption('columnRefer')) {
                    duplicate.push.apply([e1, e2]);
                }
            });
        });
        return duplicate;
    }

    Fieldset.prototype.toXml = function () {
        var $form = $('<form-builder/>');
        this.updateOrderIndex();
        this.getWrapper().getNode().removeClass(this.getConfigParam('edittingFormClass'));
        $form.append(Nth.FormBuilder.Component.prototype.toXml.call(this));
        return $form.prop('outerHTML');
    }

    Fieldset.__fromXml = function (xml, options) {
        options = $.extend({}, {
            drawingBoard: null,
            toolPalette: null
        }, options);
        var fb = Nth.FormBuilder.__getInstance();
        var $xmlDoc = fb.getXmlObject(xml).children('form-builder');
        $xmlDoc.children('form-config').children('parameter').each(function () {
            fb.setOption($(this).attr('name'), fb.decodeXmlData($(this).text()));
        });
        var $fieldset = $xmlDoc.children('component');
        var name = $fieldset.attr('name');
        $fieldset.children('options').children('option').each(function () {
            options[$(this).attr('name')] = fb.decodeXmlData($(this).text());
        });
        var fieldset = new Fieldset(name, options);
        if (options.drawingBoard instanceof Nth.FormBuilder.DrawingBoard) {
            options.drawingBoard.setFieldset(fieldset);
        }
        var childrens = [];
        var $childrens = $fieldset.children('childrens');
        $childrens.children('component').each(function () {
            var rc = new Nth.ReflectionClass($(this).attr('class'));
            var component = rc.getClass().__fromXml(this, {
                drawingBoard: options.drawingBoard,
                toolPalette: options.toolPalette,
                parentComponent: fieldset,
                autoInit: false
            });
            childrens.push(component);
        });
        $.each(childrens.sort(function (a, b) {
            return a.getOption('orderIndex') - b.getOption('orderIndex');
        }), function (i, component) {
            fieldset.addComponent(component);
        });
        $.each(fieldset.getComponents(), function(i, component) {
            component.init();
        });
        return fieldset;
    }

    Nth.FormBuilder.Fieldset = Fieldset;

    return Fieldset;
});