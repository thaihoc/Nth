;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    /**
     * Array Helper plugin
     */
    var ArrayHelper = function (arr) {
        this.setArray(arr || []);
    }
    
    ArrayHelper.prototype.setArray = function (arr) {
        if (!(arr instanceof window.Array)) {
            console.warn('The argument was passed must be an instance of Array');
            return this;
        }
        this.array = arr;
        return this;
    }

    ArrayHelper.prototype.getArray = function () {
        return this.array;
    }
    
    ArrayHelper.prototype.removeItem = function (item) {
        if (this.existsItem(item)) {
            this.array.splice(this.array.indexOf(item), 1);
        }
        return this;
    }
    
    ArrayHelper.prototype.hasItem = function (item) {
        return this.array.indexOf(item) > -1;
    }
    
    ArrayHelper.prototype.addItem = function (item) {
        this.array.push(item);
        return this;
    }

    ArrayHelper.prototype.flip = function () {
        var tmp = {};
        var array = this.getArray();
        for (var key in array) {
            if (array.hasOwnProperty(key)) {
                tmp[array[key]] = key;
            }
        }
        array = tmp;
        return this;
    }

    ArrayHelper.prototype.trimItems = function () {
        var array = this.getArray();
        for (var i in array) {
            if (typeof array[i] == 'string') {
                array[i] = $.trim(array[i]);
            }
        }
        return this;
    }
    
    Nth.Helper.Array = ArrayHelper;
    
    return ArrayHelper;
});