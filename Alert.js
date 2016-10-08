;(function(factory) {
    
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Nth/Nth', 'bootstrap'], factory);
    } else {
        factory(Nth);
    }
})(function(Nth) {
    
    var Alert = function(message, callback) {
        if ($('#alertModal').length) {
            return;
        }
        var $modal = $('<div/>', {
            'class': "modal fade",
            'id': "alertModal",
            'tabindex': "-1",
            'role': "dialog",
            'aria-labelledby': "alertModalLabel"
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
        var $title = $('<h4/>', {
            'class': "modal-title",
            'id': "alertModalLabel"
        }).html('Thông báo');
        $header.append($dismiss, $title);
        var $body = $('<div/>', {'class': 'modal-body'}).html(message);
        var $footer = $('<div/>', {'class': 'modal-footer'});
        var $ok = $('<button/>', {
            type: "button",
            'class': "btn btn-primary"
        }).html('Đồng ý');
        $ok.on('click', function() {
            $modal.modal('hide');
        });
        $footer.append($ok);
        $content.append($header, $body, $footer);
        $modal.append($dialog.append($content));
        $('body').append($modal.modal());
        $modal.on('shown.bs.modal', function() {
            $ok.focus();
        });
        $modal.on('hidden.bs.modal', function() {
            $modal.remove();
            if (typeof callback === 'function') {
                callback();
            }
        });
        return $modal;
    }
    
    Nth.Alert = Alert;
    
    return Alert;
});