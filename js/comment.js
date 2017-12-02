$(document).ready(function(){
    var commentForm = $("#post-new-comment");
    $(document).on('click', '.comment-reply-to-link', function() {
        $('input[name="fields[replying_to]"]', commentForm).val($(this).data('replying-to-id'));

        $.scrollTo(commentForm, {
            duration: 500,
            offset: -50
        });
    });


});
