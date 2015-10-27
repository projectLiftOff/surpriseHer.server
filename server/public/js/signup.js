(function($) {
    "use strict";
    var _googleAddresses = {};
    var _baseUrl = window.location.origin;

    $(document).ready(function(){

        addStylingFunctionality();
        enableAddingAddresses();
        addGoogleAddressAutoComplete();
        getUserToken();
        console.log(window.location.origin)
        
        $("#s-submit").click(function(){
            validateForm();
        })
    });

    function getUserToken(){
        $.get( _baseUrl + "/payments/client_token", function( clientToken ) {
            // TODO: error handling
            braintree.setup(clientToken, "dropin", {
                container: "payment-form"
            });
        });
    }

    function addStylingFunctionality(){
        $("#s-dob").inputmask('mm/dd/yyyy', {yearrange: { minyear: 1900, maxyear: 2000 }, 'clearIncomplete': true});

        // Highlight the top nav as scrolling occurs
        $('body').scrollspy({
            target: '.navbar-fixed-top',
            offset: 51
        });

        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(function() {
            $('.navbar-toggle:visible').click();
        });

        // Offset for Main Navigation
        $('#mainNav').affix({
            offset: {
                top: 100
            }
        });
    }

    function enableBraintree(){
        braintree.setup("CLIENT-TOKEN-FROM-SERVER", "dropin", {
          container: "dropin-container",
        });
    }

    function enableAddingAddresses() {
        var addressGroups = ['#s-addressGroupFour', '#s-addressGroupThree', '#s-addressGroupTwo'];
        $('#s-addAddress').click(function(){
            $( addressGroups.pop() ).show();
            if( addressGroups.length === 0 ) {
                $(this).parent().hide();
            }
        });
    }

    function addGoogleAddressAutoComplete() {
        var addressInputs = ['s-addressFour', 's-addressThree', 's-addressTwo', 's-addressOne'];
        addressInputs.forEach(function(addressInput){
            _googleAddresses[addressInput] = new google.maps.places.Autocomplete( (document.getElementById(addressInput)) );
        });
    }

    function validateForm(){
        var dob = $("#s-dob").val();
        var email = $("#s-email").val().trim();
        var addressCodeHasAddress = {};
        var formErrors = false;

        // C: validate email
        var validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
        if( !validEmail ) {
            console.log( 'not valid Email' );
            $('#s-emailError').text( 'Please enter a valid email' ).show();
            $('#s-emailError').closest('.form-group').addClass('has-error');
            formErrors = true;
        }

        //C: Check that all filled address fileds have codes and all codes have addresses
        for( var address in _googleAddresses ){
            var addressCode = $( '#'+ address +'Code' ).val().trim();
            if( _googleAddresses[address].getPlace() ) {
                if( !addressCode  ) {
                    console.log( address, 'is missing a code' );
                    $( '#' + address +'CodeError' ).text( 'Please enter a code for the above address' ).show();
                    $( '#' + address +'CodeError' ).closest('.form-group').addClass('has-error');
                    formErrors = true;
                }
                else {
                    addressCodeHasAddress[addressCode] = true;
                }
            }
            else if( !_googleAddresses[address].getPlace() && addressCode )  {
                console.log( address, 'address code is missing address' );
                $( '#' + address +'Error' ).text( 'Please enter an address associated with the code below or remove the code' ).show();
                $( '#' + address +'Error' ).closest('.form-group').addClass('has-error');
                formErrors = true;
            }
        }

        //C: Check that input code matches one of the shipping codes provieded in addresses section
        var selectedAddressCode = $('#s-selectedShippingAddress').val().trim();
        if( !addressCodeHasAddress[ selectedAddressCode ] ) {
            console.log( 'code does not match any of your address codes' );
            $( '#s-selectedShippingAddressError' ).text( 'Please enter a code that matches one of address codes entered above' ).show();
            $( '#s-selectedShippingAddressError' ).closest('.form-group').addClass('has-error');
            formErrors = true;
        }

        if( formErrors ) {
            $('#s-submit').removeClass('btn-primary').addClass('btn-danger');
            setTimeout(function(){
                $('#s-submit').removeClass('btn-danger').addClass('btn-primary');
            }, 3000);
        }
        return formErrors;
    }

})(jQuery); // End of use strict
