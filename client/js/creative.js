(function($) {
    "use strict";
    var _baseUrl = window.location.origin;

    $(document).ready(function(){
        addStylingFunctionality();
        listenToButtons();
    });


    function listenToButtons() {
        $('#s-just-get-text').click(function(){
            $('#s-just-get-text').attr({disabled: 'disabled'});
            $('#s-goto-signup').attr({disabled: 'disabled'});
            $('#s-modal-signup #s-loading').show();
            var number = $('#s-phone').val();
            var userData = { tos: 1, phone: number };
            $.ajax({
                type: "POST",
                url: _baseUrl + '/users/incomplete',
                data: userData,
                success: success,
                error: error,
                complete: finallyFunc
            });

            function success(data) {
                $('#success-message').show()
                $('#s-phone').val('');
            }
            function error(xhr, error, obj){
                $('#error-message > div').text('Hmmm... There was a connection issue.  Please try entering your number again or contact customer at hello@surpriseher.co or 415-985-4438');
                $('#error-message').show()
            }
            function finallyFunc(){
                $('#s-modal-signup #s-loading').hide();
                $('#s-modal-signup').modal('hide');
                $('#s-just-get-text').removeAttr('disabled');
                $('#s-goto-signup').removeAttr('disabled');
            }
        });

        $('#s-signup').click(function(){
            $('#error-message').hide();
            var number = $('#s-phone').val();
            if( number.length < 10 ) {
                $('#error-message > div').text('Please Enter Valid Phone Number');
                $('#error-message').show()
                return;
            }
            $('#s-goto-signup').attr('href', '/signup.html?p=' + number);
            $("#s-modal-signup").modal('show');
        });
    }

    function addStylingFunctionality(){

        // Add phone mask
        $('#s-phone').inputmask('mask', { mask: "(999) 999-9999", autoUnmask: true});

        // jQuery for page scrolling feature - requires jQuery Easing plugin
        $('a.page-scroll').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: ($($anchor.attr('href')).offset().top - 50)
            }, 1250, 'easeInOutExpo');
            event.preventDefault();
        });

        // Highlight the top nav as scrolling occurs
        $('body').scrollspy({
            target: '.navbar-fixed-top',
            offset: 51
        })

        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(function() {
            $('.navbar-toggle:visible').click();
        });


        // Offset for Main Navigation
        $('#mainNav').affix({
            offset: {
                top: 100
            }
        })

        // Initialize WOW.js Scrolling Animations
        new WOW().init();
    }

})(jQuery); // End of use strict
