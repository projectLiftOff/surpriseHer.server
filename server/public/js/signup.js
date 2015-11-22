(function($) {
    "use strict";
    var _googleAddresses = {};
    var _validUserAddresses = {};
    var _queryData = {};
    var _baseUrl = window.location.origin;

    $(document).ready(function(){
        determineTypeOfSignUp();
        addStylingFunctionality();
        enableAddingAddresses();
        addGoogleAddressAutoComplete();
    });

    function determineTypeOfSignUp(){
        var searchQuery = window.location.search;
        searchQuery.indexOf('p=') > -1 ? unregisteredUserViewSetup() : incompleteRegisteredUserViewSetup();
    }

    function unregisteredUserViewSetup(){
        console.log('unregisteredUserSignUp');
        $('#s-select-shipping-address-section').hide();
        var queryArgs = window.location.search.slice(1).split('?');
        if( queryArgs.length === 1 ) {
            _queryData.phone = Number( queryArgs[0].split('=').pop() );
        }
        setUpOnSignUpSubmit('unregistered');
        // TODO: need to make sure validation for code input is turned off
    }

    function incompleteRegisteredUserViewSetup(){
        console.log('incompleteRegisteredUserSignUp');
        var queryArgs = window.location.search.slice(1).split('?');
        if( queryArgs.length === 1 ) {
            _queryData.userId = Number( queryArgs[0].split('=').pop() );
        }
        setUpOnSignUpSubmit('incompleteRegistered');
    }

    function setUpOnSignUpSubmit( signUpType ){
        $.get( _baseUrl + "/payments/client_token", function( clientToken ) {
            // TODO: error handling
            braintree.setup(clientToken, "dropin", {
                container: "payments",
                onPaymentMethodReceived: function (respose) {
                    validateForm( signUpType );
                    var userData = getUserData( signUpType, respose.nonce );
                    signUpType === 'incompleteRegistered' ? updateIncompleteRegisteredUser(userData) : createCompleteUser(userData);
                }
            });
        });
    }

    function updateIncompleteRegisteredUser( userData ) {
        var id = userData.user.userId;
        delete userData.user.userId;
        $.ajax({
            method: 'PUT',
            url: _baseUrl + '/users/' + id,
            contentType: 'application/json',
            data: JSON.stringify( userData ),
            success: onSuccess,
            error: onError
        });
        function onSuccess( data ){
            console.log('user updated!!');
            $('#s-signup-view').hide();
            $('#s-signup-incomplete-success').show();
        }
        function onError( error ){
            console.log('FAILED: user updated!!', arguments);
            $('#s-formError').text(error);
            $('#s-formError').show();
        }
    }

    function createCompleteUser( userData ){
        userData.user.tos = 1;
        $.ajax({
            method: 'POST',
            url: _baseUrl + '/users/complete',
            contentType: 'application/json',
            data: JSON.stringify( userData ),
            success: onSuccess,
            error: onError
        });
        function onSuccess( data ){
            console.log('user created!!');
            $('#s-signup-view').hide();
            $('#s-signup-unregistered-success').show();
        }
        function onError( error ){
            console.log('FAILED: user updated!!', arguments);
            $('#s-formError').text(error);
            $('#s-formError').show();
        }
    }

    function getUserData( signUpType, nonce ){
        var userData = {};
        userData.user = {}
        var dob = $("#s-dob").val().trim();
        userData.user.dob = moment(dob, "MM-DD-YYYY").valueOf();
        userData.user.first_name = $("#s-firstName").val().trim();
        userData.user.last_name = $("#s-lastName").val().trim();
        userData.user.email = $("#s-email").val().trim();
        userData.addresses = [];
        for( var address in _validUserAddresses ) {
            var formatedAddress = {};
            formatedAddress.full_address = _validUserAddresses[address].formatted_address;
            formatedAddress.address = _validUserAddresses[address].street_number + ' ' + _validUserAddresses[address].route;
            formatedAddress.city = _validUserAddresses[address].locality;
            formatedAddress.state = _validUserAddresses[address].administrative_area_level_1;
            formatedAddress.country = _validUserAddresses[address].country;
            formatedAddress.zip_code = _validUserAddresses[address].postal_code;
            formatedAddress.code_name = $('#'+ address +'Code').val().trim();
            var suite = $('#'+ address +'Suite').val().trim();
            if( suite ) formatedAddress.suite = suite;
            var addressed_to = $('#'+ address +'DeliveryFor').val().trim();
            if( addressed_to ) formatedAddress.addressed_to = addressed_to;
            userData.addresses.push( formatedAddress );
        }
        for( var param in _queryData ) {
            userData.user[param] = _queryData[param];
        }
        if( signUpType === 'incompleteRegistered' ) {
            userData.transaction = {};
            userData.transaction.shipToAddressCode = $('#s-selectedShippingAddress').val().trim();
        }
        userData.payments = {};
        userData.payments.nonce = nonce;
        return userData;
    }

    function addStylingFunctionality(){
        $("#s-dob").inputmask('mm/dd/yyyy', {yearrange: { minyear: 1900, maxyear: 2000 }, 'clearIncomplete': true, "placeholder": "MM/DD/YYYY"});

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

    function validateForm( signUpType ){
        removeAllErrors();

        var dob = $("#s-dob").val().trim();
        var email = $("#s-email").val().trim();
        var addressCodeHasAddress = {};
        var formErrors = false;

        // C: validate email
        var validEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
        if( !validEmail ) {
            $('#s-emailError').text( 'Please enter a valid email' );
            $('#s-emailError').show();
            $('#s-emailError').closest('.form-group').addClass('has-error');
            formErrors = true;
        }

        // C: validate dob
        if( dob === 'MM/DD/YYYY' || dob === '' ) {
            $('#s-dobError').text( 'Please enter a valid date of Date of Birth' );
            $('#s-dobError').show();
            $('#s-dobError').closest('.form-group').addClass('has-error');
            formErrors = true;
        }

        //C: Check that all filled address fileds have codes and all codes have addresses
        for( var address in _googleAddresses ){
            var addressCode = $( '#'+ address +'Code' ).val().trim();
            if( _googleAddresses[address].getPlace() ) {
                if( !addressCode  ) {
                    console.log( address, 'is missing a code' );
                    $( '#' + address +'CodeError' ).text( 'Please enter a code for the above address' );
                    $( '#' + address +'CodeError' ).show();
                    $( '#' + address +'CodeError' ).closest('.form-group').addClass('has-error');
                    formErrors = true;
                }
                else {
                    addressCodeHasAddress[addressCode] = true;
                }
            }
            else if( !_googleAddresses[address].getPlace() && addressCode )  {
                $( '#' + address +'Error' ).text( 'Please enter an address associated with the code below or remove the code' ).show();
                $( '#' + address +'Error' ).closest('.form-group').addClass('has-error');
                formErrors = true;
            }
        }

        //C: Check that all filled address fileds have valid shipping addresses (e.g !Golden Gate Park)
        var addresses = {};
        for( var address in _googleAddresses ) {
            var location = _googleAddresses[address].getPlace()
            if( location && location.address_components ) {
                addresses[address] = {};
                location.address_components.forEach(function(addressComp){
                    addresses[address][addressComp.types[0]] = addressComp.long_name;
                });
                var a = addresses[address];
                if( !(a.street_number && a.route && a.locality && a.postal_code && a.administrative_area_level_1) ) {
                    $( '#' + address + 'Error' ).text( 'Please a valid shipping address' ).show();
                    $( '#' + address ).closest('.form-group').addClass('has-error');
                    formErrors = true;
                }
                else {
                    addresses[address].formatted_address = location.formatted_address;
                    _validUserAddresses[address] = addresses[address];
                }
            } 
            else if( (location && location.name) || $( '#' + address ).val() ) {
                $( '#' + address + 'Error' ).text( 'Please a valid shipping address' ).show();
                $( '#' + address ).closest('.form-group').addClass('has-error');
            }
        }

        //C: Check that input code matches one of the shipping codes provieded in addresses section
        var selectedAddressCode = $('#s-selectedShippingAddress').val().trim();
        if( signUpType === 'incompleteRegistered' && !addressCodeHasAddress[ selectedAddressCode ] ) {
            console.log( 'code does not match any of your address codes' );
            $( '#s-selectedShippingAddressError' ).text( 'Please enter a code that matches one of address codes entered above' );
            $( '#s-selectedShippingAddressError' ).show();
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

    function removeAllErrors(){
        var allErrorElements = ['#s-emailError', '#s-dobError', '#s-addressOneError', '#s-addressTwoError', '#s-addressThreeError', '#s-addressFourError', 
            '#s-addressOneCodeError', '#s-addressTwoCodeError', '#s-addressThreeCodeError', '#s-addressFourCodeError', '#s-selectedShippingAddress'];
        allErrorElements.forEach(function(element){
            $(element).hide();
            $(element).closest('.form-group').removeClass('has-error');
        });
    }

})(jQuery);
