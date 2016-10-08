;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Browser plugin
     * Detect current browser info by user agent
     */
    var Browser = function (ua) {
        this.userAgent = ua;
        this.name = null;
        this.version = null;
        this.analyze();
    }
    
    Browser.prototype.setUserAgent = function (ua) {
        this.userAgent = ua;
        return this;
    }
    
    Browser.prototype.analyze = function () {
        if (!this.userAgent) {
            this.userAgent = navigator.userAgent;
        }
        var matches = this.userAgent.match(/MSIE\s(\d)+/);
        if (matches) {
            this.name = Nth.Browser.IE;
            this.version = matches[1] || null;
        }
        //Case when other browsers here...
        return this;
    }
    
    Browser.prototype.getName = function () {
        return this.name;
    }

    Browser.prototype.getVersion = function () {
        return this.version;
    }

    Browser.prototype.isIE = function () {
        return this.name === Nth.Browser.IE;
    }

    Browser.prototype.isChrome = function () {
        return this.name === Nth.Browser.CHROME;
    }

    Browser.prototype.isFirefox = function () {
        return this.name === Nth.Browser.FIREFOX;
    }

    Browser.IE = 'Internet Explorer';
    Browser.CHROME = 'Google Chrome';
    Browser.FIREFOX = 'Mozilla Firefox';
    
    Nth.Browser = Browser;
    
    return Browser;
});