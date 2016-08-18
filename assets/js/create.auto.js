;(function ($) {
	// Auto
	lifeguard_Create_Auto = {
		init: function () {
			// Donnot fetch overlay if not in auto mode
            if ( $.cookie('lifeguard-auto') != 1 ) return;

			var data = {
				action: 'lifeguard_overlay_auto',
				'_wpnonce': lifeguard_Vars.nonce
			}

			// Fetch overlay
			$.post( lifeguard_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

				if( res.success ) {
                	lifeguard_Vars.ovarlayAuto = res.html;
                	// Donnot allow add on our own page
                	if ( lifeguard_Vars.screen_id == 'edit-lifeguard_pointer' ) return;
                	// Attach hover event to all elements in the DOM
					$(document).on('mouseover', lifeguard_Create_Auto.overlay);
				} else {
                	console.log(res.error);
                }
			});
		},

		
	
		
		overlay: function (e) {
			// Bail out if overlay can't be closed
			if ( !lifeguard_Vars.allowClose ) return;

			// Remove previous overlay
			lifeguard_Create_Auto.close(e);

			if ( e.target.id ) { // If hovered element has ID
				// Set target element
				var target = $( '#' + e.target.id );

				// Set Class/ID with the Class/ID of the element underneath the status overlay
				if ( $( e.target ).hasClass( lifeguard_Vars.statusOverlayClass ) )
					target = $( $( e.target ).data( lifeguard_Vars.statusOverlayDataAttr ) );

				// Only detect element that fits criteria
				if ( !lifeguard_Create_Auto.isValid( target ) )
					return;

				// Set lifeguard_Vars.elName
				if ( $( e.target ).hasClass( lifeguard_Vars.statusOverlayClass ) )
					lifeguard_Vars.elName = $( e.target ).data( lifeguard_Vars.statusOverlayDataAttr );
				else
					lifeguard_Vars.elName = '#' + e.target.id;

				// Append overlay
				lifeguard_Create_Auto.open();
        		$( '.lifeguard-overlay' ).css({
        			'width': target.outerWidth() + 'px',
        			'height': target.outerHeight() + 'px',
        			'left': target.offset().left - 4 + 'px',
        			'top': target.offset().top - 4 + 'px',
        		});

        		// Position overlay
        		lifeguard_Create_Auto.position( target );

        		return;

        	} else if ( $( '.' + $( e.target).attr( 'class' ) ).length == 1 ) { // If hovered element has no ID but with Class and only one element has that Class
        		// Set target element
        		var target = $( '.' + $( e.target ).attr( 'class' ) );

        		// Only detect element that fits criteria
				if ( !lifeguard_Create_Auto.isValid( target ) )
					return;

				// Set lifeguard_Vars.elName
				lifeguard_Vars.elName = '.' + target.attr( 'class' );
        		
        		// Append overlay
        		lifeguard_Create_Auto.open();

        		$( '.lifeguard-overlay' ).css({
        			'width': target.outerWidth() + 'px',
        			'height': target.outerHeight() + 'px',
        			'left': target.offset().left - 4 + 'px',
        			'top': target.offset().top - 4 + 'px',
        		});

        		// Position overlay
        		lifeguard_Create_Auto.position( target );

        		return;

        	} else { // If hovered element has no ID and Class

        		var selector = lifeguard_Create_Auto.formSelector( $( e.target ) ),
        			target = $( selector );

        		if ( !target.length ) return;

        		// Only detect element that fits criteria
				if ( !lifeguard_Create_Auto.isValid( target ) )
					return;

				// Set lifeguard_Vars.elName
				lifeguard_Vars.elName = selector;
        		
        		// Append overlay
        		lifeguard_Create_Auto.open();

        		$( '.lifeguard-overlay' ).css({
        			'width': target.outerWidth() + 'px',
        			'height': target.outerHeight() + 'px',
        			'left': target.offset().left - 4 + 'px',
        			'top': target.offset().top - 4 + 'px',
        		});

        		// Position overlay
        		lifeguard_Create_Auto.position( target );

        		return;
        	} 
		},

		open: function () {
			// Attach overlay to the DOM
			$('body').append( lifeguard_Vars.ovarlayAuto );

			// If user started typing, don't allow close
			$('.lifeguard-overlay').on( 'click', function(e){
				// Donnot set to false when the element being clicked the the close button itself
				if ( $( e.target ).attr( 'class' ) != 'lifeguard-close' )
					lifeguard_Vars.allowClose = false;
			});

			// Inject lifeguard_Vars.elName in the header of the overlay
			$('.lifeguard-overlay .lifeguard-el-name').empty().html( lifeguard_Vars.elName );

			// Check if target has a pointer already
			var pointer = lifeguard_Create_Auto.hasPointer();

			// Modify form so it'll update instead of add
			if ( pointer ) {
				// Inject hidden input for post ID into our form
				$('.lifeguard-overlay-form').prepend('<input type="hidden" name="post_id" value="'+ pointer.post_id +'" />');

				// Populate title
				$('.lifeguard-overlay-form #lifeguard-title').val( pointer.post_title );

				// Populate content
				$('.lifeguard-overlay-form #lifeguard-content').val( pointer.post_content );

				// Set edge
				$('.lifeguard-overlay-form #lifeguard-edge option[value='+ pointer.edge +']').attr('selected', 'selected');

				// Set align
				$('.lifeguard-overlay-form #lifeguard-align option[value='+ pointer.align +']').attr('selected', 'selected');

				// Set collection
				$('.lifeguard-overlay-form #lifeguard-collection option[value='+ pointer.collection +']').attr('selected', 'selected');

				// Set order
				$('.lifeguard-overlay-form #lifeguard-order option[value='+ pointer.order +']').attr('selected', 'selected');

				if ( lifeguard_Vars.active == 'yes' )
					$('.lifeguard-overlay-form .footer').prepend( '<a class="lifeguard-delete" data-id="'+ pointer.post_id +'" href="#">Borrar</a>' ); // Inject delete link 

				// Change button text to Update				
				$('.lifeguard-overlay-form .button-primary').val( 'Actualizar' ); 

				// Modify action done
				lifeguard_Vars.actionDone = 'actualizado';

				// Change action to lifeguard_update_pointer
				$('.lifeguard-overlay-form #action').val( 'lifeguard_update_pointer' ); 

				if ( lifeguard_Vars.active == 'yes' )
					$('.lifeguard-overlay-form').on('click', '.lifeguard-delete', lifeguard_Create_Auto.delete); // Bind delete event to our delete anchor

				// Disable Align values based the selected Edge value
				if ( $( '#lifeguard-edge' ).val() == 'left' || $( '#lifeguard-edge' ).val() == 'right' ) {
                    $( '#lifeguard-align' ).children( 'option:disabled' ).prop( 'disabled', false );
                    $( '#lifeguard-align' ).children( 'option[value=left], option[value=right]' ).prop( 'disabled', 'disabled' );
                } else {
                    $( '#lifeguard-align' ).children( 'option:disabled' ).prop( 'disabled', false );
                    $( '#lifeguard-align' ).children( 'option[value=top], option[value=bottom]' ).prop( 'disabled', 'disabled' );
                }
			} else {
				// Set order to next number
				$('.lifeguard-overlay-form #lifeguard-order option[value='+ ( $( '.lifeguard-status-overlay' ).length + 1 ) +']').attr('selected', 'selected');
				// Set collection to last used collection
				if ( lifeguard_Vars.pointers_raw )
					$('.lifeguard-overlay-form #lifeguard-collection option[value='+ lifeguard_Vars.pointers_raw[lifeguard_Vars.pointers_raw.length - 1]['collection'] +']').attr('selected', 'selected');
			}

			// Always append newly added collection to the dropdown
			if ( lifeguard_Vars.newCollection.id ) {
            	$( '#lifeguard-collection' ).append( '<option value="'+ lifeguard_Vars.newCollection.id +' " selected>'+ lifeguard_Vars.newCollection.name +'</option>' );
			}

			// Attach submit event
			$('.lifeguard-overlay').on('submit', '.lifeguard-overlay-form', lifeguard_Create_Auto.add);
			// Bind event to close
            $( '.lifeguard-overlay' ).on( 'click', '.lifeguard-close', lifeguard_Create_Auto.close );
		},

		close: function (e) {
			// Donnot close overlay if element being hovered is the overlay itself
			if ( $(e.target).attr('class') == 'lifeguard-overlay' || $(e.target).parents('.lifeguard-overlay').length && e.type == 'mouseover' )
				return;

			// Allow closing of overlay. Closing by clicking [x] sets this to false which will cause auto mode to stop working.
			lifeguard_Vars.allowClose = true;


			if ( $('.lifeguard-overlay').length && e.target.id != 'wpadminbar') // e.target.id != 'wpadminbar' is needed due to browser bug
				$('.lifeguard-overlay').remove();
		},

		add: function (e) {
			e.preventDefault();

			// Bail out if not all fields are filled
			if ( !lifeguard_Create_Auto.isFormFilled( $(this) ) )
				return;

			// Donnot allow removal of overlay for now
			lifeguard_Vars.allowClose = false;

			// Inject hidden input for screen ID into our form
			$('.lifeguard-overlay-form').prepend('<input type="hidden" name="screen" value="'+ lifeguard_Vars.screen_id +'" />'); 

			// Inject hidden input for page name into our form
			$('.lifeguard-overlay-form').prepend('<input type="hidden" name="page" value="'+ lifeguard_Vars.page +'" />'); 

			// Inject hidden input for target element into our form
			$('.lifeguard-overlay-form').prepend('<input type="hidden" name="target" value="'+ lifeguard_Vars.elName +'" />'); 

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

                	$('.lifeguard-overlay table').html('<p class="lifeguard-notify">Marca '+ lifeguard_Vars.actionDone +'!</p>');
					$('.lifeguard-overlay table').css({
						'width': width,
						'height': height
					});

					$('.lifeguard-overlay .button-primary').remove();
					$('.lifeguard-overlay .footer').html('<input type="button" class="button-primary" value="Listo" />');
					$('.lifeguard-overlay .button-primary').on('click', function(){
						$('.lifeguard-overlay').remove();
						// Allow removal of overlay
						lifeguard_Vars.allowClose = true;
					});
				} else {
                	console.log(res.error);
                }
            });
		},

		delete: function (e) {
			if ( lifeguard_Vars.active != 'yes' ) return;

			// Donnot allow removal of overlay for now
			lifeguard_Vars.allowClose = false;
			
			lifeguard_Vars.actionDone = 'deleted',
				data = {
						post_id: $(this).data('id'),
						action: 'lifeguard_delete_pointer',
						'_wpnonce': lifeguard_Vars.nonce
					};

			$('.lifeguard-overlay-form .footer .button-primary').before('<div class="lifeguard-loading deleting">Borrando...</div>');
			$('.lifeguard-overlay-form .footer .lifeguard-delete').text( 'Borrando...' ).css( { 'text-decoration': 'none', 'color': '#6B6B6B' } );
			$.post( lifeguard_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

				if( res.success ) {
                	var height = $('.lifeguard-overlay table').outerHeight(),
						width = $('.lifeguard-overlay table').outerHeight();

                	$('.lifeguard-overlay table').html('<p class="lifeguard-notify">Marca '+ lifeguard_Vars.actionDone +'!</p>');
					$('.lifeguard-overlay table').css({
						'width': width,
						'height': height
					});

					$('.lifeguard-overlay .button-primary').remove();
					$('.lifeguard-overlay .footer').html('<input type="button" class="button-primary" value="Listo" />');
					$('.lifeguard-overlay .button-primary').on('click', function(){
						$('.lifeguard-overlay').remove();
						// Allow removal of overlay
						lifeguard_Vars.allowClose = true;
					});
				} else {
                	console.log(res.error);
                }
			});
		},

		isFormFilled: function (data) {
			var blank = 0;

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

		isValid: function (el) {
			if ( ( el.children().length && $.inArray( el.prop( 'tagName' ).toLowerCase(), lifeguard_Create_Auto.exceptions() ) === -1 ) || el.attr('id') == 'wp-admin-bar-lifeguard-parent' ||  
				el.parents('#wp-admin-bar-lifeguard-parent').length || el.attr('class') == 'lifeguard-overlay' || el.parents('.lifeguard-overlay').length ) { 
				
				return false;
			} else
				return true;
		},

		hasPointer: function () {
			if ( !lifeguard_Vars.pointers_raw ) return false;

			for ( var i = 0; i < lifeguard_Vars.pointers_raw.length; i++ ) {
	    		if ( lifeguard_Vars.pointers_raw[i]['target'] == lifeguard_Vars.elName && lifeguard_Vars.pointers_raw[i]['screen_id'] == lifeguard_Vars.screen_id ) {
	    			var pointer = { 
	    				post_id: lifeguard_Vars.pointers_raw[i]['post_id'], 
	    				post_title: lifeguard_Vars.pointers_raw[i]['post_title'],
	    				post_content: lifeguard_Vars.pointers_raw[i]['post_content'],
	    				edge: lifeguard_Vars.pointers_raw[i]['edge'],
	    				align: lifeguard_Vars.pointers_raw[i]['align'],
	    				collection: lifeguard_Vars.pointers_raw[i]['collection'],
	    				order: lifeguard_Vars.pointers_raw[i]['order']
	    			};

	    			return pointer;
	    		}
	    	}

	    	return false;
		},

		formSelector: function(el, append) {

			var selector = '';

			if ( !el.siblings( el.prop( 'tagName' ).toLowerCase() ).length ) { // If this element has no siblings of the same tagname
				if ( el.parent().attr( 'id' ) || $( '.' + el.parent().attr( 'class' ) ).length == 1 ) { // If direct parent has ID or Class and nothing else is assigned with that class, use it as the end parent
					if ( el.parent().attr( 'id' ) )
						selector = '#' + el.parent().attr( 'id' ) + ' ' + el.prop( 'tagName' ).toLowerCase();
					else
						selector = '.' + el.parent().attr( 'class' ) + ' ' + el.prop( 'tagName' ).toLowerCase();

					return $.trim( append ? selector + ' ' + append : selector );
				} else {
					selector = el.prop( 'tagName' ).toLowerCase();

					return lifeguard_Create_Auto.formSelector( el.parent(), $.trim( append ? selector + ' ' + append : selector ) );
				}
				
			} else if ( el.siblings( el.prop( 'tagName' ).toLowerCase() ).length &&  el.siblings( el.prop( 'tagName' ).toLowerCase() ).length == el.siblings().length ) { // If this element has siblings of the same tagname, possible list-like markup
				if ( el.parent().attr( 'id' ) || $( '.' + el.parent().attr( 'class' ) ).length == 1 ) { // If direct parent has ID or Class and nothing else is assigned with that class, use it as the end parent
					var nth = el.parent().children( el.prop( 'tagName' ).toLowerCase() ).index( el ) + 1;

					if ( el.parent().attr( 'id' ) )
						selector = '#' + el.parent().attr( 'id' ) + ' ' + el.prop( 'tagName' ).toLowerCase() + ':nth-child('+ nth +')';
					else
						selector = '.' + el.parent().attr( 'class' ) + ' ' + el.prop( 'tagName' ).toLowerCase() + ':nth-child('+ nth +')';

					return $.trim( append ? selector + ' ' + append : selector );
				} else {
					var nth = el.parent().children( el.prop( 'tagName' ).toLowerCase() ).index( el ) + 1;
					selector = el.prop( 'tagName' ).toLowerCase() + ':nth-child('+ nth +')';

					return lifeguard_Create_Auto.formSelector( el.parent(), $.trim( append ? selector + ' ' + append : selector ) );
				}
			}
		},

		position: function (el) {
			// Right
			if ( ($(window).width() - (el.outerWidth() + el.offset().left)) <  $( '.lifeguard-overlay-wrap' ).outerWidth() ) {
				$( '.lifeguard-overlay-wrap' ).removeClass( 'lifeguard-overlay-wrap-left' ).addClass( 'lifeguard-overlay-wrap-right' );
			}

			// Top
			if ( el.offset().top <  5 ) {
				$( '.lifeguard-overlay-wrap' ).removeClass().addClass( 'lifeguard-overlay-wrap lifeguard-overlay-wrap-top' );
				$( '.lifeguard-overlay-wrap' ).css({
					'top': el.outerHeight() + 'px',
					'left': - ( ( $('.lifeguard-overlay-wrap-top').outerWidth() - el.outerWidth() ) / 2 ) + 'px'
				});
				$('.lifeguard-overlay-wrap span.arrow').css({
					'left': ( ( $( '.lifeguard-overlay-wrap' ).outerWidth() - $('.lifeguard-overlay-wrap span.arrow').outerWidth() ) / 2 ) + 'px'
				});
			}

			// Top Left Corner
			if ( el.offset().top <  5 && ( el.offset().left <  ( $( '.lifeguard-overlay-wrap' ).outerWidth() - el.outerWidth() ) / 2 ) ) {
				$( '.lifeguard-overlay-wrap' ).removeClass().addClass( 'lifeguard-overlay-wrap lifeguard-overlay-wrap-top-left' );
				$( '.lifeguard-overlay-wrap' ).css({
					'left': - el.offset().left + 10 + 'px'
				});
				$('.lifeguard-overlay-wrap span.arrow').css({
					'left': ( ( el.offset().left + ( el.outerWidth() / 2 ) ) - ( $('.lifeguard-overlay-wrap span.arrow').outerWidth() ) ) + 'px'
				});
			}

			// Top Right Corner
			if ( el.offset().top <  5 && ( ($(window).width() - (el.outerWidth() + el.offset().left)) <  ( ( $( '.lifeguard-overlay-wrap' ).outerWidth() - el.outerWidth() ) / 2 ) ) ) {
				$( '.lifeguard-overlay-wrap' ).removeClass().addClass( 'lifeguard-overlay-wrap lifeguard-overlay-wrap-top-right' );
				$('.lifeguard-overlay-wrap').css({
					'left': - ( $('.lifeguard-overlay-wrap').outerWidth() - ( el.outerWidth() - 10 ) ) + 'px'
				});
				$('.lifeguard-overlay-wrap span.arrow').css({
					'left': ( el.offset().left - $('.lifeguard-overlay-wrap').offset().left ) + ( el.outerWidth() / 2 ) + 'px'
				});
			}

			// Bottom
			if ( $(window).height() - (el.offset().top + el.outerHeight()) < $( '.lifeguard-overlay-wrap' ).outerHeight() && el.offset().top > $( '.lifeguard-overlay-wrap' ).outerHeight() - el.outerHeight() ) {
				$( '.lifeguard-overlay-wrap' ).removeClass().addClass( 'lifeguard-overlay-wrap lifeguard-overlay-wrap-not-fit-left-and-right-bottom' );

				$( '.lifeguard-overlay-wrap' ).css({
					'top': - ( $( '.lifeguard-overlay-wrap' ).outerHeight() ) + 'px',
					'left': ( el.outerWidth() - $( '.lifeguard-overlay-wrap' ).outerWidth() ) / 2 + 'px'
				});
				$('.lifeguard-overlay-wrap span.arrow').css({
					'top': $( '.lifeguard-overlay-wrap' ).outerHeight() - 16 + 'px',
					'left': ( ( $( '.lifeguard-overlay-wrap' ).outerWidth() - $('.lifeguard-overlay-wrap span.arrow').outerWidth() ) / 2 ) + 'px'
				});
			}
			
			// Bottom Left
			if ( $(window).height() - (el.offset().top + el.outerHeight()) < $( '.lifeguard-overlay-wrap' ).outerHeight() && el.offset().left <  $( '.lifeguard-overlay-wrap' ).outerWidth() ) {
				$( '.lifeguard-overlay-wrap' ).removeClass().addClass( 'lifeguard-overlay-wrap lifeguard-overlay-wrap-bottom-left' );

				$( '.lifeguard-overlay-wrap' ).css({
					'left': 'auto',
					'top': - ( $( '.lifeguard-overlay-wrap' ).outerHeight() - el.outerHeight() - 8 ) + 'px'
				});
				$('.lifeguard-overlay-wrap span.arrow').css({
					'top': $( '.lifeguard-overlay-wrap' ).outerHeight() - 20 + 'px',
					'left': '7px'
				});

				// If it overflows to the top
				if ( el.offset().top < $( '.lifeguard-overlay-wrap' ).outerHeight() - el.outerHeight() - 8 ) {
					$( '.lifeguard-overlay-wrap' ).css({
						'top': - ( Math.abs( $( '.lifeguard-overlay-wrap' ).css('top').replace( /[^-\d\.]/g, '' ) ) - ( $( '.lifeguard-overlay-wrap' ).outerHeight() - ( el.outerHeight() + 8 ) - el.offset().top ) ) + 10 + 'px'
					});
					$('.lifeguard-overlay-wrap span.arrow').css({
						'top': ( el.offset().top - $('.lifeguard-overlay-wrap').offset().top ) + ( ( el.outerHeight() / 2 ) - ( $('.lifeguard-overlay-wrap span.arrow').outerHeight() / 2 ) ) + 'px'
					});
				}
			}	
			
			// Bottom Right
			if ( $(window).height() - (el.offset().top + el.outerHeight()) < $( '.lifeguard-overlay-wrap' ).outerHeight() && ($(window).width() - (el.outerWidth() + el.offset().left)) <  $( '.lifeguard-overlay-wrap' ).outerWidth() ) {
				$( '.lifeguard-overlay-wrap' ).removeClass().addClass( 'lifeguard-overlay-wrap lifeguard-overlay-wrap-bottom-right' );

				$( '.lifeguard-overlay-wrap' ).css({
					'left': '-364px',
					'top': - ( $( '.lifeguard-overlay-wrap' ).outerHeight() - el.outerHeight() - 8 ) + 'px'
				});
				$('.lifeguard-overlay-wrap span.arrow').css({
					'top': $( '.lifeguard-overlay-wrap' ).outerHeight() - 20 + 'px',
					'left': 'auto',
					'right': '6px'
				});

				// If it overflows to the top
				if ( el.offset().top < $( '.lifeguard-overlay-wrap' ).outerHeight() - el.outerHeight() - 8 ) {
					$( '.lifeguard-overlay-wrap' ).css({
						'top': - ( Math.abs( $( '.lifeguard-overlay-wrap' ).css('top').replace( /[^-\d\.]/g, '' ) ) - ( $( '.lifeguard-overlay-wrap' ).outerHeight() - ( el.outerHeight() + 8 ) - el.offset().top ) ) + 10 + 'px'
					});
					$('.lifeguard-overlay-wrap span.arrow').css({
						'top': ( el.offset().top - $('.lifeguard-overlay-wrap').offset().top ) + ( ( el.outerHeight() / 2 ) - ( $('.lifeguard-overlay-wrap span.arrow').outerHeight() / 2 ) ) + 'px'
					});
				}
			}

			// Bottom Left Corner
			// Bottom Right Corner

			// If the target element is too large for the overlay fit in either left and right sides, position it below or to the top
			if ( el.offset().left <  $( '.lifeguard-overlay-wrap' ).outerWidth() && ($(window).width() - (el.outerWidth() + el.offset().left)) <  $( '.lifeguard-overlay-wrap' ).outerWidth() ) {
				
				if ( el.offset().top <  $( '.lifeguard-overlay-wrap' ).outerHeight() ) { // If no space at the top
					$( '.lifeguard-overlay-wrap' ).removeClass().addClass( 'lifeguard-overlay-wrap lifeguard-overlay-wrap-not-fit-left-and-right-top' );

					$( '.lifeguard-overlay-wrap' ).css({
						'top': el.outerHeight() + 'px',
						'left': ( el.outerWidth() - $( '.lifeguard-overlay-wrap' ).outerWidth() ) / 2 + 'px'
					});
					$('.lifeguard-overlay-wrap span.arrow').css({
						'left': ( ( $( '.lifeguard-overlay-wrap' ).outerWidth() - $('.lifeguard-overlay-wrap span.arrow').outerWidth() ) / 2 ) + 'px'
					});
				} else if ( ($(window).height() - (el.outerHeight() + el.offset().top)) <  $( '.lifeguard-overlay-wrap' ).outerHeight() ) { // If no space at the bottom
					$( '.lifeguard-overlay-wrap' ).removeClass().addClass( 'lifeguard-overlay-wrap lifeguard-overlay-wrap-not-fit-left-and-right-bottom' );

					$( '.lifeguard-overlay-wrap' ).css({
						'top': - ( $( '.lifeguard-overlay-wrap' ).outerHeight() ) + 'px',
						'left': ( el.outerWidth() - $( '.lifeguard-overlay-wrap' ).outerWidth() ) / 2 + 'px'
					});
					$('.lifeguard-overlay-wrap span.arrow').css({
						'top': $( '.lifeguard-overlay-wrap' ).outerHeight() - 16 + 'px',
						'left': ( ( $( '.lifeguard-overlay-wrap' ).outerWidth() - $('.lifeguard-overlay-wrap span.arrow').outerWidth() ) / 2 ) + 'px'
					});
				}
			}

			// If the target element is too large for the overlay to fit in any side, center it 
			if ( el.offset().left <  $( '.lifeguard-overlay-wrap' ).outerWidth() && ($(window).width() - (el.outerWidth() + el.offset().left)) <  $( '.lifeguard-overlay-wrap' ).outerWidth() && 
				 el.offset().top <  $( '.lifeguard-overlay-wrap' ).outerHeight() && ($(window).height() - (el.outerHeight() + el.offset().top)) <  $( '.lifeguard-overlay-wrap' ).outerHeight() ) {
				$( '.lifeguard-overlay-wrap' ).removeClass().addClass( 'lifeguard-overlay-wrap lifeguard-overlay-wrap-not-fit-any-side' );

				if ( el.outerHeight() ) { // If element's height is greater than the overlay
					$( '.lifeguard-overlay-wrap' ).css({
						'top': ( el.outerHeight() - $( '.lifeguard-overlay-wrap' ).outerHeight() ) / 2 + 'px',
						'left': ( el.outerWidth() - $( '.lifeguard-overlay-wrap' ).outerWidth() ) / 2 + 'px'
					});
				} else {
					$( '.lifeguard-overlay-wrap' ).css({
						'top': - (( $( '.lifeguard-overlay-wrap' ).outerHeight() - el.outerHeight() ) / 2) + 'px',
						'left': ( el.outerWidth() - $( '.lifeguard-overlay-wrap' ).outerWidth() ) / 2 + 'px'
					});
				}
			}

			return;
		},

		exceptions: function () {
			// Arrray els stores all elements that are excluded from target elements that should not be detected because they have children
			var els = [ 'select', 'a' ]; // Add some more exceptions in the future

			return els;
		}

	}
})(jQuery);