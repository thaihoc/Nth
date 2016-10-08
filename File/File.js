;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var File = function(path) {
        this.setPath(path);
    }
    
    File.prototype.getPath = function() {
        return this.path;
    }
    
    File.prototype.setPath = function(path) {
        this.path = (path || '').replace(/\\/g, File.DIRECTORY_SEPARATOR);
        return this;
    }
    
    File.prototype.getExtension = function() {
        var arr = this.path.split('.');
        return arr[arr.length - 1];
    }
    
    File.prototype.getBasename = function() {
        var arr = this.path.split(File.DIRECTORY_SEPARATOR);
        return arr[arr.length - 1];
    }
    
    File.DIRECTORY_SEPARATOR = '/';
    
    Nth.File.File = File;
    
    return File;
});