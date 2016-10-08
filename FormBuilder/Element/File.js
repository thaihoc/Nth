;
(function (factory) {

    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/Browser',
            'Nth/FormBuilder/Element',
            'Nth/File/FileIcon',
            'Nth/Validator/File'
        ], factory);
    } else {
        factory(Nth);
    }
})(function (Nth) {

    /**
     * File Element
     * Support custom input
     * Reference: http://www.onextrapixel.com/2012/12/10/how-to-create-a-custom-file-input-with-jquery-css3-and-php/
     */
    var File = function (name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_file_',
            creatorIconClass: 'icon file',
            creatorLabel: 'File',
            pathSeparator: ':',
            rmofcn: '',
            rmafcn: '',
            rmofcnPrefix: '_remove_files_',
            rmafcnPrefix: '_remain_files_',
            fileListShow: true,
            fileListRemovable: true,
            fileListAAttributes: {},
            fileListEmptyText: '',
            uploadDirectory: '',
            validators: [
                {
                    name: 'Nth.Validator.File',
                    options: {
                        maxLength: 5, //files
                        validExtension: 'doc|docx|xls|xlsx|pdf|rar|zip|dxf|jpe?g|png|gif|odt'
                    }
                }
            ],
            customInput: true,
            ipgrpAttributes: {},
            ipgrpAddonAfter: false,
            chooseText: 'Chọn tệp tin'
        }, options));
        name = this.getName();
        var inst = this;
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        var controlId = this.getConfigParam('controlIdPrefix') + name;
        var controlAttributes = this.getOption('controlAttributes', {});
        if (this.getOption('multiple')) {
            controlAttributes.multiple = true;
        }
        var $control = $('<input/>', $.extend({}, {
            type: 'file',
            id: controlId,
            name: controlAttributes.multiple ? name + '[]' : name,
            'class': this.getConfigParam('elementClass')
        }, controlAttributes));
        if (false === this.getOption('control', true)) {
            $control.hide();
        }
        this.control = new Nth.Dom.Node($control);
        var labelAttributes = this.getOption('labelAttributes', {});
        if (typeof labelAttributes['for'] === 'undefined') {
            this.getLabel().getNode().attr('for', controlId);
        }
        this.getWrapper().getNode().addClass(rc.getShortName().toLowerCase());
        if (this.getOption('customInput')) {
            var $ipgrp = $('<div/>', $.extend({}, {
                'class': 'input-group'
            }, this.getOption('ipgrpAttributes')));
            if (false === this.getOption('control', true)) {
                $ipgrp.hide();
            }
            var $ipgrpControl = $('<input/>', {
                type: "text",
                'class': "form-control",
                readonly: true
            }).on('blur.Nth.FormBuilder.Element.File', function () {
                inst.getControl().getNode().trigger('blur');
            }).on('keydown.Nth.FormBuilder.Element.File', function (e) {
                if (e.which === 13) {
                    var browser = new Nth.Browser();
                    if (!browser.isIE()) {
                        inst.getControl().getNode().trigger('click');
                    }
                } else if (e.which === 8 || e.which === 46) {
                    if ($control.val()) {
                        $ipgrpControl.val('');
                        $control = $control.val('').clone(true);
                        inst.getControl().getNode().replaceWith($control);
                        inst.control = new Nth.Dom.Node($control);
                    }
                    return false;
                } else if (e.which === 9) {
                    return;
                } else {
                    return false;
                }
            });
            var $ipgrpButton = $('<span/>', {
                'class': 'input-group-btn'
            });
            var $ipgrpButtonButton = $('<button/>', {
                type: 'button',
                'class': 'btn btn-default',
                tabIndex: -1
            }).html(this.getOption('chooseText'));
            $control.on('change.Nth.FormBuilder.Element.File', function () {
                if (this.files) {
                    var filenames = [];
                    for (var i = 0; i < this.files.length; i++) {
                        filenames.push(this.files[i].name);
                    }
                    var chosen = filenames.join(inst.getOption('pathSeparator'));
                    $ipgrpControl.val(chosen).attr('title', chosen);
                } else {
                    var fakepath = $(this).val();
                    var file = new Nth.File.File(fakepath);
                    $ipgrpControl.val(file.getBasename()).attr('title', fakepath);
                }
            }).addClass('custom-file').attr('tabIndex', -1);
            $ipgrpButton.append($ipgrpButtonButton, $control);
            if (this.getOption('ipgrpAddonAfter', true)) {
                $ipgrp.append($ipgrpControl, $ipgrpButton);
            } else {
                $ipgrp.append($ipgrpButton, $ipgrpControl);
            }
            this.getWrapper().getNode().append($ipgrp);
        } else {
            this.getWrapper().getNode().append($control);
        }
        if (this.existsOption('value')) {
            this.setValue(this.getOption('value'));
        } else if (this.hasDefaultValue()) {
            this.setValue(this.getDefaultValue());
        }
        if (this.getOption('disabled')) {
            this.disable();
        }
    }

    File.prototype = Object.create(Nth.FormBuilder.Element.prototype);

    File.prototype.constructor = File;

    File.prototype.__CLASS__ = 'Nth.FormBuilder.Element.File';

    File.prototype.getControl = function () {
        return this.control;
    }

    File.prototype.enable = function () {
        this.getControl().getNode().removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }

    File.prototype.disable = function () {
        this.getControl().getNode().attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }

    File.prototype.setMultiple = function (multiple) {
        var $control = this.getControl().getNode();
        var name = $control.attr('name');
        if (multiple) {
            if (!name.match(/\[\]$/)) {
                name += '[]';
            }
            $control.attr('multiple', multiple);
        } else {
            name = name.replace(/\[\]$/, '');
            $control.removeAttr('multiple');
        }
        $control.attr('name', name).prop('multiple', multiple);
        return name;
    }

    File.prototype.setValue = function (value) {
        this.setOption('value', value);
        this.createFileList();
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }

    File.prototype.getValue = function () {
        return this.getOption('value', '');
    }

    File.prototype.getArrayValue = function () {
        var val = this.getValue() || '';
        if (typeof val === 'string') {
            val = val.split(this.getOption('pathSeparator'));
        }
        return val.filter(function (a) {
            return !!a;
        });
    }

    File.prototype.getChosen = function () {
        return this.getControl().getNode()[0].files;
    }

    File.prototype.isEmpty = function () {
        return !this.getArrayValue().length && !this.getChosen().length;
    }

    File.prototype.getRmofcn = function () {
        var name = this.getName();
        var rmofcn = this.getOption('rmofcn');
        var rmofcnPrefix = this.getOption('rmofcnPrefix', '');
        if (rmofcn) {
            return rmofcnPrefix + rmofcn;
        }
        return rmofcnPrefix + name;
    }

    File.prototype.getRmafcn = function () {
        var name = this.getName();
        var rmafcn = this.getOption('rmafcn');
        var rmafcnPrefix = this.getOption('rmafcnPrefix', '');
        if (rmafcn) {
            return rmafcnPrefix + rmafcn;
        }
        return rmafcnPrefix + name;
    }

    File.prototype.createFileList = function () {
        var inst = this;
        var pathSeparator = this.getOption('pathSeparator');
        var $wrapper = this.getWrapper().getNode().children('.file-list');
        if (!$wrapper.length) {
            $wrapper = $('<div/>', {'class': 'file-list'});
            this.getWrapper().getNode().append($wrapper);
        }
        var rmofcn = this.getRmofcn();
        var rmafcn = this.getRmafcn();
        var $removeFiles = $('<input/>', {
            type: 'hidden',
            id: rmofcn,
            name: rmofcn
        });
        var $remainFiles = $('<input/>', {
            type: 'hidden',
            id: rmafcn,
            name: rmafcn,
            value: this.getValue()
        });
        $wrapper.html(null).append($removeFiles, $remainFiles);
        if (!this.getOption('fileListShow')) {
            return $wrapper;
        }
        var $ul = $('<ul/>');
        $.each(this.getArrayValue(), function (i, path) {
            var file = new Nth.File.File(path);
            var $li = $('<li/>');
            var $a = $('<a/>', $.extend({}, {
                'class': 'file-info',
                href: inst.getOption('uploadDirectory') + path
            }, inst.getOption('fileListAAttributes'))).data('fb-file-path', path);
            var $icon = new Nth.File.FileIcon(new Nth.File.File(path)).getDomNode();
            var $path = $('<span/>').html(file.getBasename());
            $a.append($icon, $path);
            if (inst.getOption('fileListRemovable')) {
                var $trash = $('<a/>', {
                    href: 'javascript:;',
                    'class': 'trash-file',
                    title: 'Remove this file'
                }).html('<i class="fa fa-trash-o"></i>').on('click', function () {
                    $li.addClass('removed');
                    var val = $removeFiles.val().split(pathSeparator);
                    val.push(path);
                    $removeFiles.val(val.filter(function (v) {
                        return !!v
                    }).join(pathSeparator));
                    var remainFiles = [];
                    $ul.find('li:not(.removed) a.file-info').each(function () {
                        remainFiles.push($(this).data('fb-file-path'));
                    });
                    $remainFiles.val(remainFiles.join(pathSeparator));
                });
                $li.prepend($trash);
            }
            $ul.append($li.append($a));
        });
        return $wrapper.append($ul);
    }

    File.prototype.focus = function () {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }

    File.prototype.blur = function () {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }

    File.prototype.reset = function () {
        return this;
    }

    File.prototype.copyToDrawingBoard = function () {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add File element to DrawingBoard');
            return;
        }
        var file = new File(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(file);
        file.inactiveOthers();
        return this;
    }

    File.prototype.cloneToDrawingBoard = function () {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone File element to DrawingBoard');
            return;
        }
        var file = new File(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(file);
        file.inactiveOthers();
        return this;
    }

    File.prototype.getPropertySetters = function () {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Element.prototype.getPropertySetters.call(this);
        var propertySetter = new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getRequiredSetter()
                    , propertySetter.getMarksMandatorySetter()
                    , propertySetter.getValidNameSetter()
                    , propertySetter.getColumnReferSetter()
                    , propertySetter.getElementIdSetter()
                    , propertySetter.getElementClassSetter()
                    , propertySetter.getElementStyleSetter()
                    , propertySetter.getElementTitleSetter()
                    , propertySetter.getBindIndexSetter()
        ]);
        return options;
    }

    File.prototype.isValid = function (options) {
        if (typeof options === 'function') {
            options = {done: options}
        }
        options = new Nth.Options($.extend({}, {
            start: function () {},
            done: function () {}
        }, options));
        var inst = this;
        var done = function () {
            options.getOption('done').call(inst);
            return inst;
        }
        this.hideMessage().setMessage(null);
        if (false === options.getOption('start').call(this)) {
            return done();
        }
        var strHelper = new Nth.Helper.String();
        var validator = Nth.Validator.__getInstance();
        var validName = this.getValidName();
        if (this.getOption('required') && this.isEmpty()) {
            strHelper.setString(validator.getOption('reselectText'));
            this.setMessage(strHelper.sprintf(validName));
            return done();
        }
        var validator = this.getValidator('Nth.Validator.File');
        if (validator && !validator.isValid(this.getControl().getNode())) {
            this.setMessage(validator.getMessage());
            return done();
        }
        return done();
    }

    File.prototype.toJson = function () {
        var json = Nth.FormBuilder.Element.prototype.toJson.call(this);
        if (this.isEmpty()) {
            delete json.options.value;
        } else {
            json.options.value = this.getValue();
        }
        json.options.controlAttributes = this.getControl().getAttributes();
        return json;
    }

    File.__fromXml = function (xml, options) {
        options = $.extend({}, {
            drawingBoard: null,
            toolPalette: null,
            parentComponent: null
        }, options);
        var fb = Nth.FormBuilder.__getInstance();
        var $xml = fb.getXmlObject(xml, 'component');
        var name = $xml.attr('name');
        $xml.children('options').children('option').each(function () {
            options[$(this).attr('name')] = fb.decodeXmlData($(this).text());
        });
        return new File(name, options);
    }

    Nth.FormBuilder.Element.File = File;

    return File;
});