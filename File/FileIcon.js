;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/File/File'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var FileIcon = function(file) {
        this.domNode = $('<span/>');
        this.setFile(file);
    }
    
    FileIcon.prototype.getFile = function() {
        return this.file;
    }
    
    FileIcon.prototype.setFile = function(file) {
        if (!(file instanceof Nth.File.File)) {
            throw 'The argument was pass must be an instance of Nth.File.File';
        }
        this.file = file;
        this.getDomNode().attr('class', 'file-icon file-' + file.getExtension().toLowerCase())
        return this;
    }
    
    FileIcon.prototype.getDomNode = function() {
        return this.domNode;
    }
    
    Nth.File.FileIcon = FileIcon;
    
    return FileIcon;
});