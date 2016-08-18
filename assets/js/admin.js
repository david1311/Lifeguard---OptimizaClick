;(function ($) {
	lifeguard_Admin = {
		init: function(e) {
			// Validate license form
			this.License.validate();
		},
		License : {
			validate: function (e) {
                $('#license-form').validate({
                    rules: {
                        serial_key: {  // <-- name of actual text input
                            required: true
                        }
                    },
                    submitHandler: function (form) {
                        lifeguard_Admin.License.activate.call(form);

                        return false;
                    }
                });
            },
			activate: function(e) {
				var that = $(this),
                    data = that.serialize() + '&_wpnonce=' + lifeguard_Vars.nonce,
                    action = $( 'input[name=action]' ).val(),
                    buttonActiveLabel = action == 'lifeguard_activate' ? 'Activating...' : 'Deactivating...';

                $( '#lifeguard-activate' ).after( '<div class="lifeguard-loading">'+ buttonActiveLabel +'</div>' );
                $( '#lifeguard-activate' ).addClass( 'lifeguard-button-active' ).val( buttonActiveLabel ).prop( 'disabled', true ).css({ 'cursor': 'default' });
                $( '.checked, .failed' ).remove();
                $.post(lifeguard_Vars.ajaxurl, data, function(res) {
                    res = $.parseJSON(res);

                    if( res.success ) {
                        if ( action == 'lifeguard_activate' ) {
                            $( '#lifeguard-activate' ).val( 'Deactivate' );
                            $( 'input[name=action]' ).val( 'lifeguard_deactivate' );
                            $( '#serial-key' ).prop( 'readonly', true ).addClass( 'serial-key-disabled' );
                            $( '#serial-key' ).after( '<span class="checked">Checked</span>' );
                        } else {
                            $( '#lifeguard-activate' ).val( 'Activate' );
                            $( 'input[name=action]' ).val( 'lifeguard_activate' );
                            $( '#serial-key' ).prop( 'readonly', false ).removeClass( 'serial-key-disabled' );
                        }
                    } else {
                        console.log(res.message);

                        $( '#serial-key' ).after( '<span class="failed">Failed</span>' );

                        if ( action == 'lifeguard_activate' ) {
                            $( '#lifeguard-activate' ).val( 'Activate' );
                            $( 'input[name=action]' ).val( 'lifeguard_activate' );
                        } else {
                            $( '#lifeguard-activate' ).val( 'Deactivate' );
                            $( 'input[name=action]' ).val( 'lifeguard_deactivate' );
                        }
                    }

                    $( '#lifeguard-activate' ).removeClass( 'lifeguard-button-active' ).prop( 'disabled', false ).css({ 'cursor': 'pointer' });
                    $('.lifeguard-loading').remove();
                });

                return false;
			}
		}
	}

    //dom ready
    $(function() {
    	lifeguard_Admin.init();
    });

})(jQuery);