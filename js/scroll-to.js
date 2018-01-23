$(document).ready(function() {
    $(document).on('click', '.scroll-to', function() {

        var dest = $(this).attr('href')

        $.scrollTo(dest, {
            duration: 500,
            offset: -50
        });
    })
    ;
});
