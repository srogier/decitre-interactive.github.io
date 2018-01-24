$(document).ready(function() {
    var commentForm = $("#post-new-comment");
    var replyToBlock = $("#post-new-comment-message-reply-to");
    var replyingToInput = $('input[name="fields[replying_to]"]', commentForm);

    $(document).on('click', '.comment-reply-to-link', function() {
        var commentId = $(this).data('replying-to-id');
        var commentAuthor = $(this).data('replying-to-author');

        replyingToInput.val(commentId);
        $('.post-new-comment-message-reply-to--author', replyToBlock).html(commentAuthor);
        $('.post-new-comment-message-reply-to--id', replyToBlock).attr('href', '#comment--' + commentId);
        replyToBlock.show();

        $.scrollTo(commentForm, {
            duration: 500,
            offset: -50
        });
    });

    $(document).on('click', '.post-new-comment-message-reply-to--clear', function(event) {
        event.preventDefault();
        replyingToInput.val('');
        replyToBlock.hide();
    });


    commentForm.on('submit', function (event) {
        var $form = $(this);
        var commentFormMessages = $('.comment-form-messages', $form);

        event.preventDefault();

        var $submitBtn = $('#comment-form-submit', $form);
        // Disable to prevent multiple submit
        $submitBtn.attr('disabled', 'disabled');


        var type = $form.attr('method'),
            url = $form.attr('action'),
            data = $form.serialize(),
            contentType = 'application/x-www-form-urlencoded';

        $submitBtn.data('prev-val', $submitBtn.val());
        $submitBtn.val("Commentaire en cours d'envoi...");
        $(commentFormMessages).html('');

        $.ajax({
            type: type,
            url: url,
            data: data,
            contentType: contentType,
            success: function (data) {
                $form.find('textarea').val('');
                commentFormMessages.append($('#post-new-comment-message-success', $form).html());
            },
            error: function (err) {
                commentFormMessages.append($('#post-new-comment-message-error', $form).html());
            },
            complete: function () {
                grecaptcha.reset();
                $submitBtn
                    .attr('disabled', null)
                    .val($submitBtn.data('prev-val'))
                ;
            }
        });
    });


});
