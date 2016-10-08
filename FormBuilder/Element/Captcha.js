;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/FormBuilder/Element', 'Nth/Validator/Captcha'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Captcha Element
     * Using AJAX with GET method to generate and validate CAPTCHA text
     * initUrl: header response content must be image source
     * validUrl: response 0 as invalid, otherwise as valid
     */
    var Captcha = function(name, options) {
        Nth.FormBuilder.Element.call(this, name, $.extend(true, {
            idPrefix: '_captcha_',
            creatorIconClass: 'icon captcha',
            creatorLabel: 'Captcha',
            changeText: 'Đổi mã xác nhận khác',
            imageContainerClass: 'captcha-image-container',
            controlAttributes: {
                type: 'text'
            }
        }, options));
        name = this.getName();
        var inst = this;
        var rc = new Nth.ReflectionClass(this.__CLASS__);
        var controlId = this.getConfigParam('controlIdPrefix') + name;
        var $control = $('<input/>', $.extend({}, {
            id: controlId,
            name: name,
            'class': this.getConfigParam('elementClass')
        }, this.getOption('controlAttributes')));
        $control.attr('autocomplete', 'off');
        this.control = new Nth.Dom.Node($control);
        var labelAttributes = this.getOption('labelAttributes', {});
        if (labelAttributes['for'] === undefined) {
            this.getLabel().getNode().attr('for', controlId);
        }
        var $imageContainer = $('<div/>', { 'class': this.getOption('imageContainerClass') });
        this.getWrapper().getNode().addClass(rc.getShortName().toLowerCase()).append($imageContainer, $control);
        var initUrl = this.getInitUrl();
        if (initUrl) {
            var $div = $('<div/>').html('<i class="fa "></i> Loading...');
            var $img = $('<img/>', {
                'class': 'captcha-image',
                alt: 'capt_' + name,
                src: initUrl
            });
            var $change = $('<a/>', {href: 'javascript:;'}).on('click', function() {
                inst.changeValue();
            }).html(inst.getOption('changeText'));
            this.getImageContainer().append($div.html($img), $change);
        }
        if (this.getOption('disabled')) {
            this.disable();
        }
    }
    
    Captcha.prototype = Object.create(Nth.FormBuilder.Element.prototype);
    
    Captcha.prototype.constructor = Captcha;
    
    Captcha.prototype.__CLASS__ = 'Nth.FormBuilder.Element.Captcha';
    
    Captcha.prototype.getControl = function() {
        return this.control;
    }
    
    Captcha.prototype.setValue = function(value) {
        this.getControl().getNode().val(value);
        this.getWrapper().getNode().trigger('nth.fb.set-value', [value, this]);
        return this;
    }
    
    Captcha.prototype.getValue = function() {
        return this.getControl().getNode().val();
    }
    
    Captcha.prototype.enable = function () {
        this.getControl().getNode().removeAttr('disabled');
        return Nth.FormBuilder.Element.prototype.enable.call(this);
    }
    
    Captcha.prototype.disable = function () {
        this.getControl().getNode().attr('disabled', 'disabled');
        return Nth.FormBuilder.Element.prototype.disable.call(this);
    }
    
    Captcha.prototype.focus = function() {
        Nth.FormBuilder.Element.prototype.focus.call(this);
        this.getControl().getNode().focus();
        return this;
    }
    
    Captcha.prototype.blur = function() {
        Nth.FormBuilder.Element.prototype.blur.call(this);
        this.getControl().getNode().blur();
        return this;
    }
    
    Captcha.prototype.getInitUrl = function() {
        var initUrl = this.getOption('initUrl');
        if (typeof initUrl === 'function') {
            return initUrl.apply(this);
        } else if (typeof initUrl === 'string') {
            if (!$.trim(initUrl).match(/^https?:\/\//)) {
                initUrl = this.getConfigParam('siteRoot') + initUrl;
            }
            var queryParams = 't=' + new Date().getTime() + '&captcha_name=' + this.getName();
            return (initUrl && ~initUrl.indexOf('?') ? '&' : '?') + queryParams;
        }
        return null;
    }
    
    Captcha.prototype.getImageContainer = function() {
        if (this.getOption('imageContainer')) {
            var $wrapper = $.getElement(this.getOption('imageContainer'));
            if (!$wrapper.find('.' + this.getOption('imageContainerClass')).length) {
                $wrapper.append($('<div/>', {'class' : this.getOption('imageContainerClass')}));
            }
            return $wrapper.find('.' + this.getOption('imageContainerClass'));
        }
        return this.getWrapper().getNode().find('.' + this.getOption('imageContainerClass'));
    }
    
    Captcha.prototype.changeValue = function() {
        var $container = this.getImageContainer();
        var $img = $container.find('img');
        $img.attr('src', this.getInitUrl());
        return this;
    }
    
    Captcha.prototype.copyToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t add Captcha element to DrawingBoard');
            return;
        }
        var captcha = new Captcha(true, this.getOptionsCopy());
        this.getDrawingBoard().getFieldset().addComponent(captcha);
        captcha.inactiveOthers();
        return this;
    }
    
    Captcha.prototype.cloneToDrawingBoard = function() {
        if (!this.hasDrawingBoard()) {
            console.warn('Can\'t clone Captcha element to DrawingBoard');
            return;
        }
        var captcha = new Captcha(true, this.getOptionsClone());
        this.getDrawingBoard().getFieldset().addComponent(captcha);
        captcha.inactiveOthers();
        return this;
    }
    
    Captcha.prototype.getPropertySetters = function() {
        if (!this.hasDrawingBoard()) {
            return [];
        }
        var options = Nth.FormBuilder.Element.prototype.getPropertySetters.call(this);
        var propertySetter= new Nth.FormBuilder.PropertySetter(this);
        options.push.apply(options, [
            propertySetter.getMarksMandatorySetter()
            , propertySetter.getValidNameSetter()
            , propertySetter.getValidUrlSetter()
            , propertySetter.getInitUrlSetter()
            , propertySetter.getImageContainerSetter()
            , propertySetter.getElementIdSetter()
            , propertySetter.getElementNameSetter()
            , propertySetter.getElementClassSetter()
            , propertySetter.getElementStyleSetter()
            , propertySetter.getPlaceholderSetter()
            , propertySetter.getElementTitleSetter()
            , propertySetter.getRequiredSetter()
            , propertySetter.getBindIndexSetter()
        ]);
        return options;
    }
    
    Captcha.prototype.getValidUrl = function() {
        var validUrl = this.getOption('validUrl');
        if (typeof validUrl === 'function') {
            return validUrl.apply(this);
        } else if (typeof validUrl === 'string') {
            if (!$.trim(validUrl).match(/^https?:\/\//)) {
                validUrl = this.getConfigParam('siteRoot') + validUrl;
            }
            return validUrl += (~validUrl.indexOf('?') ? '&' : '?') + 'captcha_name=' + this.getName();
        }
        return null;
    }
    
    Captcha.prototype.isValid = function(options) {
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
        var strHelper = new Nth.Helper.String();
        var validator = Nth.Validator.__getInstance();
        var validName = this.getValidName();
        if (this.getOption('required') && this.isEmpty()) {
            strHelper.setString(validator.getOption('retypeText'));
            this.setMessage(strHelper.sprintf(validName));
            return done();
        }
        var validator = new Nth.Validator.Captcha({
            url: this.getValidUrl()
        });
        validator.isValid(function (success) {
            if (!success) {
                inst.setMessage(this.getMessage());
            }
            return done();
        });
        return this;
    }
    
    Captcha.prototype.toJson = function () {
        var json = Nth.FormBuilder.Element.prototype.toJson.call(this);
        json.options.controlAttributes = this.getControl().getAttributes();
        return json;
    }
    
    Captcha.__fromXml = function(xml, options) {
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
        return new Captcha(name, options);
    }
    
    Nth.FormBuilder.Element.Captcha = Captcha;
    
    return Captcha;
});