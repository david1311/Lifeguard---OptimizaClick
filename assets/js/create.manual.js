;(function ($) {
 	// Manual
	lifeguard_Create_Manual = {
		init: function (e) {
			// Donnot fetch overlay if not in manual mode
            if ( $.cookie('lifeguard-manual') != 1 ) return;

			var data = {
				action: 'lifeguard_overlay_manual',
				'_wpnonce': lifeguard_Vars.nonce
			}

			// Fetch overlay
			$.post( lifeguard_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

				if( res.success ) {
                	lifeguard_Vars.ovarlayManual = res.html;
                	// Donnot allow add on our own page
                	if ( lifeguard_Vars.screen_id == 'edit-lifeguard_pointer' ) return;

                	// Show splash
					if ( lifeguard_Vars.splash_dismissed != 1 )
						lifeguard_Create_Manual.splash();
					else 
						Mousetrap.bind( 'ctrl+alt+n', lifeguard_Create_Manual.open ); 

				} else {
                	console.log(res.error);
                }
			});
		},

		open: function (e) {
			// Donnot append when overlay is still in view
			if ( $('.lifeguard-overlay').length ) return;

			// Attach overlay to the DOM
			$('body').append( lifeguard_Vars.ovarlayManual );

			// If there are pointers already added, set order to the next number
			if ( $( '.lifeguard-status-overlay' ).length )
				$('.lifeguard-overlay-form #lifeguard-order option[value='+ ( $( '.lifeguard-status-overlay' ).length + 1 ) +']').attr('selected', 'selected');

			lifeguard_Create_Manual.positionOverlay();

			// Attach submit event
			$('.lifeguard-overlay').on('submit', '.lifeguard-overlay-form', lifeguard_Create_Manual.add);
			// Bind event to close
            $( '.lifeguard-overlay' ).on( 'click', '.lifeguard-close', lifeguard_Create_Manual.close );
		},

		add: function (e) {
			e.preventDefault();

			// Bail out if not all fields are filled
			if ( !lifeguard_Create_Manual.isFormFilled( $(this) ) )
				return;

			// Donnot allow removal of overlay for now
			lifeguard_Vars.allowClose = false;

			// Inject hidden input for screen ID into our form
			$('.lifeguard-overlay-form').prepend('<input type="hidden" name="screen" value="'+ lifeguard_Vars.screen_id +'" />');  

			// Inject hidden input for page name into our form
			$('.lifeguard-overlay-form').prepend('<input type="hidden" name="page" value="'+ lifeguard_Vars.page +'" />'); 

			var that = $(this),
                data = that.serialize();

            $('.lifeguard-overlay-form .footer .button-primary').before('<div class="lifeguard-loading">Guardando...</div>');
            $('.lifeguard-overlay-form .footer .button-primary').addClass( 'lifeguard-doing-ajax' );
            $('.lifeguard-overlay-form .footer .button-primary').val('Guardando...');
            $.post(lifeguard_Vars.ajaxurl, data, function(res) {
            	res = $.parseJSON(res);

                if( res.success ) {
                	var height = $('.lifeguard-overlay table').outerHeight(),
						width = $('.lifeguard-overlay table').outerHeight();

                	$('.lifeguard-overlay table').html('<p class="lifeguard-notify">Custom pointer '+ lifeguard_Vars.actionDone +'!</p>');
					$('.lifeguard-overlay table').css({
						'width': width,
						'height': height
					});

					$('.lifeguard-overlay .button-primary').remove();
					$('.lifeguard-overlay .footer').html('<input type="button" class="button-primary" value="Listo" />');
					$('.lifeguard-overlay .button-primary').on('click', function(){
						lifeguard_Create_Manual.close();
					});
				} else {
                	console.log(res.error);
                }
            });
		},

		positionOverlay: function(e) {
			// Add dim effect
			$( '.lifeguard-manual' ).before( '<div class="lifeguard-dim" />' );
			// Append dim div
			if ( !$( '.lifeguard-dim' ).length ) $( 'body' ).append( $( '.lifeguard-dim' ) );
			
			$( '.lifeguard-manual' ).css({
				'top': ( ( $( window ).height() - $( '.lifeguard-manual' ).outerHeight() ) / 2 ) + 'px',
				'left': ( ( $( window ).width() - $( '.lifeguard-manual' ).outerWidth() ) / 2 ) + 'px'
			});
		},

		isFormFilled: function (data) {
			var blank = 0;

			if ( $(data[0]).find('#lifeguard-selector').val() == '' ) {
				$(data[0]).find('#lifeguard-selector').css('border-color', 'red');
				++blank;
			}

			if ( $(data[0]).find('#lifeguard-title').val() == '' ) {
				$(data[0]).find('#lifeguard-title').css('border-color', 'red');
				++blank;
			}

			if ( $(data[0]).find('#lifeguard-content').val() == '' ) {
				$(data[0]).find('#lifeguard-content').css('border-color', 'red');
				++blank;
			}

			if ( blank )
				return false;

			return true;
		},

		close: function (e) {
			$('.lifeguard-overlay, .lifeguard-dim').remove();
		},

		splash: function (e) {
			var data = {
				action: 'lifeguard_splash',
				'_wpnonce': lifeguard_Vars.nonce
			}

			// Fetch overlay
			$.post( lifeguard_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

				if( res.success ) {
                	// Show splash
                	$( 'body' ).append( res.html );
                	// Add dim effect
					$( '.lifeguard-splash' ).before( '<div class="lifeguard-dim" />' );
					// Append dim div
					if ( !$( '.lifeguard-dim' ).length ) $( 'body' ).append( $( '.lifeguard-dim' ) );
                	// Position splash
                	$( '.lifeguard-splash' ).css({  
                		'top': ( ( $( window ).height() - $( '.lifeguard-splash' ).outerHeight() ) / 2 ) + 'px',
						'left': ( ( $( window ).width() - $( '.lifeguard-splash' ).outerWidth() ) / 2 ) + 'px'
                	});
                	// Bind close event
                	$( '.lifeguard-splash' ).on( 'click', '.button-primary', function(){ 
                		$( '.lifeguard-splash, .lifeguard-dim' ).remove();
                		Mousetrap.bind( 'ctrl+alt+n', lifeguard_Create_Manual.open );  
                	});
                	// Bind event to dissmiss
                	$( '.lifeguard-splash' ).on( 'click', '#lifeguard-dismiss-splash', lifeguard_Create_Manual.dismissSplash );
				} else {
                	console.log(res.error);
                }
			});
		},

		dismissSplash: function (e) {
			var data = {
				action: 'lifeguard_dismiss_splash',
				'_wpnonce': lifeguard_Vars.nonce
			}

			// Dimiss splash
			$.post( lifeguard_Vars.ajaxurl, data, function(res) {
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