;(function ($) {
	// Global vars
	tutopti_Vars.ovarlayAuto = '',
	tutopti_Vars.ovarlayManual = '',
	tutopti_Vars.elName = '',
	tutopti_Vars.allowClose = true,
	tutopti_Vars.actionDone = 'created',
	tutopti_Vars.statusOverlayClass = 'tutopti-status-overlay',
	tutopti_Vars.statusOverlayDataAttr = 'idclass',
	tutopti_Vars.newCollection = {};

	// Control
	tutopti_Create = {
		init: function () {
			if ( $.cookie('tutopti-auto') == 1 || $.cookie('tutopti-manual') == 1 ) {
				// Delay it a little to allow elements added by javascripts are loaded first
           	 	setTimeout(function(){
					tutopti_Create.statusOverlay();
                    tutopti_Create_Auto.init();
                    tutopti_Create_Manual.init();
				}, 1000 );
           	}

            if ( tutopti_Vars.active == 'yes' )
                $( document ).on( 'keypress', '.tutopti-new-collection', tutopti_Create.quickAddCollection ); // Quick add collection

            // Toggle on/off collection dropdown
            $( document ).on( 'click', '.tutopti-add-collection', function(){
                $( this ).closest( 'p' ).fadeOut(function(){
                    $( this ).closest( 'p' ).next().fadeIn();
                });
            });
            $( document ).on( 'click', '.tutopti-cancel-add-collection', function(){
                $( this ).closest( 'p' ).fadeOut(function(){
                    $( this ).closest( 'p' ).prev().fadeIn();
                });
            });

            // Disable Align values based the selected Edge value
            $( document ).on( 'change', '#tutopti-edge', function(){
                if ( $( this ).val() == 'left' || $( this ).val() == 'right' ) {
                    $( '#tutopti-align' ).children( 'option:disabled' ).prop( 'disabled', false );
                    $( '#tutopti-align' ).children( 'option[value=left], option[value=right]' ).prop( 'disabled', 'disabled' );
                } else {
                    $( '#tutopti-align' ).children( 'option:disabled' ).prop( 'disabled', false );
                    $( '#tutopti-align' ).children( 'option[value=top], option[value=bottom]' ).prop( 'disabled', 'disabled' );
                }
            });

            // Tooltip
            $( document ).on( 'mouseover', '.tutopti-overlay .tool-tip-icon', tutopti_Create.toggleTooltip );
            $( document ).on( 'mouseout', '.tutopti-overlay .tool-tip-icon', tutopti_Create.toggleTooltip );

            // Toggles for auto/manual/stop modes.
            $('#wp-admin-bar-tutopti-auto').on('click', '> a', tutopti_Create.auto);
            $('#wp-admin-bar-tutopti-manual').on('click', '> a', tutopti_Create.manual);
            $('#wp-admin-bar-tutopti-stop').on('click', '> a', tutopti_Create.stop);

            // Indicate which mode is currently running
            if ( $.cookie( 'tutopti-auto' ) == 1 || $.cookie( 'tutopti-manual' ) == 1 ) {
                $('#wp-admin-bar-tutopti-parent > a').addClass( 'running' );

                // Change text of the admin bar menu depending on the state
                if ( $.cookie( 'tutopti-auto' ) == 1 )
                    $('#wp-admin-bar-tutopti-parent > a').text( 'Auto' );
                else if ( $.cookie( 'tutopti-manual' ) == 1 )
                    $('#wp-admin-bar-tutopti-parent > a').text( 'Manual' );
                    
            } else {
                $('#wp-admin-bar-tutopti-parent > a').removeClass( 'running' );
                $('#wp-admin-bar-tutopti-parent > a').text( '' );
            }
		},

		auto: function (e) {
			e.preventDefault();

			// Set to auto
			$.cookie( 'tutopti-auto', 1 );
			// Disable manual
			$.cookie( 'tutopti-manual', 0 );
            // Remove stopped indication
            $.cookie( 'tutopti-stopped', 0 );

			window.location.reload();
		},

		manual: function (e) {
			e.preventDefault();

			// Disable auto
			$.cookie( 'tutopti-auto', 0 );
			// Enable manual
			$.cookie( 'tutopti-manual', 1 );;
            // Remove stopped indication
            $.cookie( 'tutopti-stopped', 0 );

			window.location.reload();
		},

		stop: function (e) {
			e.preventDefault();

			// Disable auto
			$.cookie( 'tutopti-auto', 0 );
			// Disable manual
			$.cookie( 'tutopti-manual', 0 );
            // Indicate that add mode was stopped. This will be used to prevent newly added pointers to appear upon stopping add mode.
            $.cookie( 'tutopti-stopped', 1 );

			window.location.reload();
		},

		statusOverlay: function (e) {
			if ( !tutopti_Vars.pointers_raw ) return;

			// Donnot allow add on our own page
            if ( tutopti_Vars.screen_id == 'edit-tutopti_pointer' ) return;

			for ( var i = 0; i < tutopti_Vars.pointers_raw.length; i++ ) {
				// Add a border effect around element that has a pointer				
				$( 'body' ).append( '<div class="tutopti-status-overlay" id="tutopti-status-overlay-'+ i +'" data-idclass="'+ tutopti_Vars.pointers_raw[i]['target'] +'" />' );

				if ( !$( '#tutopti-status-overlay-'+ i ).length || !$( tutopti_Vars.pointers_raw[i]['target'] ).length ) return;

				var offset = $( tutopti_Vars.pointers_raw[i]['target'] ).offset();

	    		$( '#tutopti-status-overlay-'+ i ).css({
	    			'width': $( tutopti_Vars.pointers_raw[i]['target'] ).outerWidth() + 'px',
        			'height': $( tutopti_Vars.pointers_raw[i]['target'] ).outerHeight() + 'px',
        			'left': offset.left - 4 + 'px',
        			'top': offset.top - 4 + 'px',
	    		});
	    	}
		},

        quickAddCollection: function (e) {
            if ( tutopti_Vars.active != 'yes' ) return;

            var that = $( this ),
                code = e.keyCode || e.which; 

            // If Enter is not pressed
            if ( code != 13 ) return;

            e.preventDefault();

            var data = {
                        action: 'tutopti_add_collection',
                        title: that.val(),
                        '_wpnonce': tutopti_Vars.nonce
                    };

            $( '.tutopti-cancel-add-collection' ).hide();
            $( '.tutopti-new-collection' ).after( '<div class="tutopti-loading adding-collection">Saving...</div>' );

            $.post( tutopti_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

                if( res.success ) {
                    // Assign for later use
                    tutopti_Vars.newCollection.id = res.term_id; 
                    tutopti_Vars.newCollection.name = that.val(); 

                    // Append newly added collection to the dropdown
                    $( '#tutopti-collection' ).append( '<option value="'+ res.term_id +'">'+ that.val() +'</option>' );
                    // Deselect pre-selected option
                    $( '#tutopti-collection' ).children( 'option:selected' ).prop( 'selected', false );
                    // Set newly added collection as selected
                    $( '#tutopti-collection' ).children( 'option[value='+ res.term_id +']' ).prop( 'selected', 'selected' );
                    // Remove spinner
                    $( '.adding-collection' ).remove();
                    // Unhide cancel button
                    $( '.tutopti-cancel-add-collection' ).show();
                    // Put the dropdown back in place
                    $( '.tutopti-cancel-add-collection' ).trigger( 'click' );
                } else {
                    console.log( res.error );
                }
            });
        },

        toggleTooltip: function (e) {
            var that = $( this );

            // Remove if present
            if ( $( '.tutopti-overlay .tool-tip' ).length ) {
                $( '.tutopti-overlay .tool-tip' ).remove();
                return;
            }

            // Append tooltip
            that.after( '<div class="tool-tip"></div>' );
            // Inject text
            $( '.tutopti-overlay .tool-tip' ).html( that.data( 'text' ) ).css({
                'left': that.position().left - ( ( $( '.tutopti-overlay .tool-tip' ).outerWidth() - that.outerWidth() ) / 2 ) + 'px',
                'top': that.position().top + that.outerHeight() + 6 + 'px' 
            });
        }
	}

    //dom ready
    $(function() {
    	// Initialize create
    	tutopti_Create.init();
    });

})(jQuery);