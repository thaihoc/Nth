;(function(factory) {
    
    'use strict';
    
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var Node = function(node) {
        this.attributes = {}
        if (this instanceof Node) {
            this.setNode(node);
        } else {
            return new Node(node);
        }
    }
    
    Node.prototype.getNode = function() {
        return this.node;
    }
    
    Node.prototype.setNode = function(node) {
        this.node = $.getElement(node);
        this.sync();
    }
    
    Node.prototype.sync = function() {
        var inst = this;
        if (!this.getNode().length) {
            this.attributes = {}
            return this;
        }
        $.each(this.getNode()[0].attributes, function() {
            inst.attributes[this.name] = this.value;
        });
        return this;
    }
    
    Node.prototype.getAttributes = function() {
        this.sync();
        return this.attributes;
    }
    
    Node.prototype.setAttributes = function(attributes) {
        var inst = this;
        $.each(this.sync().attributes, function(name) {
            inst.removeAttribute(name);
        });
        this.getNode().attr(attributes)
        return this;
    }
    
    Node.prototype.getAttribute = function(name, def) {
        this.sync();
        if (def === undefined) {
            def = null;
        }
        return this.attributes[name] === undefined ? def : this.attributes[name];
    }
    
    Node.prototype.setAttribute = function(name, value) {
        this.getNode().attr(name, value);
        this.attributes[name] = value;
        return this;
    }
    
    Node.prototype.mergeAttributes = function(attributes, recursive) {
        return this.setAttributes($.extend(recursive === undefined ? {} : recursive, this.getAttributes(), attributes));
    }
    
    Node.prototype.existsAttribute = function(name) {
        return this.sync().attributes[name] !== undefined;
    }
    
    Node.prototype.removeAttribute = function(name) {
        if (this.existsAttribute(name)) {
            delete this.attributes[name];
            this.getNode().removeAttr(name);
        }
        return this;
    }
    
    Node.prototype.clone = function() {
        return $.extend({}, {}, this.getAttributes());
    }
    
    Nth.Dom.Node = Node;
    
    return Node;
});