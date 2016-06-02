;(function ($) {
	// Auto
	tutopti_Create_Auto = {
		init: function () {
			// Donnot fetch overlay if not in auto mode
            if ( $.cookie('tutopti-auto') != 1 ) return;

			var data = {
				action: 'tutopti_overlay_auto',
				'_wpnonce': tutopti_Vars.nonce
			}

			// Fetch overlay
			$.post( tutopti_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

				if( res.success ) {
                	tutopti_Vars.ovarlayAuto = res.html;
                	// Donnot allow add on our own page
                	if ( tutopti_Vars.screen_id == 'edit-tutopti_pointer' ) return;
                	// Attach hover event to all elements in the DOM
					$(document).on('mouseover', tutopti_Create_Auto.overlay);
				} else {
                	console.log(res.error);
                }
			});
		},

		overlay: function (e) {
			// Bail out if overlay can't be closed
			if ( !tutopti_Vars.allowClose ) return;

			// Remove previous overlay
			tutopti_Create_Auto.close(e);

			if ( e.target.id ) { // If hovered element has ID
				// Set target element
				var target = $( '#' + e.target.id );

				// Set Class/ID with the Class/ID of the element underneath the status overlay
				if ( $( e.target ).hasClass( tutopti_Vars.statusOverlayClass ) )
					target = $( $( e.target ).data( tutopti_Vars.statusOverlayDataAttr ) );

				// Only detect element that fits criteria
				if ( !tutopti_Create_Auto.isValid( target ) )
					return;

				// Set tutopti_Vars.elName
				if ( $( e.target ).hasClass( tutopti_Vars.statusOverlayClass ) )
					tutopti_Vars.elName = $( e.target ).data( tutopti_Vars.statusOverlayDataAttr );
				else
					tutopti_Vars.elName = '#' + e.target.id;

				// Append overlay
				tutopti_Create_Auto.open();
        		$( '.tutopti-overlay' ).css({
        			'width': target.outerWidth() + 'px',
        			'height': target.outerHeight() + 'px',
        			'left': target.offset().left - 4 + 'px',
        			'top': target.offset().top - 4 + 'px',
        		});

        		// Position overlay
        		tutopti_Create_Auto.position( target );

        		return;

        	} else if ( $( '.' + $( e.target).attr( 'class' ) ).length == 1 ) { // If hovered element has no ID but with Class and only one element has that Class
        		// Set target element
        		var target = $( '.' + $( e.target ).attr( 'class' ) );

        		// Only detect element that fits criteria
				if ( !tutopti_Create_Auto.isValid( target ) )
					return;

				// Set tutopti_Vars.elName
				tutopti_Vars.elName = '.' + target.attr( 'class' );
        		
        		// Append overlay
        		tutopti_Create_Auto.open();

        		$( '.tutopti-overlay' ).css({
        			'width': target.outerWidth() + 'px',
        			'height': target.outerHeight() + 'px',
        			'left': target.offset().left - 4 + 'px',
        			'top': target.offset().top - 4 + 'px',
        		});

        		// Position overlay
        		tutopti_Create_Auto.position( target );

        		return;

        	} else { // If hovered element has no ID and Class

        		var selector = tutopti_Create_Auto.formSelector( $( e.target ) ),
        			target = $( selector );

        		if ( !target.length ) return;

        		// Only detect element that fits criteria
				if ( !tutopti_Create_Auto.isValid( target ) )
					return;

				// Set tutopti_Vars.elName
				tutopti_Vars.elName = selector;
        		
        		// Append overlay
        		tutopti_Create_Auto.open();

        		$( '.tutopti-overlay' ).css({
        			'width': target.outerWidth() + 'px',
        			'height': target.outerHeight() + 'px',
        			'left': target.offset().left - 4 + 'px',
        			'top': target.offset().top - 4 + 'px',
        		});

        		// Position overlay
        		tutopti_Create_Auto.position( target );

        		return;
        	} 
		},

		open: function () {
			// Attach overlay to the DOM
			$('body').append( tutopti_Vars.ovarlayAuto );

			// If user started typing, don't allow close
			$('.tutopti-overlay').on( 'click', function(e){
				// Donnot set to false when the element being clicked the the close button itself
				if ( $( e.target ).attr( 'class' ) != 'tutopti-close' )
					tutopti_Vars.allowClose = false;
			});

			// Inject tutopti_Vars.elName in the header of the overlay
			$('.tutopti-overlay .tutopti-el-name').empty().html( tutopti_Vars.elName );

			// Check if target has a pointer already
			var pointer = tutopti_Create_Auto.hasPointer();

			// Modify form so it'll update instead of add
			if ( pointer ) {
				// Inject hidden input for post ID into our form
				$('.tutopti-overlay-form').prepend('<input type="hidden" name="post_id" value="'+ pointer.post_id +'" />');

				// Populate title
				$('.tutopti-overlay-form #tutopti-title').val( pointer.post_title );

				// Populate content
				$('.tutopti-overlay-form #tutopti-content').val( pointer.post_content );

				// Set edge
				$('.tutopti-overlay-form #tutopti-edge option[value='+ pointer.edge +']').attr('selected', 'selected');

				// Set align
				$('.tutopti-overlay-form #tutopti-align option[value='+ pointer.align +']').attr('selected', 'selected');

				// Set collection
				$('.tutopti-overlay-form #tutopti-collection option[value='+ pointer.collection +']').attr('selected', 'selected');

				// Set order
				$('.tutopti-overlay-form #tutopti-order option[value='+ pointer.order +']').attr('selected', 'selected');

				if ( tutopti_Vars.active == 'yes' )
					$('.tutopti-overlay-form .footer').prepend( '<a class="tutopti-delete" data-id="'+ pointer.post_id +'" href="#">Delete</a>' ); // Inject delete link 

				// Change button text to Update				
				$('.tutopti-overlay-form .button-primary').val( 'Update' ); 

				// Modify action done
				tutopti_Vars.actionDone = 'updated';

				// Change action to tutopti_update_pointer
				$('.tutopti-overlay-form #action').val( 'tutopti_update_pointer' ); 

				if ( tutopti_Vars.active == 'yes' )
					$('.tutopti-overlay-form').on('click', '.tutopti-delete', tutopti_Create_Auto.delete); // Bind delete event to our delete anchor

				// Disable Align values based the selected Edge value
				if ( $( '#tutopti-edge' ).val() == 'left' || $( '#tutopti-edge' ).val() == 'right' ) {
                    $( '#tutopti-align' ).children( 'option:disabled' ).prop( 'disabled', false );
                    $( '#tutopti-align' ).children( 'option[value=left], option[value=right]' ).prop( 'disabled', 'disabled' );
                } else {
                    $( '#tutopti-align' ).children( 'option:disabled' ).prop( 'disabled', false );
                    $( '#tutopti-align' ).children( 'option[value=top], option[value=bottom]' ).prop( 'disabled', 'disabled' );
                }
			} else {
				// Set order to next number
				$('.tutopti-overlay-form #tutopti-order option[value='+ ( $( '.tutopti-status-overlay' ).length + 1 ) +']').attr('selected', 'selected');
				// Set collection to last used collection
				if ( tutopti_Vars.pointers_raw )
					$('.tutopti-overlay-form #tutopti-collection option[value='+ tutopti_Vars.pointers_raw[tutopti_Vars.pointers_raw.length - 1]['collection'] +']').attr('selected', 'selected');
			}

			// Always append newly added collection to the dropdown
			if ( tutopti_Vars.newCollection.id ) {
            	$( '#tutopti-collection' ).append( '<option value="'+ tutopti_Vars.newCollection.id +' " selected>'+ tutopti_Vars.newCollection.name +'</option>' );
			}

			// Attach submit event
			$('.tutopti-overlay').on('submit', '.tutopti-overlay-form', tutopti_Create_Auto.add);
			// Bind event to close
            $( '.tutopti-overlay' ).on( 'click', '.tutopti-close', tutopti_Create_Auto.close );
		},

		close: function (e) {
			// Donnot close overlay if element being hovered is the overlay itself
			if ( $(e.target).attr('class') == 'tutopti-overlay' || $(e.target).parents('.tutopti-overlay').length && e.type == 'mouseover' )
				return;

			// Allow closing of overlay. Closing by clicking [x] sets this to false which will cause auto mode to stop working.
			tutopti_Vars.allowClose = true;


			if ( $('.tutopti-overlay').length && e.target.id != 'wpadminbar') // e.target.id != 'wpadminbar' is needed due to browser bug
				$('.tutopti-overlay').remove();
		},

		add: function (e) {
			e.preventDefault();

			// Bail out if not all fields are filled
			if ( !tutopti_Create_Auto.isFormFilled( $(this) ) )
				return;

			// Donnot allow removal of overlay for now
			tutopti_Vars.allowClose = false;

			// Inject hidden input for screen ID into our form
			$('.tutopti-overlay-form').prepend('<input type="hidden" name="screen" value="'+ tutopti_Vars.screen_id +'" />'); 

			// Inject hidden input for page name into our form
			$('.tutopti-overlay-form').prepend('<input type="hidden" name="page" value="'+ tutopti_Vars.page +'" />'); 

			// Inject hidden input for target element into our form
			$('.tutopti-overlay-form').prepend('<input type="hidden" name="target" value="'+ tutopti_Vars.elName +'" />'); 

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
						$('.tutopti-overlay').remove();
						// Allow removal of overlay
						tutopti_Vars.allowClose = true;
					});
				} else {
                	console.log(res.error);
                }
            });
		},

		delete: function (e) {
			if ( tutopti_Vars.active != 'yes' ) return;

			// Donnot allow removal of overlay for now
			tutopti_Vars.allowClose = false;
			
			tutopti_Vars.actionDone = 'deleted',
				data = {
						post_id: $(this).data('id'),
						action: 'tutopti_delete_pointer',
						'_wpnonce': tutopti_Vars.nonce
					};

			$('.tutopti-overlay-form .footer .button-primary').before('<div class="tutopti-loading deleting">Deleting...</div>');
			$('.tutopti-overlay-form .footer .tutopti-delete').text( 'Deleting...' ).css( { 'text-decoration': 'none', 'color': '#6B6B6B' } );
			$.post( tutopti_Vars.ajaxurl, data, function(res) {
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
						$('.tutopti-overlay').remove();
						// Allow removal of overlay
						tutopti_Vars.allowClose = true;
					});
				} else {
                	console.log(res.error);
                }
			});
		},

		isFormFilled: function (data) {
			var blank = 0;

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

		isValid: function (el) {
			if ( ( el.children().length && $.inArray( el.prop( 'tagName' ).toLowerCase(), tutopti_Create_Auto.exceptions() ) === -1 ) || el.attr('id') == 'wp-admin-bar-tutopti-parent' ||  
				el.parents('#wp-admin-bar-tutopti-parent').length || el.attr('class') == 'tutopti-overlay' || el.parents('.tutopti-overlay').length ) { 
				
				return false;
			} else
				return true;
		},

		hasPointer: function () {
			if ( !tutopti_Vars.pointers_raw ) return false;

			for ( var i = 0; i < tutopti_Vars.pointers_raw.length; i++ ) {
	    		if ( tutopti_Vars.pointers_raw[i]['target'] == tutopti_Vars.elName && tutopti_Vars.pointers_raw[i]['screen_id'] == tutopti_Vars.screen_id ) {
	    			var pointer = { 
	    				post_id: tutopti_Vars.pointers_raw[i]['post_id'], 
	    				post_title: tutopti_Vars.pointers_raw[i]['post_title'],
	    				post_content: tutopti_Vars.pointers_raw[i]['post_content'],
	    				edge: tutopti_Vars.pointers_raw[i]['edge'],
	    				align: tutopti_Vars.pointers_raw[i]['align'],
	    				collection: tutopti_Vars.pointers_raw[i]['collection'],
	    				order: tutopti_Vars.pointers_raw[i]['order']
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

					return tutopti_Create_Auto.formSelector( el.parent(), $.trim( append ? selector + ' ' + append : selector ) );
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

					return tutopti_Create_Auto.formSelector( el.parent(), $.trim( append ? selector + ' ' + append : selector ) );
				}
			}
		},

		position: function (el) {
			// Right
			if ( ($(window).width() - (el.outerWidth() + el.offset().left)) <  $( '.tutopti-overlay-wrap' ).outerWidth() ) {
				$( '.tutopti-overlay-wrap' ).removeClass( 'tutopti-overlay-wrap-left' ).addClass( 'tutopti-overlay-wrap-right' );
			}

			// Top
			if ( el.offset().top <  5 ) {
				$( '.tutopti-overlay-wrap' ).removeClass().addClass( 'tutopti-overlay-wrap tutopti-overlay-wrap-top' );
				$( '.tutopti-overlay-wrap' ).css({
					'top': el.outerHeight() + 'px',
					'left': - ( ( $('.tutopti-overlay-wrap-top').outerWidth() - el.outerWidth() ) / 2 ) + 'px'
				});
				$('.tutopti-overlay-wrap span.arrow').css({
					'left': ( ( $( '.tutopti-overlay-wrap' ).outerWidth() - $('.tutopti-overlay-wrap span.arrow').outerWidth() ) / 2 ) + 'px'
				});
			}

			// Top Left Corner
			if ( el.offset().top <  5 && ( el.offset().left <  ( $( '.tutopti-overlay-wrap' ).outerWidth() - el.outerWidth() ) / 2 ) ) {
				$( '.tutopti-overlay-wrap' ).removeClass().addClass( 'tutopti-overlay-wrap tutopti-overlay-wrap-top-left' );
				$( '.tutopti-overlay-wrap' ).css({
					'left': - el.offset().left + 10 + 'px'
				});
				$('.tutopti-overlay-wrap span.arrow').css({
					'left': ( ( el.offset().left + ( el.outerWidth() / 2 ) ) - ( $('.tutopti-overlay-wrap span.arrow').outerWidth() ) ) + 'px'
				});
			}

			// Top Right Corner
			if ( el.offset().top <  5 && ( ($(window).width() - (el.outerWidth() + el.offset().left)) <  ( ( $( '.tutopti-overlay-wrap' ).outerWidth() - el.outerWidth() ) / 2 ) ) ) {
				$( '.tutopti-overlay-wrap' ).removeClass().addClass( 'tutopti-overlay-wrap tutopti-overlay-wrap-top-right' );
				$('.tutopti-overlay-wrap').css({
					'left': - ( $('.tutopti-overlay-wrap').outerWidth() - ( el.outerWidth() - 10 ) ) + 'px'
				});
				$('.tutopti-overlay-wrap span.arrow').css({
					'left': ( el.offset().left - $('.tutopti-overlay-wrap').offset().left ) + ( el.outerWidth() / 2 ) + 'px'
				});
			}

			// Bottom
			if ( $(window).height() - (el.offset().top + el.outerHeight()) < $( '.tutopti-overlay-wrap' ).outerHeight() && el.offset().top > $( '.tutopti-overlay-wrap' ).outerHeight() - el.outerHeight() ) {
				$( '.tutopti-overlay-wrap' ).removeClass().addClass( 'tutopti-overlay-wrap tutopti-overlay-wrap-not-fit-left-and-right-bottom' );

				$( '.tutopti-overlay-wrap' ).css({
					'top': - ( $( '.tutopti-overlay-wrap' ).outerHeight() ) + 'px',
					'left': ( el.outerWidth() - $( '.tutopti-overlay-wrap' ).outerWidth() ) / 2 + 'px'
				});
				$('.tutopti-overlay-wrap span.arrow').css({
					'top': $( '.tutopti-overlay-wrap' ).outerHeight() - 16 + 'px',
					'left': ( ( $( '.tutopti-overlay-wrap' ).outerWidth() - $('.tutopti-overlay-wrap span.arrow').outerWidth() ) / 2 ) + 'px'
				});
			}
			
			// Bottom Left
			if ( $(window).height() - (el.offset().top + el.outerHeight()) < $( '.tutopti-overlay-wrap' ).outerHeight() && el.offset().left <  $( '.tutopti-overlay-wrap' ).outerWidth() ) {
				$( '.tutopti-overlay-wrap' ).removeClass().addClass( 'tutopti-overlay-wrap tutopti-overlay-wrap-bottom-left' );

				$( '.tutopti-overlay-wrap' ).css({
					'left': 'auto',
					'top': - ( $( '.tutopti-overlay-wrap' ).outerHeight() - el.outerHeight() - 8 ) + 'px'
				});
				$('.tutopti-overlay-wrap span.arrow').css({
					'top': $( '.tutopti-overlay-wrap' ).outerHeight() - 20 + 'px',
					'left': '7px'
				});

				// If it overflows to the top
				if ( el.offset().top < $( '.tutopti-overlay-wrap' ).outerHeight() - el.outerHeight() - 8 ) {
					$( '.tutopti-overlay-wrap' ).css({
						'top': - ( Math.abs( $( '.tutopti-overlay-wrap' ).css('top').replace( /[^-\d\.]/g, '' ) ) - ( $( '.tutopti-overlay-wrap' ).outerHeight() - ( el.outerHeight() + 8 ) - el.offset().top ) ) + 10 + 'px'
					});
					$('.tutopti-overlay-wrap span.arrow').css({
						'top': ( el.offset().top - $('.tutopti-overlay-wrap').offset().top ) + ( ( el.outerHeight() / 2 ) - ( $('.tutopti-overlay-wrap span.arrow').outerHeight() / 2 ) ) + 'px'
					});
				}
			}	
			
			// Bottom Right
			if ( $(window).height() - (el.offset().top + el.outerHeight()) < $( '.tutopti-overlay-wrap' ).outerHeight() && ($(window).width() - (el.outerWidth() + el.offset().left)) <  $( '.tutopti-overlay-wrap' ).outerWidth() ) {
				$( '.tutopti-overlay-wrap' ).removeClass().addClass( 'tutopti-overlay-wrap tutopti-overlay-wrap-bottom-right' );

				$( '.tutopti-overlay-wrap' ).css({
					'left': '-364px',
					'top': - ( $( '.tutopti-overlay-wrap' ).outerHeight() - el.outerHeight() - 8 ) + 'px'
				});
				$('.tutopti-overlay-wrap span.arrow').css({
					'top': $( '.tutopti-overlay-wrap' ).outerHeight() - 20 + 'px',
					'left': 'auto',
					'right': '6px'
				});

				// If it overflows to the top
				if ( el.offset().top < $( '.tutopti-overlay-wrap' ).outerHeight() - el.outerHeight() - 8 ) {
					$( '.tutopti-overlay-wrap' ).css({
						'top': - ( Math.abs( $( '.tutopti-overlay-wrap' ).css('top').replace( /[^-\d\.]/g, '' ) ) - ( $( '.tutopti-overlay-wrap' ).outerHeight() - ( el.outerHeight() + 8 ) - el.offset().top ) ) + 10 + 'px'
					});
					$('.tutopti-overlay-wrap span.arrow').css({
						'top': ( el.offset().top - $('.tutopti-overlay-wrap').offset().top ) + ( ( el.outerHeight() / 2 ) - ( $('.tutopti-overlay-wrap span.arrow').outerHeight() / 2 ) ) + 'px'
					});
				}
			}

			// Bottom Left Corner
			// Bottom Right Corner

			// If the target element is too large for the overlay fit in either left and right sides, position it below or to the top
			if ( el.offset().left <  $( '.tutopti-overlay-wrap' ).outerWidth() && ($(window).width() - (el.outerWidth() + el.offset().left)) <  $( '.tutopti-overlay-wrap' ).outerWidth() ) {
				
				if ( el.offset().top <  $( '.tutopti-overlay-wrap' ).outerHeight() ) { // If no space at the top
					$( '.tutopti-overlay-wrap' ).removeClass().addClass( 'tutopti-overlay-wrap tutopti-overlay-wrap-not-fit-left-and-right-top' );

					$( '.tutopti-overlay-wrap' ).css({
						'top': el.outerHeight() + 'px',
						'left': ( el.outerWidth() - $( '.tutopti-overlay-wrap' ).outerWidth() ) / 2 + 'px'
					});
					$('.tutopti-overlay-wrap span.arrow').css({
						'left': ( ( $( '.tutopti-overlay-wrap' ).outerWidth() - $('.tutopti-overlay-wrap span.arrow').outerWidth() ) / 2 ) + 'px'
					});
				} else if ( ($(window).height() - (el.outerHeight() + el.offset().top)) <  $( '.tutopti-overlay-wrap' ).outerHeight() ) { // If no space at the bottom
					$( '.tutopti-overlay-wrap' ).removeClass().addClass( 'tutopti-overlay-wrap tutopti-overlay-wrap-not-fit-left-and-right-bottom' );

					$( '.tutopti-overlay-wrap' ).css({
						'top': - ( $( '.tutopti-overlay-wrap' ).outerHeight() ) + 'px',
						'left': ( el.outerWidth() - $( '.tutopti-overlay-wrap' ).outerWidth() ) / 2 + 'px'
					});
					$('.tutopti-overlay-wrap span.arrow').css({
						'top': $( '.tutopti-overlay-wrap' ).outerHeight() - 16 + 'px',
						'left': ( ( $( '.tutopti-overlay-wrap' ).outerWidth() - $('.tutopti-overlay-wrap span.arrow').outerWidth() ) / 2 ) + 'px'
					});
				}
			}

			// If the target element is too large for the overlay to fit in any side, center it 
			if ( el.offset().left <  $( '.tutopti-overlay-wrap' ).outerWidth() && ($(window).width() - (el.outerWidth() + el.offset().left)) <  $( '.tutopti-overlay-wrap' ).outerWidth() && 
				 el.offset().top <  $( '.tutopti-overlay-wrap' ).outerHeight() && ($(window).height() - (el.outerHeight() + el.offset().top)) <  $( '.tutopti-overlay-wrap' ).outerHeight() ) {
				$( '.tutopti-overlay-wrap' ).removeClass().addClass( 'tutopti-overlay-wrap tutopti-overlay-wrap-not-fit-any-side' );

				if ( el.outerHeight() ) { // If element's height is greater than the overlay
					$( '.tutopti-overlay-wrap' ).css({
						'top': ( el.outerHeight() - $( '.tutopti-overlay-wrap' ).outerHeight() ) / 2 + 'px',
						'left': ( el.outerWidth() - $( '.tutopti-overlay-wrap' ).outerWidth() ) / 2 + 'px'
					});
				} else {
					$( '.tutopti-overlay-wrap' ).css({
						'top': - (( $( '.tutopti-overlay-wrap' ).outerHeight() - el.outerHeight() ) / 2) + 'px',
						'left': ( el.outerWidth() - $( '.tutopti-overlay-wrap' ).outerWidth() ) / 2 + 'px'
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