;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'bootstrap'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {

    var Confirm = function(message, callback) {
        var choosed = Confirm.CLOSE;
        var $modal = $('<div/>', {
            'class': "modal fade",
            'id': "confirmModal",
            'tabindex': "-1",
            'role': "dialog",
            'aria-labelledby': "confirmModalLabel"
        });
        var $dialog = $('<div/>', {
            'class': "modal-dialog modal-sm",
            'role': "document"
        });
        var $content = $('<div/>', {'class': 'modal-content'});
        var $header = $('<div/>', {'class': 'modal-header'});
        var $dismiss = $('<button/>', {
            type: "button",
            'class': "close",
            'aria-label': "Close"
        }).html('<span aria-hidden="true">&times;</span>');
        $dismiss.on('click', function() {
            $modal.modal('hide');
        });
        var $title = $('<h4/>', {
            'class': "modal-title",
            'id': "confirmModalLabel"
        }).html('Xác nhận');
        $header.append($dismiss, $title);
        var $body = $('<div/>', {'class': 'modal-body'}).html(message);
        var $footer = $('<div/>', {'class': 'modal-footer'});
        var $dismiss2 = $('<button/>', {
            type: "button",
            'class': "btn btn-default"
        }).html('Đóng lại');
        $dismiss2.on('click', function() {
            choosed = Confirm.CANCEL;
            $modal.modal('hide');
        });
        var $ok = $('<button/>', {
            type: "button",
            'class': "btn btn-primary"
        }).html('Đồng ý');
        $ok.on('click', function() {
            choosed = Confirm.OK;
            $modal.modal('hide');
        });
        $footer.append($dismiss2, $ok);
        $content.append($header, $body, $footer);
        $modal.append($dialog.append($content));
        $('body').append($modal.modal());
        $modal.on('shown.bs.modal', function() {
            $dismiss2.focus();
        });
        $modal.on('hidden.bs.modal', function() {
            $modal.remove();
            if (typeof callback === 'function') {
                callback(choosed);
            }
        });
        return $modal;
    }
    
    Confirm.OK = 1;
    Confirm.CANCEL = 0;
    Confirm.CLOSE = -1;
    
    Nth.Confirm = Confirm;
    
    return Confirm;
});