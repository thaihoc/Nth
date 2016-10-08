;
(function (factory) {

    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Validator'], factory);
    } else {
        factory(Nth);
    }
})(function (Nth) {

    var Unit = function (options) {
        Nth.Validator.call(this, {
            fraction: ',',
            invalidCurrency: 'Giá trị phải là số'
        });
        this.mergeOptions(options);
    }

    Unit.prototype = Object.create(Nth.Validator.prototype);

    Unit.prototype.constructor = Unit;

    Unit.prototype.__CLASS__ = 'Nth.Validator.Unit';

    Unit.prototype.getFraction = function () {
        return this.getOption('fraction');
    }

    Unit.prototype.getSeparator = function () {
        return this.getFraction() === ',' ? '.' : ',';
    }

    Unit.prototype.onHook = function () {
        var element = this.getElement();
        var inst = this;
        var value = element.getValue();
        var fraction = element.getOption('decimalFraction', this.getFraction());
        if (value) {
            var numberHelper = new Nth.Helper.Number(value, fraction);
            element.setValue(numberHelper.addSeparator(this.getSeparator()).getNumber());
        }
        element.getControl().getNode().on('keyup.Unit', function () {
            var value = this.value;
            if (value) {
                if (!inst.isValid(value)) {
                    var self = this;
                    $(this).attr('readonly', true);
                    return Nth.Alert(inst.getMessage(), function () {
                        while (value && !inst.isValid(value)) {
                            value = value.substr(0, value.length - 1);
                        }
                        $(self).removeAttr('readonly').val(value);
                        element.focus();
                    });
                }
                if (this.value) {
                    var numberHelper = new Nth.Helper.Number(this.value, inst.getFraction());
                    this.value = numberHelper.addSeparator(inst.getSeparator()).getNumber();
                }
            }
        });
        element.getWrapper().getNode().on('nth.fb.export-data.Unit', function (e, item) {
            item.decimalFraction = inst.getFraction();
        }).on('nth.fb.import-data.Unit', function (e, item) {
            if (item.decimalFraction) {
                element.setOption('decimalFraction', item.decimalFraction);
            }
        });
        element.setOption('decimalFraction', this.getFraction());
        return this;
    }

    Unit.prototype.onUnhook = function () {
        var element = this.getElement();
        element.getControl().getNode().off('keyup.Unit');
        element.getWrapper().getNode().off('nth.fb.export-data.Unit nth.fb.import-data.Unit');
        return this;
    }

    Unit.prototype.isValid = function (unit) {
        var s1 = this.getSeparator() === '.' ? '\\.' : ',';
        var s2 = s1 === ',' ? '\\.' : ',';
        var re = new RegExp('^([\\d' + s1 + ']+(' + s2 + '(\\d+)?)?)$');
        if (re.test(unit)) {
            return true;
        }
        this.setMessage(this.getOption('invalidCurrency'));
        return false;
    }

    Unit.prototype.getSetterOptions = function () {
        var inst = this;
        var fieldset = new Nth.FormBuilder.Fieldset('unitv-fieldset');
        var row_1 = new Nth.FormBuilder.Row('unitv-row-1', {
            parentComponent: fieldset
        });
        var col_1 = new Nth.FormBuilder.Column('unitv-column-1', {
            parentComponent: row_1,
            wrapperAttributes: {
                'class': 'col-xs-6'
            }
        });
        var fraction = new Nth.FormBuilder.Element.Select('unitv-format-option', {
            parentComponent: col_1,
            label: 'Dấu phân cách cho phần lẻ',
            selectItemData: [
                [',', 'Dấu phẩy', true],
                ['.', 'Dấu chấm']
            ],
            value: this.getFraction()
        });
        fieldset.addComponent(row_1);
        fieldset.addComponent(col_1);
        fieldset.addComponent(fraction);
        return {
            subject: 'Định dạng theo kiểu tiền tệ',
            fieldset: fieldset,
            beforeSave: function () {
                inst.setOption('fraction', fraction.getValue());
            }
        }
    }
    
    Unit.prototype.toJson = function () {
        return {
            name: this.__CLASS__,
            options: {
                fraction: this.getOption('fraction')
            }
        }
    }

    Nth.Validator.Unit = Unit;

    return Unit;
});