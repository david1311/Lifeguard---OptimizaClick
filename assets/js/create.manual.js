;(function ($) {
 	// Manual
	tutopti_Create_Manual = {
		init: function (e) {
			// Donnot fetch overlay if not in manual mode
            if ( $.cookie('tutopti-manual') != 1 ) return;

			var data = {
				action: 'tutopti_overlay_manual',
				'_wpnonce': tutopti_Vars.nonce
			}

			// Fetch overlay
			$.post( tutopti_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

				if( res.success ) {
                	tutopti_Vars.ovarlayManual = res.html;
                	// Donnot allow add on our own page
                	if ( tutopti_Vars.screen_id == 'edit-tutopti_pointer' ) return;

                	// Show splash
					if ( tutopti_Vars.splash_dismissed != 1 )
						tutopti_Create_Manual.splash();
					else 
						Mousetrap.bind( 'ctrl+alt+n', tutopti_Create_Manual.open ); 

				} else {
                	console.log(res.error);
                }
			});
		},

		open: function (e) {
			// Donnot append when overlay is still in view
			if ( $('.tutopti-overlay').length ) return;

			// Attach overlay to the DOM
			$('body').append( tutopti_Vars.ovarlayManual );

			// If there are pointers already added, set order to the next number
			if ( $( '.tutopti-status-overlay' ).length )
				$('.tutopti-overlay-form #tutopti-order option[value='+ ( $( '.tutopti-status-overlay' ).length + 1 ) +']').attr('selected', 'selected');

			tutopti_Create_Manual.positionOverlay();

			// Attach submit event
			$('.tutopti-overlay').on('submit', '.tutopti-overlay-form', tutopti_Create_Manual.add);
			// Bind event to close
            $( '.tutopti-overlay' ).on( 'click', '.tutopti-close', tutopti_Create_Manual.close );
		},

		add: function (e) {
			e.preventDefault();

			// Bail out if not all fields are filled
			if ( !tutopti_Create_Manual.isFormFilled( $(this) ) )
				return;

			// Donnot allow removal of overlay for now
			tutopti_Vars.allowClose = false;

			// Inject hidden input for screen ID into our form
			$('.tutopti-overlay-form').prepend('<input type="hidden" name="screen" value="'+ tutopti_Vars.screen_id +'" />');  

			// Inject hidden input for page name into our form
			$('.tutopti-overlay-form').prepend('<input type="hidden" name="page" value="'+ tutopti_Vars.page +'" />'); 

			var that = $(this),
                data = that.serialize();

            $('.tutopti-overlay-form .footer .button-primary').before('<div class="tutopti-loading">Saving...</div>');
            $('.tutopti-overlay-form .footer .button-primary').addClass( 'tutopti-doing-ajax' );
            $('.tutopti-overlay-form .footer .button-primary').val('Saving...');
            $.post(tutopti_Vars.ajaxurl, data, function(res) {
            	res = $.parseJSON(res);

                if( res.success ) {
                	var height = $('.tutopti-overlay table').outerHeight(),
						width = $('.tutopti-overlay table').outerHeight();

                	$('.tutopti-overlay table').html('<p class="tutopti-notify">Custom pointer '+ tutopti_Vars.actionDone +'!</p>');
					$('.tutopti-overlay table').css({
						'width': width,
						'height': height
					});

					$('.tutopti-overlay .button-primary').remove();
					$('.tutopti-overlay .footer').html('<input type="button" class="button-primary" value="Okay" />');
					$('.tutopti-overlay .button-primary').on('click', function(){
						tutopti_Create_Manual.close();
					});
				} else {
                	console.log(res.error);
                }
            });
		},

		positionOverlay: function(e) {
			// Add dim effect
			$( '.tutopti-manual' ).before( '<div class="tutopti-dim" />' );
			// Append dim div
			if ( !$( '.tutopti-dim' ).length ) $( 'body' ).append( $( '.tutopti-dim' ) );
			
			$( '.tutopti-manual' ).css({
				'top': ( ( $( window ).height() - $( '.tutopti-manual' ).outerHeight() ) / 2 ) + 'px',
				'left': ( ( $( window ).width() - $( '.tutopti-manual' ).outerWidth() ) / 2 ) + 'px'
			});
		},

		isFormFilled: function (data) {
			var blank = 0;

			if ( $(data[0]).find('#tutopti-selector').val() == '' ) {
				$(data[0]).find('#tutopti-selector').css('border-color', 'red');
				++blank;
			}

			if ( $(data[0]).find('#tutopti-title').val() == '' ) {
				$(data[0]).find('#tutopti-title').css('border-color', 'red');
				++blank;
			}

			if ( $(data[0]).find('#tutopti-content').val() == '' ) {
				$(data[0]).find('#tutopti-content').css('border-color', 'red');
				++blank;
			}

			if ( blank )
				return false;

			return true;
		},

		close: function (e) {
			$('.tutopti-overlay, .tutopti-dim').remove();
		},

		splash: function (e) {
			var data = {
				action: 'tutopti_splash',
				'_wpnonce': tutopti_Vars.nonce
			}

			// Fetch overlay
			$.post( tutopti_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

				if( res.success ) {
                	// Show splash
                	$( 'body' ).append( res.html );
                	// Add dim effect
					$( '.tutopti-splash' ).before( '<div class="tutopti-dim" />' );
					// Append dim div
					if ( !$( '.tutopti-dim' ).length ) $( 'body' ).append( $( '.tutopti-dim' ) );
                	// Position splash
                	$( '.tutopti-splash' ).css({  
                		'top': ( ( $( window ).height() - $( '.tutopti-splash' ).outerHeight() ) / 2 ) + 'px',
						'left': ( ( $( window ).width() - $( '.tutopti-splash' ).outerWidth() ) / 2 ) + 'px'
                	});
                	// Bind close event
                	$( '.tutopti-splash' ).on( 'click', '.button-primary', function(){ 
                		$( '.tutopti-splash, .tutopti-dim' ).remove();
                		Mousetrap.bind( 'ctrl+alt+n', tutopti_Create_Manual.open );  
                	});
                	// Bind event to dissmiss
                	$( '.tutopti-splash' ).on( 'click', '#tutopti-dismiss-splash', tutopti_Create_Manual.dismissSplash );
				} else {
                	console.log(res.error);
                }
			});
		},

		dismissSplash: function (e) {
			var data = {
				action: 'tutopti_dismiss_splash',
				'_wpnonce': tutopti_Vars.nonce
			}

			// Dimiss splash
			$.post( tutopti_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

				if( res.success ) {
                	console.log( 'splash dismissed.' );
				} else {
                	console.log(res.error);
                }
			});
		}
	} 
})(jQuery);