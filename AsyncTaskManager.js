;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'Nth/Options'], factory);
    } else {
        factory(Nth);
    }
})(function (Nth) {

    /**
     * Asynchronous Task Manager plugin
     * Manage the processes to execute asynchronous and sequential
     */
    var AsyncTaskManager = function (option) {
        var setting = new Nth.Options($.extend({}, {
            debug: false,
            auto: true //Run the first and next process automatically
        }, option));

        this.list = [];
        this.executing = false;

        this.add = function (obj, method, args, id, debug) {
            var process = [obj, method, args, id, debug];
            this.list.push(process);
            if (setting.getOption('debug') || debug) {
                console.log('add process: ');
                this.debug(process);
            }
            if (setting.getOption('auto')) {
                this.execute();
            }
            return this;
        }

        this.done = function (result) {
            var process = this.current();
            this.executing = false;
            if (setting.getOption('debug') || process[4]) {
                console.log('process done: ');
                if (result) {
                    console.log(result);
                }
                this.debug(process);
            }
            this.list.splice(0, 1);
            if (setting.getOption('auto')) {
                this.next();
            }
            return this;
        }

        this.current = function () {
            return this.list[0];
        }

        this.execute = function () {
            if (!this.executing) {
                this.executing = true;
                var process = this.current();
                process[1].apply(process[0], process[2]);
            }
            return this;
        }
        
        this.count = function() {
            return this.list.length;
        }

        this.next = function () {
            if (this.count()) {
                this.execute();
                return true;
            }
            return false;
        }

        this.debug = function(process) {
            var id = process[3] || '';
            console.log('- id: %s', id);
//            console.log(process);
            console.log('----------------------------');
        }
    }
    
    Nth.AsyncTaskManager = AsyncTaskManager;
            
    return AsyncTaskManager;
});