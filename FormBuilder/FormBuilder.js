;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define([
            'Nth/Nth', 
            'Nth/Options',
            'Nth/AsyncTaskManager',
            'jquery-ui'
        ], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var FormBuilder = function(options) {
        var nth = new Nth.Nth();
        if (nth.versionCompare($.fn.jquery, '1.9.0') === -1) {
            console.warn('FormBuilder plugin required jquery version equal to 1.9.0 or higher');
            return;
        }
        Nth.Options.call(this, {
            siteRoot: '',
            edittingFormClass: 'form-editting',
            formWrapperClass: 'form-wrapper',
            componentRowClass: 'row',
            componentColumnClass: 'col',
            componentDisabledClass: 'disabled',
            elementWrapperClass: 'form-group',
            elementLabelClass: 'control-label',
            elementLabelContentClass: 'label-content',
            elementErrorMessageClass: 'form-error',
            elementRequiredLabelClass: 'mandatory',
            elementRequiredLabelContent: '(*)',
            elementClass: 'form-control',
            activeRowClass: 'active',
            activeColumnClass: 'active',
            activeElementClass: 'active',
            columnReferPropertySelectItems: '',
            elementErrorClass: 'has-error',
            defaultColumnSizeClass: 'col-md-4',
            componentNamePrefix: '',
            controlIdPrefix: '_fc',
            mandatoryTitle: 'Trường bắt buộc',
            messageNotifier: 1
        });
        this.mergeOptions(options);
        this.asyncTaskManager = new Nth.AsyncTaskManager({
            debug: false
        });
    }
    
    FormBuilder.prototype = Object.create(Nth.Options.prototype);
    
    FormBuilder.prototype.constructor = FormBuilder;
    
    FormBuilder.prototype.__CLASS__ = 'Nth.FormBuilder.FormBuilder';
    
    FormBuilder.prototype.getAsyncTaskManager = function() {
        return this.asyncTaskManager;
    }
    
    FormBuilder.prototype.serializableData = function(data) {
        return $.isPlainObject(data) || $.isArray(data) || $.isNumeric(data) || $.type(data) === 'string' || $.type(data) === 'boolean' || data === null;
    }
    
    FormBuilder.prototype.encodeXmlData = function(data) {
        if (!this.serializableData(data)) {
            throw 'Encoding failed';
        }
        return encodeURIComponent(JSON.stringify(data));
    }
    
    FormBuilder.prototype.decodeXmlData = function(data) {
        if (typeof data === 'string' && data) {
            try {
                return $.parseJSON(decodeURIComponent(data));
            } catch (e) {
                console.log(e);
                return $.parseJSON(unescape(data));
            }            
        }
        return data;
    }
    
    FormBuilder.prototype.getXmlObject = function(obj, child) {
        if (obj instanceof $) {
            return obj;
        } else if (typeof obj === 'string') {
            var $doc = $($.parseXML(obj));
            return typeof child === 'string' && child ? $doc.children(child) : $doc;
        } else if (obj && $.type(obj) === 'object') {
            return $(obj);
        } else {
            return $();
        }
    }
    
    Nth.FormBuilder.__getInstance = function() {
        if (!(Nth.FormBuilder.__instance instanceof FormBuilder)) {
            Nth.FormBuilder.__instance = new FormBuilder();
        }
        return Nth.FormBuilder.__instance;
    }
    
    Nth.FormBuilder.FormBuilder = FormBuilder;
    
    return FormBuilder;
});