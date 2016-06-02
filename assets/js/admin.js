;(function ($) {

	tutopti_Admin = {
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
                        tutopti_Admin.License.activate.call(form);

                        return false;
                    }
                });
            },
			activate: function(e) {
				var that = $(this),
                    data = that.serialize() + '&_wpnonce=' + tutopti_Vars.nonce,
                    action = $( 'input[name=action]' ).val(),
                    buttonActiveLabel = action == 'tutopti_activate' ? 'Activating...' : 'Deactivating...';

                $( '#tutopti-activate' ).after( '<div class="tutopti-loading">'+ buttonActiveLabel +'</div>' );
                $( '#tutopti-activate' ).addClass( 'tutopti-button-active' ).val( buttonActiveLabel ).prop( 'disabled', true ).css({ 'cursor': 'default' });
                $( '.checked, .failed' ).remove();
                $.post(tutopti_Vars.ajaxurl, data, function(res) {
                    res = $.parseJSON(res);

                    if( res.success ) {
                        if ( action == 'tutopti_activate' ) {
                            $( '#tutopti-activate' ).val( 'Deactivate' );
                            $( 'input[name=action]' ).val( 'tutopti_deactivate' );
                            $( '#serial-key' ).prop( 'readonly', true ).addClass( 'serial-key-disabled' );
                            $( '#serial-key' ).after( '<span class="checked">Checked</span>' );
                        } else {
                            $( '#tutopti-activate' ).val( 'Activate' );
                            $( 'input[name=action]' ).val( 'tutopti_activate' );
                            $( '#serial-key' ).prop( 'readonly', false ).removeClass( 'serial-key-disabled' );
                        }
                    } else {
                        console.log(res.message);

                        $( '#serial-key' ).after( '<span class="failed">Failed</span>' );

                        if ( action == 'tutopti_activate' ) {
                            $( '#tutopti-activate' ).val( 'Activate' );
                            $( 'input[name=action]' ).val( 'tutopti_activate' );
                        } else {
                            $( '#tutopti-activate' ).val( 'Deactivate' );
                            $( 'input[name=action]' ).val( 'tutopti_deactivate' );
                        }
                    }

                    $( '#tutopti-activate' ).removeClass( 'tutopti-button-active' ).prop( 'disabled', false ).css({ 'cursor': 'pointer' });
                    $('.tutopti-loading').remove();
                });

                return false;
			}
		}
	}

    //dom ready
    $(function() {
    	tutopti_Admin.init();
    });

})(jQuery);