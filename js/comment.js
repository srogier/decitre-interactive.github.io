$(document).ready(function(){
    var commentForm = $("#post-new-comment");
    $(document).on('click', '.comment-reply-to-link', function() {
        $('input[name="fields[replying_to]"]', commentForm).val($(this).data('replying-to-id'));

        $.scrollTo(commentForm, {
            duration: 500,
            offset: -50
        });
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
