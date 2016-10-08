;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/Options',
            'Nth/ReflectionClass',
            'Nth/Dom/Node',
            'Nth/FormBuilder/FormBuilder',
            'Nth/FormBuilder/DrawingBoard',
            'Nth/FormBuilder/ToolPalette',
            'Nth/FormBuilder/PropertySetter'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var Component = function(name, options) {
        Nth.Options.call(this, $.extend(true, {
            idPrefix: '_component_',
            wrapperNodeName: 'div',
            parentComponent: null
        }, options));
        if (name === true) {
            name = this.generateId();
        } else {
            name = this.getConfigParam('componentNamePrefix') + name;
        }
        var $div = $('<' + this.getOption('wrapperNodeName') + '/>', $.extend(true, { 
            id: name
        }, this.getOption('wrapperAttributes')));
        this.wrapper = new Nth.Dom.Node($div);
        this.message = null;
        if (this.getOption('hide')) {
            $div.hide();
        }
    }
    
    Component.prototype = Object.create(Nth.Options.prototype);
    
    Component.prototype.constructor = Component;
    
    Component.prototype.__CLASS__ = 'Nth.FormBuilder.Component';
    
    Component.prototype.init = function () {
        return this;
    }
    
    Component.prototype.trigger = function (evt, args) {
        this.getWrapper().getNode().trigger(evt, args || [this]);
        return this;
    }
    
    Component.prototype.generateId = function() {
        var $container = $('body');
        if (this.hasDrawingBoard()) {
            $container = this.getDrawingBoard().getContainer();
        }
        var fieldset = this.getFieldsetContainer();
        var prefix = this.getConfigParam('componentNamePrefix') + this.getOption('idPrefix');
        if ($container.length && fieldset) {    
            var i = 1;
            var id = prefix + i
            while ($container.find('#' + id).length || fieldset.existsComponent(id) || fieldset.getUsedIds().hasItem(id)) {
                id = prefix + ++i;
            }
            this.setCurrentIndex(i);
            fieldset.getUsedIds().addItem(id);
            return id;
        }
        return prefix + new Date().getTime() + '_' + Math.round(Math.random() * 10);
    }
    
    Component.prototype.getConfigParam = function (name) {
        if (this.existsOption(name)) {
            return this.getOption(name)
        }
        var fieldset = this.getFieldsetContainer();
        if (fieldset && fieldset.existsOption(name)) {
            return fieldset.getOption(name);
        }
        return Nth.FormBuilder.__getInstance().getOption(name);
    }
    
    Component.prototype.setConfigParam = function (name, value) {
        this.setOption(name, value);
        return this;
    }
    
    Component.prototype.getCurrentIndex = function() {
        return this.currentIndex || '';
    }
    
    Component.prototype.setCurrentIndex = function(currentIndex) {
        this.currentIndex = currentIndex;
        return this;
    }
    
    Component.prototype.focus = function() {
        return this;
    }
    
    Component.prototype.blur = function() {
        return this;
    }
    
    Component.prototype.hide = function () {
        this.getWrapper().getNode().hide().trigger('nth.fb.hidden');
        return this;
    }

    Component.prototype.show = function () {
        this.getWrapper().getNode().show().trigger('nth.fb.shown');
        return this;
    }
    
    Component.prototype.enable = function () {
        this.getWrapper().getNode().removeClass(this.getConfigParam('componentDisabledClass'));
        return this;
    }
    
    Component.prototype.disable = function () {
        this.getWrapper().getNode().addClass(this.getConfigParam('componentDisabledClass'));
        return this;
    }
    
    Component.prototype.getMessage = function() {
        return this.message;
    }
    
    Component.prototype.setMessage = function(message) {
        this.message = message;
        return this;
    }
    
    Component.prototype.hasMessage = function () {
        return !!this.getMessage();
    }
    
    Component.prototype.showMessage = function() {
        var $error = this.getWrapper().getNode().children('.' + this.getConfigParam('elementErrorMessageClass'));
        if (!$error.length) {
            $error = $('<p>', {'class': this.getConfigParam('elementErrorMessageClass')});
        }
        $error.html(this.getMessage());
        this.getWrapper().getNode().addClass(this.getConfigParam('elementErrorClass')).append($error);
        this.focus();
        return this;
    }
    
    Component.prototype.hideMessage = function() {
        this.getWrapper().getNode().children('.' + this.getConfigParam('elementErrorMessageClass')).remove();
        this.getWrapper().getNode().removeClass(this.getConfigParam('elementErrorClass'));
        this.blur();
        return this;
    }
    
    Component.prototype.notifyMessage = function () {
        var messageNotifier = this.getConfigParam('messageNotifier');
        if (messageNotifier === 1) {
            var inst = this;
            return Nth.Alert(this.getMessage(), function () {
                inst.focus();
            });
        }
        return this.showMessage();
    }
    
    Component.prototype.getWrapper = function() {
        return this.wrapper;
    }
    
    Component.prototype.getName = function() {
        return this.getWrapper().getNode().attr('id');
    }
    
    Component.prototype.setName = function(name) {
        this.getWrapper().getNode().attr('id', name);
        return this;
    }
    
    Component.prototype.actived = function() {
        return false;
    }
    
    Component.prototype.active = function() {
        return this;
    }
    
    Component.prototype.getToolbox = function() {
        return this.toolbox;
    }
    
    Component.prototype.setToolbox = function(toolbox) {
        this.toolbox = toolbox;
        return this;
    }
    
    Component.prototype.getDrawingBoard = function() {
        return this.getOption('drawingBoard');
    }
    
    Component.prototype.setDrawingBoard = function(drawingBoard) {
        if (!(drawingBoard instanceof Nth.FormBuilder.DrawingBoard)) {
            throw '"drawingBoard" argument must be an instanceof FormBuilder.DrawingBoard';
        }
        this.setOption('drawingBoard', drawingBoard);
        return this;
    }
    
    Component.prototype.hasDrawingBoard = function() {
        return this.getDrawingBoard() instanceof Nth.FormBuilder.DrawingBoard;
    }
    
    Component.prototype.getToolPalette = function() {
        return this.getOption('toolPalette');
    }
    
    Component.prototype.setToolPalette = function(toolPalette) {
        if (!(toolPalette instanceof Nth.FormBuilder.ToolPalette)) {
            console.warn('The argument was passed must be an instance of FormBuilder.ToolPalette');
            return this;
        }
        this.setOption('toolPalette', toolPalette);
        return this;
    }
    
    Component.prototype.hasToolPalette = function() {
        return this.getToolPalette() instanceof Nth.FormBuilder.ToolPalette;
    }
    
    Component.prototype.getParentComponent = function() {
        return this.getOption('parentComponent');
    }
    
    Component.prototype.setParentComponent = function(component) {
        if (!(component instanceof Component)) {
            console.warn('The argument was passed must be an instanceof Nth.FormBuilder.Component');
            return this;
        }
        this.setOption('parentComponent', component);
        return this;
    }
    
    Component.prototype.hasParentComponent = function() {
        return this.getParentComponent() instanceof Component;
    }
    
    Component.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add component to DrawingBoard');
            return;
        }
        var component = new Component(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(component);
    }
    
    Component.prototype.getChilds = function() {
        var inst = this;
        var childs = [];
        var fieldset = this.getFieldsetContainer();
        if (fieldset) {
            $.each(fieldset.getComponents(), function(i, c) {
                if (!c.hasParentComponent()) {
                    return;
                }
                if (c.getParentComponent().getName() === inst.getName()) {
                    childs.push(c);
                }
            });
        }
        return childs;
    }
    
    Component.prototype.getActivedChilds = function() {
        return this.getChilds().filter(function (c) {
            return c.actived();
        });
    }
    
    Component.prototype.getLastActivedChild = function() {
        var childs = this.getActivedChilds();
        if (childs.length) {
            return childs[childs.length - 1];
        }
        return null
    }
    
    Component.prototype.getOptionsCopy = function () {
        var options = $.extend({
            drawingBoard: this.getDrawingBoard(),
            toolPalette: this.getToolPalette(),
            parentComponent: null,
            addingMethod: null,
            addingRelative: null
        }, this.getOptions());
        if (this.hasParentComponent()) {
            options.parentComponent = this.getParentComponent();
            options.addingRelative = this.getParentComponent().getWrapper().getNode();
        }
        if (this.hasToolPalette()) {
            var setting = this.getToolPalette().getComponentSetting();
            options.addingMethod = setting.typeToAdd;
        }
        return options;
    }
    
    Component.prototype.getCreatorDraggableOptions = function() {
        var inst = this;
        var drawingBoard = this.getDrawingBoard();
        return {
            cursor: 'move',
            connectToSortable: null,
            helper: 'clone',
            stop: function () {
                if (drawingBoard.getDragging().length) {
                    inst.copyToDrawingBoard();
                    drawingBoard.removeDragging();
                }
            }
        }
    }
    
    Component.prototype.getCreatorContainer = function() {
        return $.getElement(this.getOption('creatorContainer'));
    }
    
    Component.prototype.createCreator = function() {
        var $creatorContainer = this.getCreatorContainer();
        if (!$creatorContainer.length) {
            console.warn('Can\'t not create component creator');
            return;
        }
        var inst = this;
        var $wrapper = $('<div/>', { 'class': 'creator-wrapper' });
        var $icon = $('<span/>', { 'class': 'creator-icon ' + this.getOption('creatorIconClass') });
        var $label = $('<a/>', { 'class': 'creator-label', 'href': 'javascript:;' }).html(this.getOption('creatorLabel'));
        $creatorContainer.append($wrapper.append($icon, $label));
        if (this.hasDrawingBoard()) {
            $wrapper.draggable(this.getCreatorDraggableOptions());
            $wrapper.on('click', function() {
                inst.copyToDrawingBoard();
            });
        }
        return $wrapper.disableSelection();
    }
    
    Component.prototype.getDomNode = function() {
        var wrapper = this.getWrapper();
        return wrapper ? wrapper.getNode() : $();
    }
    
    Component.prototype.getFieldsetContainer = function() {
        if (this.hasDrawingBoard()) {
            var fieldset = this.getDrawingBoard().getFieldset();
            if (fieldset instanceof Nth.FormBuilder.Fieldset) {
                return fieldset;
            }
        }
        var component = this.getParentComponent();
        while (component instanceof Component) {
            if (component instanceof Nth.FormBuilder.Fieldset) {
                return component;
            }
            component = component.getParentComponent();
        }
        return null;
    }
    
    Component.prototype.notMe = function(name) {
        if (name instanceof Component) {
            name = name.getName();
        }
        return this.getName() !== name;
    }
    
    Component.prototype.hasNameExists = function(name) {
        var fieldset = this.getFieldsetContainer();
        if (fieldset) {
            return fieldset.existsComponent(name);
        }
        return false;
    }
    
    Component.prototype.hasElementIdExists = function(id) {
        var fieldset = this.getFieldsetContainer();
        if (fieldset) {
            return fieldset.getDomNode().find('.' + this.getConfigParam('elementWrapperClass') + ' #' + id).length;
        }
        return false;
    }
    
    Component.prototype.hasElementNameExists = function(name) {
        var fieldset = this.getFieldsetContainer();
        if (fieldset) {
            return fieldset.getDomNode().find('[name="' + name + '"]').length;
        }
        return false;
    }
    
    Component.prototype.hasColumnReferExists = function(columnRefer) {
        var result = false;
        var fieldset = this.getFieldsetContainer();
        if (fieldset && columnRefer) {
            var inst = this;
            $.each(fieldset.getComponents(), function(i, c) {
                if (inst.notMe(c.getName()) && c.getOption('columnRefer') === columnRefer) {
                    result = true;
                    return false;
                }
            });
        }
        return result;
    }
    
    Component.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var propertySetter = new Nth.FormBuilder.PropertySetter(this);
        return [
            propertySetter.getNameSetter()
            , propertySetter.getWrapperClassSetter()
            , propertySetter.getWrapperStyleSetter()
        ]
    }
    
    Component.prototype.loadProperty = function() {
        if (this.hasToolPalette()) {
            this.getToolPalette().loadComponentProperty(this)
        }
        return this;
    }
    
    Component.prototype.isValid = function(options) {
        if (typeof options === 'function') {
            options = {done: options}
        }
        options = new Nth.Options($.extend({}, {
            start: function() {},
            done: function() {}
        }, options));
        this.setMessage(null);
        options.getOption('start').call(this);
        options.getOption('done').call(this);
        return this;
    }
    
    Component.prototype.toJson = function () {
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        var json = {
            name: this.getName(),
            type: rc.getShortName(),
            'class': rc.getName(),
            options: this.cloneOptions()
        };
        json.options.active = this.actived();
        json.options.wrapperAttributes = this.getWrapper().getAttributes();
        return json;
    }
    
    Component.prototype.toXml = function() {
        var fb = Nth.FormBuilder.__getInstance();
        var json = this.toJson();
        delete json.options.addingMethod;
        delete json.options.addingRelative;
        var $xml = $('<component/>', { 
            name: json.name,
            type: json.type,
            'class': json['class']
        });
        var $options = $('<options/>');
        $.each(json.options, function(name, value) {
            try {
                var $option = $('<option/>', {
                    name: name
                }).html(fb.encodeXmlData(value));
                $options.append($option);
            } catch(e) {
                console.log('Encode ' + name + ' option failed');
                return true;
            }
        });
        $xml.append($options);
        var $childrens = $('<childrens/>');
        $.each(this.getChilds(), function(i, component) {
            $childrens.append(component.toXml());
        });
        $xml.append($childrens);
        return $xml.prop('outerHTML');
    }
    
    Nth.FormBuilder.Component = Component;
    
    return Component;
});