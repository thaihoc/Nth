;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Fieldset'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Day la lop trung gian co nhiem vu
     * chuyen doi tu chuoi HTML va FORM DATA cua bieu mau cu thanh doi tuong Fieldset trong phien ban moi
     */
    var Convertor = function(html, data) {
        this.html = html;
        this.data = data;
    }
    
    Convertor.prototype.getHtml = function() {
        return this.html;
    }
    
    Convertor.prototype.setHtml = function(html) {
        this.html = html;
        return this;
    }
    
    Convertor.prototype.getData = function() {
        return this.data;
    }
    
    Convertor.prototype.setData = function(data) {
        this.data = data;
        return this;
    }
    
    Convertor.prototype.getValidatorOptionByDataType = function (dataType) {
        var role = {
            CHAR: null,
            NUMBER: {
                name: 'Nth.Validator.Number'
            },
            UNITDOT: {
                name: 'Nth.Validator.Unit',
                options: {
                    separator: '.'
                }
            },
            UNITCOM: {
                name: 'Nth.Validator.Unit',
                options: {
                    separator: ','
                }
            },
            PHONE: {
                name: 'Nth.Validator.PhoneNumber'
            },
            EMAIL: {
                name: 'Nth.Validator.EmailAddress'
            },
            CMND: {
                name: 'Nth.Validator.Cmnd'
            },
            DDMMYYYY: {
                name: 'Nth.Validator.Date',
                options: {
                    format: 'd/m/Y'
                }
            },
            MMYYYY: {
                name: 'Nth.Validator.Date',
                options: {
                    format: 'm/Y'
                }
            },
            YYYY: {
                name: 'Nth.Validator.Date',
                options: {
                    format: 'Y'
                }
            },
            DATE: {
                name: 'Nth.Validator.Date',
                options: {
                    format: ['Y', 'm/Y', 'd/m/Y']
                }
            }
        }
        return role[dataType];
    }
    
    Convertor.prototype.toData = function() {
        var data = this.getData();
        var fb = Nth.FormBuilder.__getInstance();
        if (data.indexOf('[{') !== 0) {
            return data;
        }
        var result = {
            name: 'auto_convert',
            data: []
        }
        $.each(JSON.parse(data), function(i, row) {
            var item = {
                name: fb.getOption('componentNamePrefix') + 'name_of_' + row['id'],
                value: row['value'],
                columnRefer: row['data-column-id']
            }
            if (null !== row['checked']) {
                item['checked'] = row['checked'];
            }
            if (null !== row['optiontext']) {
                item['selectedText'] = row['optiontext'];
            }
            result.data.push(item);
        });
        return result;
    }
    
    Convertor.prototype.getElementClassByDom = function($eform) {
        if (!$eform.length) {
            return null;
        }
        var clsMap = {
            checkbox: 'Checkbox',
            date: 'Date',
            file: 'File',
            label: 'Label',
            list: 'List',
            radio: 'Radio',
            combobox: 'Select',
            table: 'Table',
            textbox: 'Text',
            textarea: 'Textarea'
        }
        var clsName = null;
        $.each(clsMap, function(type, cls) {
            if ($eform.hasClass(type)) {
                clsName = cls;
                return false;
            }
        });
        return clsName;
    }
    
    Convertor.prototype.createCheckbox = function($eform, options) {
        if (!$eform.length) {
            return null;
        }
        var $label = $eform.find('label').clone();
        $label.find('.mandatory').remove();
        var $control = $eform.find('input[type=checkbox]');
        var id = $control.attr('id');
        var name = 'name_of_' + id;
        options = $.extend(true, {
            parentComponent: null,
            label: $label.html(),
            controlAttributes: {
                id: id,
                value: $control.val()
            }
        }, options);
        if ($control.attr('valid-required')) {
            options.required = Number($control.attr('valid-required'));
        }
        if ($control.is(':checked')) {
            options.controlAttributes.checked = true;
        }
        if ($control.attr('data-column-id')) {
            options.columnRefer = Number($control.attr('data-column-id'));
        }
        return new Nth.FormBuilder.Element.Checkbox(name, options);
    }
    
    Convertor.prototype.createDate = function($eform, options) {
        if (!$eform.length) {
            return null;
        }
        var $label = $eform.find('label').clone();
        $label.find('.mandatory').remove();
        var $control = $eform.find('input[type=text]');
        var id = $control.attr('id');
        var name = 'name_of_' + id;
        options = $.extend(true, {
            parentComponent: null,
            label: $label.html(),
            controlAttributes: {
                id: id
            }
        }, options);
        if ($control.val()) {
            options.defaultValue = $control.val();
        }
        var dataType = $control.attr('valid-datatype');
        var validatorOption = this.getValidatorOptionByDataType(dataType);
        if (validatorOption) {
            options.validators = [validatorOption];
        }
        if ($control.attr('valid-required')) {
            options.required = Number($control.attr('valid-required'));
        }
        if ($control.attr('data-column-id')) {
            options.columnRefer = Number($control.attr('data-column-id'));
        }
        return new Nth.FormBuilder.Element.Date(name, options);
    }
    
    Convertor.prototype.createLabel = function($eform, options) {
        if (!$eform.length) {
            return null;
        }
        var $label = $eform.find('h3');
        var name = $label.attr('id');
        options = $.extend(true, {
            parentComponent: null,
            label: $label.html(),
            labelAttributes: {
                style: $label.attr('style')
            }
        }, options);
        return new Nth.FormBuilder.Element.Label(name, options);
    }
    
    Convertor.prototype.createList = function($eform, options) {
        if (!$eform.length) {
            return null;
        }
        var $label = $eform.find('label').clone();
        $label.find('.mandatory').remove();
        var $control = $eform.find('ul');
        var id = $control.attr('id');
        var name = 'name_of_' + id;
        options = $.extend(true, {
            parentComponent: null,
            label: $label.html(),
            minRows: Number($control.attr('min-rows')),
            maxRows: Number($control.attr('max-rows'))
        }, options);
        if ($control.attr('data-column-id')) {
            options.columnRefer = Number($control.attr('data-column-id'));
        }
        return new Nth.FormBuilder.Element.List(name, options);
    }
    
    Convertor.prototype.createRadio = function($eform, options) {
        if (!$eform.length) {
            return null;
        }
        var $label = $eform.find('label').clone();
        $label.find('.mandatory').remove();
        var $control = $eform.find('input[type=radio]');
        var id = $control.attr('id');
        var name = 'name_of_' + id;
        options = $.extend(true, {
            parentComponent: null,
            label: $label.html(),
            controlAttributes: {
                id: id,
                value: $control.val(),
                name: $control.attr('name'),
            },
            labelAttributes: {
                'for': id
            },
            controlIdPrefix: ''
        }, options);
        if ($control.attr('valid-required')) {
            options.required = Number($control.attr('valid-required'));
        }
        if ($control.is(':checked')) {
            options.controlAttributes.checked = true;
        }
        if ($control.attr('data-column-id')) {
            options.columnRefer = Number($control.attr('data-column-id'));
        }
        return new Nth.FormBuilder.Element.Radio(name, options);
    }
    
    Convertor.prototype.createSelect = function($eform, options) {
        if (!$eform.length) {
            return null;
        }
        var $label = $eform.find('label').clone();
        $label.find('.mandatory').remove();
        var $control = $eform.find('select');
        var id = $control.attr('id');
        var name = 'name_of_' + id;
        options = $.extend(true, {
            parentComponent: null,
            label: $label.html(),
            controlAttributes: {
                id: id
            },
            bindName: $control.attr('name')
        }, options);
        if ($control.val()) {
            options.defaultValue = $control.val();
        }
        if ($control.attr('valid-required')) {
            options.required = Number($control.attr('valid-required'));
        }
        if ($control.attr('data-cname')) {
            options.bindName = $control.attr('data-cname');
        }
        if ($control.attr('ajax-collection')) {
            options.selectItemUrl = $control.attr('ajax-collection');
        }
        if ($control.attr('data-collection')) {
            options.selectItemData = JSON.parse(decodeURIComponent($control.attr('data-collection')));
        }
        if ($control.attr('data-column-id')) {
            options.columnRefer = Number($control.attr('data-column-id'));
        }
        if ($control.attr('bindby')) {
            options.bindBy = $control.attr('bindby');
        }
        return new Nth.FormBuilder.Element.Select(name, options);
    }
    
    Convertor.prototype.createTable = function($eform, options) {
        if (!$eform.length) {
            return null;
        }
        var $label = $eform.find('label').clone();
        $label.find('.mandatory').remove();
        var $control = $eform.find('table');
        var id = $control.attr('id');
        var name = 'name_of_' + id;
        options = $.extend(true, {
            parentComponent: null,
            label: $label.html(),
            minRows: $control.attr('min-rows'),
            maxRows: $control.attr('max-rows')
        }, options);
        if ($control.attr('data-column-id')) {
            options.columnRefer = Number($control.attr('data-column-id'));
        }
        var columnHeaders = [];
        $control.find('thead > tr > td').each(function(i) {
            var col = [$(this).html()];
            var $col = $control.find('colgroup col').eq(i);
            if ($col.length) {
                col.push($col.attr('width'));
            }
            columnHeaders.push(col);
        });
        if (columnHeaders.length) {
            options.columnHeaders = columnHeaders;
        }
        return new Nth.FormBuilder.Element.Table(name, options);
    }
    
    Convertor.prototype.createText = function($eform, options) {
        if (!$eform.length) {
            return null;
        }
        var $label = $eform.find('label').clone();
        $label.find('.mandatory').remove();
        var $control = $eform.find('input');
        var id = $control.attr('id');
        var name = 'name_of_' + id;
        options = $.extend(true, {
            parentComponent: null,
            label: $label.html(),
            controlAttributes: {
                id: id,
                type: $control.attr('type')
            }
        }, options);
        if ($control.val()) {
            options.defaultValue = $control.val();
        }
        var dataType = $control.attr('valid-datatype');
        var validatorOption = this.getValidatorOptionByDataType(dataType);
        if (validatorOption) {
            options.validators = [validatorOption];
        }
        if ($control.attr('valid-required')) {
            options.required = Number($control.attr('valid-required'));
        }
        if ($control.attr('data-column-id')) {
            options.columnRefer = Number($control.attr('data-column-id'));
        }
        if ($control.attr('data-cname')) {
            options.bindName = $control.attr('data-cname');
        }
        if ($control.attr('placeholder')) {
            options.controlAttributes.placeholder = $control.attr('placeholder');
        }
        return new Nth.FormBuilder.Element.Text(name, options);
    }
    
    Convertor.prototype.createTextarea = function($eform, options) {
        if (!$eform.length) {
            return null;
        }
        var $label = $eform.find('label').clone();
        $label.find('.mandatory').remove();
        var $control = $eform.find('textarea');
        var id = $control.attr('id');
        var name = 'name_of_' + id;
        options = $.extend(true, {
            parentComponent: null,
            label: $label.html(),
            controlAttributes: {
                id: id
            }
        }, options);
        if ($control.val()) {
            options.defaultValue = $control.val();
        }
        if ($control.attr('valid-required')) {
            options.required = Number($control.attr('valid-required'));
        }
        if ($control.attr('data-column-id')) {
            options.columnRefer = Number($control.attr('data-column-id'));
        }
        if ($control.attr('placeholder')) {
            options.controlAttributes.placeholder = $control.attr('placeholder');
        }
        return new Nth.FormBuilder.Element.Textarea(name, options);
    }
    
    Convertor.prototype.toFieldset = function(options) {
        var $fieldset = $();
        var html = this.getHtml();
        if (typeof html === 'string') {
            $fieldset = $($.parseHTML(html));
        } else if (typeof html === 'object' && !(html instanceof $)) {
            $fieldset = $(html);
        }
        if (!$fieldset.length) {
            return null;
        }
        var inst = this;
        var name = $fieldset.attr('id');
        options = $.extend(true, {
            drawingBoard: null,
            toolPalette: null,
            data: {
                MA_THU_TUC: $fieldset.attr('data-MA_THU_TUC'),
                MA_GIAY_TO: $fieldset.attr('data-MA_THU_TUC'),
                LOAI_BIEU_MAU: $fieldset.attr('data-LOAI_BIEU_MAU'),
                MA_BIEU_MAU: $fieldset.attr('data-MA_BIEU_MAU')
            },
            wrapperAttributes: {
                style: $fieldset.attr('style')
            }
        }, options);
        var fieldset = new Nth.FormBuilder.Fieldset(name, options);
        if (options.drawingBoard instanceof Nth.FormBuilder.DrawingBoard) {
            options.drawingBoard.setFieldset(fieldset);
        }
        $fieldset.children('.row').each(function() {
            var name = $(this).attr('id');
            var row = new Nth.FormBuilder.Row(name, {
                parentComponent: fieldset,
                drawingBoard: options.drawingBoard,
                toolPalette: options.toolPalette,
                autoInit: false
            })
            fieldset.addComponent(row);
            $(this).children('.col').each(function() {
                var name = $(this).attr('id');
                var cls = $(this).attr('class');
                var column = new Nth.FormBuilder.Column(name, {
                    parentComponent: row,
                    drawingBoard: options.drawingBoard,
                    toolPalette: options.toolPalette,
                    wrapperAttributes: {
                        'class': cls.match(/col\-(xs|sm|md|lg)\-[1-9]{1,2}/) ? cls : cls + ' ' + fieldset.getConfigParam('defaultColumnSizeClass')
                    },
                    autoInit: false
                });
                fieldset.addComponent(column);
                $(this).children('.eform').each(function() {
                    var $eform = $(this);
                    var elementClass = inst.getElementClassByDom($eform);
                    if (!elementClass || typeof inst['create' + elementClass] !== 'function') {
                        console.warn('Element ' + elementClass + ' class is undefined');
                        return;
                    }
                    var element = inst['create' + elementClass]($eform, {
                        parentComponent: column,
                        drawingBoard: options.drawingBoard,
                        toolPalette: options.toolPalette,
                        autoInit: false
                    });
                    if (element instanceof Nth.FormBuilder.Element) {
                        fieldset.addComponent(element);
                    }
                }); 
            });
        });
        $.each(fieldset.getComponents(), function(i, component) {
            component.init();
        });
        return fieldset;
    }

    Nth.FormBuilder.Convertor = Convertor;
    
    return Convertor;
});

