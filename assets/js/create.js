;(function ($) {
	// Global vars
	lifeguard_Vars.ovarlayAuto = '',
	lifeguard_Vars.ovarlayManual = '',
	lifeguard_Vars.elName = '',
	lifeguard_Vars.allowClose = true,
	lifeguard_Vars.actionDone = 'creado',
	lifeguard_Vars.statusOverlayClass = 'lifeguard-status-overlay',
	lifeguard_Vars.statusOverlayDataAttr = 'idclass',
	lifeguard_Vars.newCollection = {};

	// Control
	lifeguard_Create = {
		init: function () {
			if ( $.cookie('lifeguard-auto') == 1 || $.cookie('lifeguard-manual') == 1 ) {
				// Delay it a little to allow elements added by javascripts are loaded first
           	 	setTimeout(function(){
					lifeguard_Create.statusOverlay();
                    lifeguard_Create_Auto.init();
                    lifeguard_Create_Manual.init();
				}, 1000 );
           	}

            if ( lifeguard_Vars.active == 'yes' )
                $( document ).on( 'keypress', '.lifeguard-new-collection', lifeguard_Create.quickAddCollection ); // Quick add collection

            // Toggle on/off collection dropdown
            $( document ).on( 'click', '.lifeguard-add-collection', function(){
                $( this ).closest( 'p' ).fadeOut(function(){
                    $( this ).closest( 'p' ).next().fadeIn();
                });
            });
            $( document ).on( 'click', '.lifeguard-cancel-add-collection', function(){
                $( this ).closest( 'p' ).fadeOut(function(){
                    $( this ).closest( 'p' ).prev().fadeIn();
                });
            });

            // Disable Align values based the selected Edge value
            $( document ).on( 'change', '#lifeguard-edge', function(){
                if ( $( this ).val() == 'left' || $( this ).val() == 'right' ) {
                    $( '#lifeguard-align' ).children( 'option:disabled' ).prop( 'disabled', false );
                    $( '#lifeguard-align' ).children( 'option[value=left], option[value=right]' ).prop( 'disabled', 'disabled' );
                } else {
                    $( '#lifeguard-align' ).children( 'option:disabled' ).prop( 'disabled', false );
                    $( '#lifeguard-align' ).children( 'option[value=top], option[value=bottom]' ).prop( 'disabled', 'disabled' );
                }
            });

            // Tooltip
            $( document ).on( 'mouseover', '.lifeguard-overlay .tool-tip-icon', lifeguard_Create.toggleTooltip );
            $( document ).on( 'mouseout', '.lifeguard-overlay .tool-tip-icon', lifeguard_Create.toggleTooltip );

            // Toggles for auto/manual/stop modes.
            $('#wp-admin-bar-lifeguard-auto').on('click', '> a', lifeguard_Create.auto);
            $('#wp-admin-bar-lifeguard-manual').on('click', '> a', lifeguard_Create.manual);
            $('#wp-admin-bar-lifeguard-stop').on('click', '> a', lifeguard_Create.stop);

            // Indicate which mode is currently running
            if ( $.cookie( 'lifeguard-auto' ) == 1 || $.cookie( 'lifeguard-manual' ) == 1 ) {
                $('#wp-admin-bar-lifeguard-parent > a').addClass( 'running' );

                // Change text of the admin bar menu depending on the state
                if ( $.cookie( 'lifeguard-auto' ) == 1 )
                    $('#wp-admin-bar-lifeguard-parent > a').text( 'Auto' );
                else if ( $.cookie( 'lifeguard-manual' ) == 1 )
                    $('#wp-admin-bar-lifeguard-parent > a').text( 'Manual' );
                    
            } else {
                $('#wp-admin-bar-lifeguard-parent > a').removeClass( 'running' );
                $('#wp-admin-bar-lifeguard-parent > a').text( '' );
            }
		},

		auto: function (e) {
			e.preventDefault();

			// Set to auto
			$.cookie( 'lifeguard-auto', 1 );
			// Disable manual
			$.cookie( 'lifeguard-manual', 0 );
            // Remove stopped indication
            $.cookie( 'lifeguard-stopped', 0 );

			window.location.reload();
		},

		manual: function (e) {
			e.preventDefault();

			// Disable auto
			$.cookie( 'lifeguard-auto', 0 );
			// Enable manual
			$.cookie( 'lifeguard-manual', 1 );;
            // Remove stopped indication
            $.cookie( 'lifeguard-stopped', 0 );

			window.location.reload();
		},

		stop: function (e) {
			e.preventDefault();

			// Disable auto
			$.cookie( 'lifeguard-auto', 0 );
			// Disable manual
			$.cookie( 'lifeguard-manual', 0 );
            // Indicate that add mode was stopped. This will be used to prevent newly added pointers to appear upon stopping add mode.
            $.cookie( 'lifeguard-stopped', 1 );

			window.location.reload();
		},

		statusOverlay: function (e) {
			if ( !lifeguard_Vars.pointers_raw ) return;

			// Donnot allow add on our own page
            if ( lifeguard_Vars.screen_id == 'edit-lifeguard_pointer' ) return;

			for ( var i = 0; i < lifeguard_Vars.pointers_raw.length; i++ ) {
				// Add a border effect around element that has a pointer				
				$( 'body' ).append( '<div class="lifeguard-status-overlay" id="lifeguard-status-overlay-'+ i +'" data-idclass="'+ lifeguard_Vars.pointers_raw[i]['target'] +'" />' );

				if ( !$( '#lifeguard-status-overlay-'+ i ).length || !$( lifeguard_Vars.pointers_raw[i]['target'] ).length ) return;

				var offset = $( lifeguard_Vars.pointers_raw[i]['target'] ).offset();

	    		$( '#lifeguard-status-overlay-'+ i ).css({
	    			'width': $( lifeguard_Vars.pointers_raw[i]['target'] ).outerWidth() + 'px',
        			'height': $( lifeguard_Vars.pointers_raw[i]['target'] ).outerHeight() + 'px',
        			'left': offset.left - 4 + 'px',
        			'top': offset.top - 4 + 'px',
	    		});
	    	}
		},

        quickAddCollection: function (e) {
            if ( lifeguard_Vars.active != 'yes' ) return;

            var that = $( this ),
                code = e.keyCode || e.which; 

            // If Enter is not pressed
            if ( code != 13 ) return;

            e.preventDefault();

            var data = {
                        action: 'lifeguard_add_collection',
                        title: that.val(),
                        '_wpnonce': lifeguard_Vars.nonce
                    };

            $( '.lifeguard-cancel-add-collection' ).hide();
            $( '.lifeguard-new-collection' ).after( '<div class="lifeguard-loading adding-collection">Guardando...</div>' );

            $.post( lifeguard_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

                if( res.success ) {
                    // Assign for later use
                    lifeguard_Vars.newCollection.id = res.term_id; 
                    lifeguard_Vars.newCollection.name = that.val(); 

                    // Append newly added collection to the dropdown
                    $( '#lifeguard-collection' ).append( '<option value="'+ res.term_id +'">'+ that.val() +'</option>' );
                    // Deselect pre-selected option
                    $( '#lifeguard-collection' ).children( 'option:selected' ).prop( 'selected', false );
                    // Set newly added collection as selected
                    $( '#lifeguard-collection' ).children( 'option[value='+ res.term_id +']' ).prop( 'selected', 'selected' );
                    // Remove spinner
                    $( '.adding-collection' ).remove();
                    // Unhide cancel button
                    $( '.lifeguard-cancel-add-collection' ).show();
                    // Put the dropdown back in place
                    $( '.lifeguard-cancel-add-collection' ).trigger( 'click' );
                } else {
                    console.log( res.error );
                }
            });
        },

        toggleTooltip: function (e) {
            var that = $( this );

            // Remove if present
            if ( $( '.lifeguard-overlay .tool-tip' ).length ) {
                $( '.lifeguard-overlay .tool-tip' ).remove();
                return;
            }

            // Append tooltip
            that.after( '<div class="tool-tip"></div>' );
            // Inject text
            $( '.lifeguard-overlay .tool-tip' ).html( that.data( 'text' ) ).css({
                'left': that.position().left - ( ( $( '.lifeguard-overlay .tool-tip' ).outerWidth() - that.outerWidth() ) / 2 ) + 'px',
                'top': that.position().top + that.outerHeight() + 6 + 'px' 
            });
        }
	}

    //dom ready
    $(function() {
    	// Initialize create
    	lifeguard_Create.init();
    });

})(jQuery);