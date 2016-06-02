;(function ($) {
    // Global vars
    tutopti_Vars.currentPointer = 0;
    tutopti_Vars.wickedPointers = [];

    tutopti_Pointer = {
        init: function (e) {
            if ( tutopti_Vars.active == 'yes' )
                $( document ).on( 'click', '.tutopti-restart-collection', tutopti_Pointer.restart ); // Restart collection

            // Hide pointers when help pane is shown
            $( '#contextual-help-link' ).on( 'click', tutopti_Pointer.togglePointers );

            // If no pointers for this page, bail out
            if ( !tutopti_Vars.pointers ) return;

            if ( tutopti_Vars.active == 'yes' ) {
                // Turn off Create Mode OR Restart Collection first 
                if ( $.cookie( 'tutopti-auto' ) == 1 || $.cookie( 'tutopti-manual' ) == 1 || $.cookie( 'tutopti-stopped' ) == 1 || tutopti_Vars.pointers.length < tutopti_Vars.pointers_raw.length ) return;
            }

            // Delay it a little to allow elements added by javascripts are loaded first
            setTimeout(function(){
                tutopti_Pointer.start(); // Render poiners
            
                if ( $( '.wp-pointer' ).length > 1 ) {
                    // Hide all except the first 
                    $( '.wp-pointer:not(:first)' ).hide();
                    if ( tutopti_Vars.active == 'yes' )
                        $( '.wp-pointer:not(:first)' ).find( '.wp-pointer-buttons' ).prepend( '<a href="#" class="button-primary back" >Volver</a>' ); // Add back button

                    // Change all action to Next except the last
                    $( '.wp-pointer:not(:last)' ).find( '.close' ).addClass( 'button-primary next' ).removeClass( 'close' ).text( 'Siguiente' );
                }

                $( '.wp-pointer:first' ).addClass( 'wp-current-pointer' );
                // Change last button text to "Done"
                $( '.wp-pointer:last' ).find( '.close' ).removeClass( 'next' ).addClass( 'button-primary' ).text( 'Aceptar' );
                // Trigger next when next button is clicked
                $( '.wp-pointer .next' ).on( 'click', tutopti_Pointer.next );

                if ( tutopti_Vars.active == 'yes' )
                    $( '.wp-pointer .back' ).on( 'click', tutopti_Pointer.back ); // Trigger back when back button is clicked

                // If there are pointers displayed, change button text to 'Restart'
                if ( $( '.wp-pointer' ).length )
                    $( '.tutopti-restart-collection' ).val( 'Restart Tour!' );

                // Position pointer
                tutopti_Pointer.position();

            }, 1000 );
        },

        start: function (e) {
            var counter = 0;

            $.each(tutopti_Vars.pointers, function(i) {
                options = $.extend( tutopti_Vars.pointers[i].options, {
                    close: function() {
                        $.post( tutopti_Vars.ajaxurl, {
                            pointer: tutopti_Vars.pointers[i].pointer_id,
                            action: 'dismiss-wp-pointer'
                        });
                    }
                });
            
                $(tutopti_Vars.pointers[i].target).pointer( options ).pointer('open');

                // Collect rendered pointers
                tutopti_Vars.wickedPointers[counter++] = { 
                    index: i, 
                    edge: tutopti_Vars.pointers_raw[i].edge,
                    align: tutopti_Vars.pointers_raw[i].align, 
                    target: tutopti_Vars.pointers_raw[i].target 
                }; 
            });

            // Fix wicked pointers
            tutopti_Pointer.fix();
        },

        fix: function (e) {
            // This fixes pointers with arrow alignment issues. NOTE: This is a Wordpress issue. We're just fixing it.
           $.each( tutopti_Vars.wickedPointers, function(i){

                if ( tutopti_Vars.wickedPointers[i].edge == 'top' || tutopti_Vars.wickedPointers[i].edge == 'bottom' ) {
                    if ( tutopti_Vars.wickedPointers[i].align == 'left' ) {
                        if ( $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() < $( tutopti_Vars.wickedPointers[i].target ).outerWidth() &&  
                            $( tutopti_Vars.wickedPointers[i].target ).outerWidth() <= $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).outerWidth() ) {

                            $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'left': ( $( tutopti_Vars.wickedPointers[i].target ).outerWidth() - $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() ) / 2 + 'px'
                            });
                        } else {
                            $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'left': '3px'
                            });
                        }
                    } else if ( tutopti_Vars.wickedPointers[i].align == 'right' ) {
                        if ( $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() < $( tutopti_Vars.wickedPointers[i].target ).outerWidth() &&
                            $( tutopti_Vars.wickedPointers[i].target ).outerWidth() <= $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).outerWidth() ) {
                            $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'left': 'auto',
                                'right': ( $( tutopti_Vars.wickedPointers[i].target ).outerWidth() - $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() ) / 2 + 'px'
                            });
                        } else {
                            $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'left': 'auto',
                                'right': '3px'
                            });
                        }
                    } else if ( tutopti_Vars.wickedPointers[i].align == 'middle' ) {
                        $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                            'left': ( $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).outerWidth() - $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() ) / 2 + 'px'
                        });
                    }

                    // Fix for Edge Bottom. Pointer overlaps with the element. Reduce top value by 20px.
                    if ( tutopti_Vars.wickedPointers[i].edge == 'bottom' ) {
                        $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).css({ 'top': $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).css('top').replace( /[^-\d\.]/g, '' ) - 20 + 'px' });
                    }
                } else {
                    if ( tutopti_Vars.wickedPointers[i].align == 'top' ) {
                        if ( $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerHeight() < $( tutopti_Vars.wickedPointers[i].target ).outerHeight() ) {
                            $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'top': ( $( tutopti_Vars.wickedPointers[i].target ).outerHeight() - $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerHeight() ) / 2 + 'px'
                            });
                        } else {
                            $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'top': '20px'
                            });
                        }
                    } else if ( tutopti_Vars.wickedPointers[i].align == 'bottom' ) {
                        if ( $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerHeight() < $( tutopti_Vars.wickedPointers[i].target ).outerHeight() ) {
                            $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'top': 'auto',
                                'bottom': ( $( tutopti_Vars.wickedPointers[i].target ).outerHeight() - $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerHeight() ) / 2 + 'px'
                            });
                        } else {
                            $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'top': 'auto',
                                'bottom': '3px'
                            });
                        }
                    } 

                    // Fix for Edge Right. Pointer overlaps with the element. Reduce left value by 13px.
                    if ( tutopti_Vars.wickedPointers[i].edge == 'right' ) {
                        $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).css({ 'left': $( '.wp-pointer' ).eq( tutopti_Vars.wickedPointers[i].index ).css('left').replace( /[^-\d\.]/g, '' ) - 13 + 'px' });
                    }
                }
           });
        },

        restart: function (e) {
            e.preventDefault();

            if ( tutopti_Vars.active != 'yes' ) return;

            var data = {
                        action: 'tutopti_restart_collection',
                        pointers: tutopti_Vars.pointers_raw,
                        '_wpnonce': tutopti_Vars.nonce
                    },
                buttonText = $( '.wp-pointer' ).length ? 'Reiniciar...' : 'Empezar...';

            $('.tutopti-help-content .button-primary').after('<div class="tutopti-loading restarting">Reiniciando...</div>');
            $('.tutopti-help-content .button-primary').addClass( 'tutopti-doing-ajax' );
            $('.tutopti-help-content .button-primary').val( buttonText );

            $.post( tutopti_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

                if( res.success ) {
                    // Set this to 0 so pointers will be shown
                    $.cookie( 'tutopti-auto', 0 );
                    // Set this to 0 so pointers will be shown
                    $.cookie( 'tutopti-manual', 0 );
                    // Set this to 0 so pointers will be shown
+                    $.cookie( 'tutopti-stopped', 0 );
                    // Reload to restart collection
                    window.location.reload();
                } else {
                    console.log(res.error);
                }
            });
        },

        next: function (e) {
            $( '.wp-current-pointer').removeClass( 'wp-current-pointer' ).hide();
            $( '.wp-pointer').eq( ++tutopti_Vars.currentPointer ).addClass('wp-current-pointer').fadeIn();

            // Position pointer
            tutopti_Pointer.position();
        },

        back: function (e) {
            e.preventDefault();
            
            $( '.wp-current-pointer').removeClass( 'wp-current-pointer' ).hide();
            $( '.wp-pointer').eq( --tutopti_Vars.currentPointer ).addClass('wp-current-pointer').fadeIn();

            // Position pointer
            tutopti_Pointer.position();
        },

        togglePointers: function(e) {
            if ( $(this).hasClass( 'hidden' ) || !$(this).hasClass( 'shown' ) ) {
                $(this).removeClass( 'hidden' ).addClass( 'shown' );
                if ( $( '.wp-pointer' ).length )
                    $( '.wp-pointer' ).hide();
            } else if ( $(this).hasClass( 'shown' ) ) {
                $(this).removeClass( 'shown' ).addClass( 'hidden' );
                if ( $( '.wp-pointer' ).length > 1 ) {
                    $( '.wp-current-pointer' ).fadeIn();
                } else {
                    $( '.wp-pointer' ).fadeIn();
                }
            }
        },

        position: function(e) {
            if ( $( '#wpadminbar' ).length )
                $( 'body, html' ).animate({ scrollTop: $( '.wp-current-pointer').offset().top -48 }, 800 );
            else 
                $( 'body, html' ).animate({ scrollTop: $( '.wp-current-pointer').offset().top - 20 }, 800 );
        }
    }

    //dom ready
    $(function() {
        tutopti_Pointer.init();
    });

})(jQuery);