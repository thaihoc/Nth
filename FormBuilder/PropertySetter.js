;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth',
            'Nth/Alert',
            'Nth/Confirm',
            'Nth/ReflectionClass',
            'Nth/FormBuilder/Component',
            'editTable'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var PropertySetter = function(component) {
        this.setComponent(component);
    }
    
    PropertySetter.prototype.__CLASS__ = 'Nth.FormBuilder.PropertySetter';
    
    PropertySetter.prototype.getComponent = function() {
        return this.component;
    }
    
    PropertySetter.prototype.setComponent = function(component) {
        if (!(component instanceof Nth.FormBuilder.Component)) {
            throw 'The argument was passed must be an instance of Nth.FormBuilder.Component';
        }
        this.component = component;
    }
    
    /**
     * Consist of wrapper id and control name
     */
    PropertySetter.prototype.getNameSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text', 
            value: component.getName()
        }).on('blur', function() {
            var name = component.getName();
            if (this.value === name) {
                return;
            }
            var self = this;
            if (component.hasNameExists(this.value)) {
                return Nth.Confirm('Name đã tồn tại! Khôi phục lại giá trị cũ?', function(choosed) {
                    if (choosed === Nth.Confirm.OK) {
                        $(self).val(name);
                    }
                    $(self).focus();
                });
            }
            component.setName(this.value);
        });
        return { name: 'Name', setter: setter }
    }
    
    PropertySetter.prototype.getWrapperClassSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text', 
            value: component.getWrapper().getNode().attr('class')
        }).on('blur', function() {
            component.getWrapper().getNode().attr('class', this.value)
        });
        return { name: 'Wrapper class', setter: setter };
    }
    
    PropertySetter.prototype.getWrapperStyleSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text', 
            value: component.getWrapper().getNode().attr('style')
        }).on('blur', function() {
            component.getWrapper().getNode().attr('style', this.value)
        });
        return { name: 'Wrapper style', setter: setter };
    }
    
    PropertySetter.prototype.getMarksMandatorySetter = function() {
        var component = this.getComponent();
        var setter = $('<select/>');
        var $yes = $('<option/>', {value: 1}).html('Yes');
        var $no =  $('<option/>', {value: 0}).html('No');
        var val = component.getOption('marksMandatory');
        setter.append($yes, $no).val(val).on('change', function() {
            component.setOption('marksMandatory', parseInt(this.value)).checkForMarkingMandatory();
        });
        return {name: 'Marks mandatory', setter: setter };
    }
    
    PropertySetter.prototype.getRequiredSetter = function() {
        var component = this.getComponent();
        var setter = $('<select/>');
        var $yes = $('<option/>', {value: 1}).html('Yes');
        var $no =  $('<option/>', {value: 0}).html('No');
        var val = component.getOption('required', 0);
        setter.append($yes, $no).val(val).on('change', function() {
            component.setOption('required', parseInt(this.value)).checkForMarkingMandatory();
        });
        return {name: 'Required', setter: setter };
    }
    
    PropertySetter.prototype.getElementLabelSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getLabelContent().html()
        }).on('blur', function() {
            component.getLabelContent().html(this.value);
        });
        return {name: 'Label', setter: setter };
    }
    
    PropertySetter.prototype.getElementIdSetter = function() {
        var component = this.getComponent();
        var elementId = component.getControl().getNode().attr('id');
        var setter = $('<input/>', {
            type: 'text',
            value: elementId
        }).on('blur', function() {
            if (this.value === elementId) {
                return;
            }
            var self = this;
            if (component.hasElementIdExists(this.value)) {
                return Nth.Confirm('Element id đã tồn tại! Khôi phục lại giá trị cũ?', function(choosed) {
                    if (choosed === Nth.Confirm.OK) {
                        $(self).val(elementId);
                    }
                    $(self).focus();
                });
            }
            component.getControl().getNode().attr('id', this.value);
            component.getLabel().getNode().attr('for', this.value);
        });
        return {name: 'Element ID', setter: setter};
    }
    
    PropertySetter.prototype.getElementNameSetter = function() {
        var component = this.getComponent();
        var elementName = component.getControl().getNode().attr('name');
        var setter = $('<input/>', {
            type: 'text',
            value: elementName
        }).on('blur', function() {
            if (this.value === elementName) {
                return;
            }
            var self = this;
            if (component.hasElementNameExists(this.value) && !component.is('Radio')) {
                return Nth.Confirm('Element name has existed! Do you want to recover the lastest value?', function(choosed) {
                    if (choosed === Nth.Confirm.OK) {
                        $(self).val(elementName);
                    }
                    $(self).focus();
                });
            }
            component.getControl().getNode().attr('name', this.value);
        });
        return {name: 'Element Name', setter: setter};
    }
    
    PropertySetter.prototype.getDefaultValueSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('defaultValue')
        }).on('blur', function() {
            component.setDefaultValue(this.value).setValue(this.value);
        });
        return {name: 'Default value', setter: setter};
    }
    
    PropertySetter.prototype.getValueSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getValue()
        }).on('blur', function() {
            component.setValue(this.value);
        });
        return {name: 'Value', setter: setter};
    }
    
    PropertySetter.prototype.getValidNameSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('validName')
        }).on('blur', function() {
            component.setOption('validName', this.value);
        });
        return {name: 'Valid name', setter: setter};
    }
    
    PropertySetter.prototype.getValidUrlSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('validUrl')
        }).on('blur', function() {
            component.setOption('validUrl', this.value);
        });
        return {name: 'Valid URL', setter: setter};
    }
    
    PropertySetter.prototype.getInitUrlSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('initUrl')
        }).on('blur', function() {
            component.setOption('initUrl', this.value);
        });
        return {name: 'Init URL', setter: setter};
    }
    
    PropertySetter.prototype.getImageContainerSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('imageContainer')
        }).on('blur', function() {
            component.setOption('imageContainer', this.value);
        });
        return {name: 'Image container', setter: setter};
    }
    
    PropertySetter.prototype.getCheckedSetter = function() {
        var component = this.getComponent();
        var setter = $('<select/>');
        var $yes = $('<option/>', {value: 1}).html('Yes');
        var $no =  $('<option/>', {value: 0}).html('No');
        var val = Number(component.getControl().getNode().is(':checked'));
        setter.append($yes, $no).val(val).on('change', function() {
            if (parseInt(this.value)) {
                component.check();
            } else {
                component.uncheck();
            }
        });
        return {name: 'Checked', setter: setter};
    }
    
    PropertySetter.prototype.getDisabledSetter = function() {
        var component = this.getComponent();
        var setter = $('<select/>');
        var $yes = $('<option/>', {value: 1}).html('Yes');
        var $no =  $('<option/>', {value: 0}).html('No');
        var val = Number(component.getControl().getNode().is(':disabled'));
        setter.append($yes, $no).val(val).on('change', function() {
            if (parseInt(this.value)) {
                component.getControl().getNode().prop('disabled', true).attr('disabled', true);
            } else {
                component.getControl().getNode().prop('disabled', false).removeAttr('disabled');
            }
        });
        return {name: 'Disabled', setter: setter};
    }
    
    PropertySetter.prototype.getReadonlySetter = function() {
        var component = this.getComponent();
        var setter = $('<select/>');
        var $yes = $('<option/>', {value: 1}).html('Yes');
        var $no =  $('<option/>', {value: 0}).html('No');
        var val = Number(component.getControl().getNode().prop('readonly'));
        setter.append($yes, $no).val(val).on('change', function() {
            if (parseInt(this.value)) {
                component.getControl().getNode().prop('readonly', true).attr('readonly', true);
            } else {
                component.getControl().getNode().prop('readonly', false).removeAttr('readonly');
            }
        });
        return {name: 'Readonly', setter: setter};
    }
    
    PropertySetter.prototype.getAutocompleteSetter = function() {
        var component = this.getComponent();
        var setter = $('<select/>');
        var $default = $('<option/>', {value: 'default'}).html('Default');
        var $on =  $('<option/>', {value: 'on'}).html('On');
        var $off =  $('<option/>', {value: 'off'}).html('Off');
        var val = component.getControl().getNode().attr('autocomplete');
        setter.append($default, $on, $off).val(val ? val.toLowerCase() : 'default').on('change', function() {
            component.getControl().getNode().attr('autocomplete', this.value);
        });
        return {name: 'Autocomplete', setter: setter};
    }
    
    PropertySetter.prototype.getBindNameSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('bindName')
        }).on('blur', function() {
            component.setOption('bindName', this.value);
        });
        return {name: 'Bind name', setter: setter};
    }
    
    PropertySetter.prototype.getValidElementRequiredSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('validElementRequired')
        }).on('blur', function() {
            component.setOption('validElementRequired', this.value);
        });
        return {name: 'Valid element required', setter: setter};
    }
    
    PropertySetter.prototype.getBindBySetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('bindBy')
        }).on('blur', function() {
            component.setOption('bindBy', this.value);
        });
        return {name: 'Bindby', setter: setter};
    }
    
    PropertySetter.prototype.getAuthElementSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('authElement')
        }).on('blur', function() {
            component.setOption('authElement', this.value);
        });
        return {name: 'Auth element', setter: setter};
    }
    
    PropertySetter.prototype.getMaxRowSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('maxRow')
        }).on('blur', function() {
            var val = parseInt(this.value);
            if (isNaN(val)) {
                var self = this;
                return Nth.Alert('Number is required', function() {
                    $(self).focus();
                });
            }
            component.setMaxRow(val);
        });
        return {name: 'Max row', setter: setter};
    }
    
    PropertySetter.prototype.getMinRowSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('minRow')
        }).on('blur', function() {
            var val = parseInt(this.value);
            if (isNaN(val)) {
                var self = this;
                return Nth.Alert('Number is required', function() {
                    $(self).focus();
                });
            }
            component.setMinRow(val);
        });
        return {name: 'Min row', setter: setter};
    }
    
    PropertySetter.prototype.getPlaceholderSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getControl().getNode().attr('placeholder')
        }).on('blur', function() {
            component.getControl().getNode().attr('placeholder', this.value);
        });
        return {name: 'Placeholder', setter: setter};
    }
    
    PropertySetter.prototype.getElementTitleSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getControl().getNode().attr('title')
        }).on('blur', function() {
            component.getControl().getNode().attr('title', this.value);
        });
        return {name: 'Element title', setter: setter};
    }
    
    PropertySetter.prototype.getElementClassSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getControl().getNode().attr('class')
        }).on('blur', function() {
            component.getControl().getNode().attr('class', this.value);
        });
        return {name: 'Element class', setter: setter};
    }
    
    PropertySetter.prototype.getElementStyleSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getControl().getNode().attr('style')
        }).on('blur', function() {
            component.getControl().getNode().attr('style', this.value);
        });
        return {name: 'Element style', setter: setter};
    }
    
    PropertySetter.prototype.getColumnReferSetter =  function() {
        var component = this.getComponent();
        var selectItems = component.getConfigParam('columnReferPropertySelectItems');
        var setter = $('<select/>');
        if (typeof selectItems === 'function') {
            selectItems.call(component, setter);
        } else if (typeof selectItems === 'string') {
            setter.html(selectItems).val(component.getOption('columnRefer'));
        }
        setter.on('change', function() {
            var columnRefer = component.getOption('columnRefer');
            if (this.value === columnRefer) {
                return;
            }
            var self = this;
            if (component.hasColumnReferExists(this.value)) {
                return Nth.Confirm('Column refer đã tồn tại! Hiển thị phần tử bị trùng?', function(choosed) {
                    if (choosed === Nth.Confirm.OK) {
                        var fieldset = component.getDrawingBoard().getFieldset();
                        var duplicate = fieldset.findComponentsByOption('columnRefer', self.value);
                        fieldset.inactiveComponents().activeComponent(duplicate);
                    }
                    $(self).val(columnRefer).focus();
                });
            }
            component.setOption('columnRefer', this.value);
        });
        return {name: 'Column refer', setter: setter}
    }
    
    PropertySetter.prototype.getTypeSetter = function() {
        var component = this.getComponent();
        var setter = $('<select/>');
        var $text =  $('<option/>', {value: 'text'}).html('text');
        var $password =  $('<option/>', {value: 'password'}).html('password');
        var val = component.getControl().getNode().attr('type').toLowerCase();
        setter.append($text, $password).val(val).on('change', function() {
            component.getControl().getNode().attr('type', this.value);
        });
        return {name: 'Type', setter: setter}
    }
    
    PropertySetter.prototype.getColumnHeadersSetter = function() {
        var component = this.getComponent();
        var getValueLabel = function(val) {
            if (val.length > 1) {
                return val.length + ' columns'
            }
            return val.length + ' column';
        }
        var val = component.getOption('columnHeaders');
        var setter = $('<div/>', {'class': 'column-headers-setter'});
        var $group = $('<div/>', {'class': 'input-group'});
        var $input = $('<input/>', {
            type: 'text',
            value: getValueLabel(val),
            readonly: true
        });
        var $trigger = $('<span/>', {
            'class': "input-group-addon" ,
            'data-toggle': "modal" ,
            'data-target': "#columnHeaders"
        }).html('...');
        $group.append($input, $trigger);
        var $modal = $('<div/>', {
            'class': "modal fade",
            id: "columnHeaders",
            tabindex: "-1",
            role: "dialog",
            'aria-labelledby': "columnHeadersLabel"
        });
        var $dialog = $('<div/>', {
            'class': "modal-dialog",
            role: "document"
        });
        var $content = $('<div/>', {'class': 'modal-content'});
        var $header = $('<div/>', {'class': 'modal-header'});
        var $close = $('<button/>', {
            type: "button",
            'class': "close",
            'data-dismiss': "modal",
            'aria-label': "Close"
        }).html('<span aria-hidden="true">&times;</span>');
        var $title = $('<h4/>', {
            'class': "modal-title",
            id: "columnHeadersLabel"
        }).html('Column Headers');
        $header.append($close, $title);
        var $body = $('<div/>', {'class': 'modal-body'});
        var editTable = $body.editTable({
            headerCols: ['Name', 'Width']
        });
        editTable.loadData(val);
        var $footer = $('<div/>', {'class': 'modal-footer'});
        var $exit = $('<button/>', {
            type: "button",
            'class': "btn btn-default",
            'data-dismiss': "modal"
        }).html('Close');
        var $save = $('<button/>', {
            type: "button",
            'class': "btn btn-primary"
        }).html('Save changes');
        $footer.append($exit, $save);
        $modal.html($dialog.html($content.append($header, $body, $footer)));
        setter.append($group, $modal);
        $save.on('click', function() {
            val = editTable.getData();
            component.setOption('columnHeaders', val).createColumnHeaders();
            $input.val(getValueLabel(val));
        });
        return {name: 'Column headers', setter: setter}
    }
    
    PropertySetter.prototype.getValidatorsSetter = function () {
        var component = this.getComponent();
        var setter = $('<div/>', {'class': 'validators-setter'});
        var $group = $('<div/>', {'class': 'input-group'});
        var $input = $('<input/>', {type: 'text', readonly: true});
        var displayValue = function() {
            var rs = 'no validator';
            var val = component.getValidators();
            if (val.length > 1) {
                rs = val.length + ' validators'
            } else if (val.length === 1) {
                if ($.isPlainObject(val[0])) {
                     rs = val[0].name;
                } else if (val[0] instanceof Nth.Validator) {
                     rs = val[0].__CLASS__;
                }
            }
            $input.val(rs);
        }
        displayValue();
        var $trigger = $('<span/>', {
            'class': "input-group-addon" ,
            'data-toggle': "modal" ,
            'data-target': "#validators"
        }).html('...');
        $group.append($input, $trigger);
        var $modal = $('<div/>', {
            'class': "modal fade",
            id: "validators",
            tabindex: "-1",
            role: "dialog",
            'aria-labelledby': "validatorsLabel"
        }).on('hidden.bs.modal', function () {
            component.initValidators().hookValidators();
            displayValue();
        });
        var $dialog = $('<div/>', {
            'class': "modal-dialog",
            role: "document"
        });
        var $content = $('<div/>', {'class': 'modal-content'});
        var $header = $('<div/>', {'class': 'modal-header'});
        var $close = $('<button/>', {
            type: "button",
            'class': "close",
            'data-dismiss': "modal",
            'aria-label': "Close"
        }).html('<span aria-hidden="true">&times;</span>');
        var $title = $('<h4/>', {
            'class': "modal-title",
            id: "validatorsLabel"
        }).html('Validator');
        $header.append($close, $title);
        var $body = $('<div/>', {'class': 'modal-body'});
        var $footer = $('<div/>', {'class': 'modal-footer'});
        var $panelGroup = $('<div/>', {
            'class': "panel-group",
            id: "validators-accordion",
            role: "tablist",
            'aria-multiselectable': "true"
        });
        var supportValidators = component.getSupportValidators();
        if (supportValidators.removable && supportValidators.validators.length) {
            var $labelWrapper = $('<div/>', {'class': 'pull-left'}).css('position', 'relative');
            var $radNoneValidator = $('<input>', {type: 'checkbox', id: 'none-validator-setter'}).css({
                position: 'relative',
                top: '2px'
            }).on('change', function () {
                if ($(this).is(':checked')) {
                    $panelGroup.find('input[name=validator-for-element]:checked').each(function () {
                        if ($(this).data('iCheck')) {
                            $(this).iCheck('uncheck');
                        } else {
                            $(this).removeAttr('checked').prop('checked', false);
                        }
                    });
                }
            });
            var $lblNoneValidator = $('<span/>').css('margin-left', '5px').html('Không sử dụng validator');
            var $label = $('<label/>').append($radNoneValidator, $lblNoneValidator);
            if (typeof $().iCheck === 'function') {
                $radNoneValidator.iCheck({
                    checkboxClass: 'icheckbox_minimal',
                    radioClass: 'iradio_minimal'
                }).on('ifChanged', function () {
                    $(this).trigger('change');
                });
            }
            $footer.append($labelWrapper.append($label));
        }
        $.each(supportValidators.validators, function (i, options) {
            var vclass = options.validator.__CLASS__;
            var validator = component.getValidator(vclass);
            if (validator) {
                options.checked = true;
            } else {
                validator = options.validator.setElement(component);
            }
            var so = $.extend({}, {
                beforeSave: function () {},
                onClose: function() {}
            }, validator.getSetterOptions());
            var unique = vclass.split('.').join('_') + '_' + i;
            var $panel = $('<div/>', {'class': "panel panel-default"});
            var $panelHeading = $('<div/>', {
                'class': "panel-heading",
                role: "tab", 
                id: "heading-" + unique
            });
            var $panelTitle = $('<a/>', {
                role: "button",
                href: 'javascript:;'
            });
            var $radioInput = $('<input/>', {
                id: 'rad-' + unique,
                type: 'radio',
                name: 'validator-for-element',
                checked: options.checked
            }).on('change', function () {
                if ($(this).is(':checked')) {
                    if ($radNoneValidator.data('iCheck')) {
                        $radNoneValidator.iCheck('uncheck');
                    } else {
                        $radNoneValidator.removeAttr('checked').prop('checked', false);
                    }
                }
            }).data({
                validator: validator,
                setterOptions: so
            });
            if (so.fieldset) {
                var $inputWrapper = $('<span/>', {'class': 'input-wrapper'}).append($radioInput);
                var $toggleIcon = $('<span/>', {'class': 'pull-right'}).html('<i class="fa fa-toggle-down"></i>');
                $panelHeading.append($inputWrapper, $panelTitle.html(so.subject), $toggleIcon);
                $panelTitle.attr({
                    href: "#collapse-" + unique,
                    'data-toggle': "collapse", 
                    'data-parent': "#validators-accordion",
                    'aria-expanded': "true",
                    'aria-controls': "collapse-" + unique
                }).css({
                    'display': 'inline-block',
                    'font-weight': 'bold'
                });
                var $collapseContent = $('<div/>', {
                    id: "collapse-" + unique,
                    'class': "panel-collapse collapse" + ($radioInput.is(':checked') ? " in" : ""),
                    role: "tabpanel",
                    'aria-labelledby': "heading-" + unique
                });
                var $panelBody = $('<div/>', {'class': "panel-body"});
                $panel.append($collapseContent.append($panelBody.append(so.fieldset.getDomNode())));
                $panelTitle.collapse();
                $collapseContent.on('show.bs.collapse', function () {
                    $toggleIcon.html('<i class="fa fa-toggle-up"></i>');
                }).on('hide.bs.collapse', function () {
                    $toggleIcon.html('<i class="fa fa-toggle-down"></i>');
                });
                $radioInput.on('change', function () {
                    if ($(this).is(':checked')) {
                        $collapseContent.collapse('show'); 
                    } else {
                        $collapseContent.collapse('hide'); 
                    }
                });
            } else {
                var $radioLabel = $('<label/>', {'for': 'rad-' + unique}).html(so.subject);
                $panelHeading.append($panelTitle.append($radioInput, $radioLabel));
            }
            $panel.prepend($panelHeading);
            if (typeof $().iCheck === 'function') {
                $radioInput.iCheck({
                    checkboxClass: 'icheckbox_minimal',
                    radioClass: 'iradio_minimal'
                }).on('ifChanged', function () {
                    $(this).trigger('change');
                });
            }
            $panelGroup.append($panel);
        })
        $body.append($panelGroup);
        var $exit = $('<button/>', {
            type: "button",
            'class': "btn btn-default",
            'data-dismiss': "modal"
        }).html('Close');
        var $save = $('<button/>', {
            type: "button",
            'class': "btn btn-primary"
        }).html('Save changes');
        $footer.append($exit, $save);
        $modal.html($dialog.html($content.append($header, $body, $footer)));
        setter.append($group, $modal);
        $save.on('click', function() {
            component.removeValidators();
            var $noneValidator = $panelGroup.find('input#none-validator-setter');
            if ($noneValidator.is(':checked')) {
                $modal.modal('hide');
                return;
            }
            var $checked = $panelGroup.find('input[name=validator-for-element]:checked');
            if ($checked.length) {
                var validator = $checked.data('validator');
                var so = $checked.data('setterOptions');
                if (false !== so.beforeSave.call(component)) {
                    component.setValidator(validator);
                    $modal.modal('hide');
                }
                return;
            }
            $modal.modal('hide');
        });
        return {name: 'Validator', setter: setter}
    }
    
    PropertySetter.prototype.getFiltersSetter = function () {
        var component = this.getComponent();
        var setter = $('<div/>', {'class': 'filters-setter'});
        var $group = $('<div/>', {'class': 'input-group'});
        var $input = $('<input/>', {type: 'text', readonly: true});
        var $trigger = $('<span/>', {
            'class': "input-group-addon" ,
            'data-toggle': "modal" ,
            'data-target': "#filters"
        }).html('...');
        var displayValue = function() {
            var rs = 'no filter';
            var val = component.getFilters();
            if (val.length > 1) {
                rs = val.length + ' filters'
            } else if (val.length === 1) {
                if ($.isPlainObject(val[0])) {
                     rs = val[0].name;
                } else if (val[0] instanceof Nth.Filter) {
                     rs = val[0].__CLASS__;
                }
            }
            $input.val(rs);
        }
        displayValue();
        $group.append($input, $trigger);
        var $modal = $('<div/>', {
            'class': "modal fade",
            id: "filters",
            tabindex: "-1",
            role: "dialog",
            'aria-labelledby': "filtersLabel"
        }).on('hidden.bs.modal', function () {
            component.initFilters().hookFilters();
            displayValue();
        });
        var $dialog = $('<div/>', {'class': "modal-dialog", role: "document"});
        var $content = $('<div/>', {'class': 'modal-content'});
        var $header = $('<div/>', {'class': 'modal-header'});
        var $close = $('<button/>', {
            type: "button",
            'class': "close",
            'data-dismiss': "modal",
            'aria-label': "Close"
        }).html('<span aria-hidden="true">&times;</span>');
        var $title = $('<h4/>', {'class': "modal-title",id: "filtersLabel"}).html('Filters');
        $header.append($close, $title);
        var $body = $('<div/>', {'class': 'modal-body'});
        var $footer = $('<div/>', {'class': 'modal-footer'});
        var $panelGroup = $('<div/>', {
            'class': "panel-group",
            id: "filters-accordion",
            role: "tablist",
            'aria-multiselectable': "true"
        });
        var supportFilters = component.getSupportFilters();
        $.each(supportFilters.filters, function (i, options) {
            var vclass = options.filter.__CLASS__;
            var filter = component.getFilter(vclass);
            if (filter) {
                options.checked = true;
            } else {
                filter = options.filter.setElement(component);
            }
            var so = $.extend({}, {
                beforeSave: function () {},
                onClose: function() {}
            }, filter.getSetterOptions());
            var unique = vclass.split('.').join('_') + '_' + i;
            var $panel = $('<div/>', {'class': "panel panel-default"});
            var $panelHeading = $('<div/>', {'class': "panel-heading", role: "tab", id: "heading-" + unique});
            var $panelTitle = $('<a/>', {role: "button", href: 'javascript:;'});
            var $radioInput = $('<input/>', {
                id: 'rad-' + unique,
                type: 'checkbox',
                name: 'filter-for-element',
                value: unique,
                checked: options.checked
            }).data({
                filter: filter,
                setterOptions: so
            });
            if (so.fieldset) {
                var $inputWrapper = $('<span/>', {'class': 'input-wrapper'}).append($radioInput);
                var $toggleIcon = $('<span/>', {'class': 'pull-right'}).html('<i class="fa fa-toggle-down"></i>');
                $panelHeading.append($inputWrapper, $panelTitle.html(so.subject), $toggleIcon);
                $panelTitle.attr({
                    href: "#collapse-" + unique,
                    'data-toggle': "collapse", 
                    'data-parent': "#filters-accordion",
                    'aria-expanded': "true",
                    'aria-controls': "collapse-" + unique
                }).css({
                    'display': 'inline-block',
                    'font-weight': 'bold'
                });
                var $collapseContent = $('<div/>', {
                    id: "collapse-" + unique,
                    'class': "panel-collapse collapse" + ($radioInput.is(':checked') ? " in" : ""),
                    role: "tabpanel",
                    'aria-labelledby': "heading-" + unique
                });
                var $panelBody = $('<div/>', {'class': "panel-body"});
                $panel.append($collapseContent.append($panelBody.append(so.fieldset.getDomNode())));
                $panelTitle.collapse();
                $collapseContent.on('show.bs.collapse', function () {
                    $toggleIcon.html('<i class="fa fa-toggle-up"></i>');
                }).on('hide.bs.collapse', function () {
                    $toggleIcon.html('<i class="fa fa-toggle-down"></i>');
                });
                $radioInput.on('change', function () {
                    if ($(this).is(':checked')) {
                        $collapseContent.collapse('show'); 
                    } else {
                        $collapseContent.collapse('hide'); 
                    }
                });
            } else {
                var $radioLabel = $('<label/>', {'for': 'rad-' + unique}).html(so.subject);
                $panelHeading.append($panelTitle.append($radioInput, $radioLabel));
            }
            $panel.prepend($panelHeading);
            if (typeof $().iCheck === 'function') {
                $radioInput.iCheck({
                    checkboxClass: 'icheckbox_minimal',
                    radioClass: 'iradio_minimal'
                }).on('ifChanged', function () {
                    $(this).trigger('change');
                });
            }
            $panelGroup.append($panel);
        })
        $body.append($panelGroup);
        var $exit = $('<button/>', {type: "button", 'class': "btn btn-default", 'data-dismiss': "modal"}).html('Close');
        var $save = $('<button/>', {type: "button", 'class': "btn btn-primary"}).html('Save changes');
        $footer.append($exit, $save);
        $modal.html($dialog.html($content.append($header, $body, $footer)));
        setter.append($group, $modal);
        $save.on('click', function() {
            component.removeFilters();
            var $checked = $panelGroup.find('input[name=filter-for-element]:checked');
            if ($checked.length) {
                var filter = $checked.data('filter');
                var so = $checked.data('setterOptions');
                if (false !== so.beforeSave.call(component)) {
                    component.setFilter(filter);
                    $modal.modal('hide');
                }
                return;
            }
            $modal.modal('hide');
            return;
        });
        return {name: 'Filters', setter: setter}
    }
    
    PropertySetter.prototype.getSelectItemDataSetter = function() {
        var component = this.getComponent();
        var getValueLabel = function(val) {
            if (val.length > 1) {
                return val.length + ' items'
            }
            return val.length + ' item';
        }
        var val = component.getOption('selectItemData');
        var setter = $('<div/>', {'class': 'select-item-data-setter'});
        var $group = $('<div/>', {'class': 'input-group'});
        var $input = $('<input/>', {
            type: 'text',
            value: getValueLabel(val),
            readonly: true
        });
        var $trigger = $('<span/>', {
            'class': "input-group-addon" ,
            'data-toggle': "modal" ,
            'data-target': "#selectItemData"
        }).html('...');
        $group.append($input, $trigger);
        var $modal = $('<div/>', {
            'class': "modal fade",
            id: "selectItemData",
            tabindex: "-1",
            role: "dialog",
            'aria-labelledby': "selectItemDataLabel"
        });
        var $dialog = $('<div/>', {
            'class': "modal-dialog",
            role: "document"
        });
        var $content = $('<div/>', {'class': 'modal-content'});
        var $header = $('<div/>', {'class': 'modal-header'});
        var $close = $('<button/>', {
            type: "button",
            'class': "close",
            'data-dismiss': "modal",
            'aria-label': "Close"
        }).html('<span aria-hidden="true">&times;</span>');
        var $title = $('<h4/>', {
            'class': "modal-title",
            id: "selectItemDataLabel"
        }).html('Select item data');
        $header.append($close, $title);
        var $body = $('<div/>', {'class': 'modal-body'});
        var editTable = $body.editTable({
            headerCols: ['Value', 'Name', 'Selected'],
            cellType: { 
                2: {
                    type: 'radio', 
                    name: 'selected'
                } 
            }
        });
        editTable.loadData(val);
        var $footer = $('<div/>', {'class': 'modal-footer'});
        var $exit = $('<button/>', {
            type: "button",
            'class': "btn btn-default",
            'data-dismiss': "modal"
        }).html('Close');
        var $save = $('<button/>', {
            type: "button",
            'class': "btn btn-primary"
        }).html('Save changes');
        $footer.append($exit, $save);
        $modal.html($dialog.html($content.append($header, $body, $footer)));
        setter.append($group, $modal);
        $save.on('click', function() {
            val = editTable.getData();
            component.setOption('selectItemData', val).createSelectItems();
            $input.val(getValueLabel(val));
        });
        return {name: 'Select item data', setter: setter}
    }
    
    PropertySetter.prototype.getSelectItemUrlSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('selectItemUrl'),
            placeholder: 'ex: model/htmloption/DM_TINH_THANH'
        }).on('blur', function() {
            component.setOption('selectItemUrl', this.value).createSelectItems();
        });
        return {name: 'Select item URL', setter: setter};
    }
    
    PropertySetter.prototype.getBindConstraintSetter = function() {
        var component = this.getComponent();
        var setter = $('<select/>');
        var $pvine = $('<option/>', {value: 1}).html('Sequence');
        var $freedom =  $('<option/>', {value: 0}).html('Random');
        var val = component.getOption('bindConstraint');
        setter.append($pvine, $freedom).val(val).on('change', function() {
            component.setOption('bindConstraint', Number(this.value));
        });
        return {name: 'Bind constraint', setter: setter};
    }
    
    PropertySetter.prototype.getBindIndexSetter = function() {
        var component = this.getComponent();
        var setter = $('<input/>', {
            type: 'text',
            value: component.getOption('bindIndex')
        }).on('blur', function() {
            component.setOption('bindIndex', this.value);
        });
        return {name: 'Bind index', setter: setter};
    }
    
    PropertySetter.prototype.getMessageNotifierSetter = function () {
        var component = this.getComponent();
        var setter = $('<select/>');
        var $yes = $('<option/>', {value: 1}).html('Popup');
        var $no =  $('<option/>', {value: 2}).html('Highlight with message');
        var val = component.getOption('required', 0);
        setter.append($yes, $no).val(val).on('change', function() {
            component.setOption('messageNotifier', parseInt(this.value));
        });
        return {name: 'Message notifier', setter: setter };
    }
    
    Nth.FormBuilder.PropertySetter = PropertySetter;
    
    return PropertySetter;
});