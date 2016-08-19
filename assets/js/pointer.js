;(function ($) {
    // Global vars
    lifeguard_Vars.currentPointer = 0;
    lifeguard_Vars.wickedPointers = [];

    lifeguard_Pointer = {
        init: function (e) {
            if ( lifeguard_Vars.active == 'yes' )
                $( document ).on( 'click', '.lifeguard-restart-collection', lifeguard_Pointer.restart ); // Restart collection

            // Hide pointers when help pane is shown
            $( '#contextual-help-link' ).on( 'click', lifeguard_Pointer.togglePointers );

            // If no pointers for this page, bail out
            if ( !lifeguard_Vars.pointers ) return;

            if ( lifeguard_Vars.active == 'yes' ) {
                // Turn off Create Mode OR Restart Collection first 
                if ( $.cookie( 'lifeguard-auto' ) == 1 || $.cookie( 'lifeguard-manual' ) == 1 || $.cookie( 'lifeguard-stopped' ) == 1 || lifeguard_Vars.pointers.length < lifeguard_Vars.pointers_raw.length ) return;
            }

            // Delay it a little to allow elements added by javascripts are loaded first
            setTimeout(function(){
                lifeguard_Pointer.start(); // Render poiners
            
                if ( $( '.wp-pointer' ).length > 1 ) {
                    // Hide all except the first 
                    $( '.wp-pointer:not(:first)' ).hide();
                    if ( lifeguard_Vars.active == 'yes' )
                        $( '.wp-pointer:not(:first)' ).find( '.wp-pointer-buttons' ).prepend( '<a href="#" class="button-primary back" >Volver</a>' ); // Add back button

                    // Change all action to Next except the last
                    $( '.wp-pointer:not(:last)' ).find( '.close' ).addClass( 'button-primary next' ).removeClass( 'close' ).html( '<i class="fa fa-check"></i> Siguiente' );
                }

                $( '.wp-pointer:first' ).addClass( 'wp-current-pointer' );
                // Change last button text to "Done"
                $( '.wp-pointer:last' ).find( '.close' ).removeClass( 'next' ).addClass( 'button-primary' ).html( '<i class="fa fa-check"></i> Aceptar' );
                // Trigger next when next button is clicked
                $( '.wp-pointer .next' ).on( 'click', lifeguard_Pointer.next );

                if ( lifeguard_Vars.active == 'yes' )
                    $( '.wp-pointer .back' ).on( 'click', lifeguard_Pointer.back ); // Trigger back when back button is clicked

                // If there are pointers displayed, change button text to 'Restart'
                if ( $( '.wp-pointer' ).length > 1)
                    $( '.lifeguard-restart-collection' ).val( 'Reiniciar' );

                // Position pointer
                lifeguard_Pointer.position();

            }, 1000 );
        },

        start: function (e) {
            var counter = 0;

            $.each(lifeguard_Vars.pointers, function(i) {
                options = $.extend( lifeguard_Vars.pointers[i].options, {
                    close: function() {
                        $.post( lifeguard_Vars.ajaxurl, {
                            pointer: lifeguard_Vars.pointers[i].pointer_id,
                            action: 'dismiss-wp-pointer'
                        });
                    }
                });
            
                $(lifeguard_Vars.pointers[i].target).pointer( options ).pointer('open');

                // Collect rendered pointers
                lifeguard_Vars.wickedPointers[counter++] = { 
                    index: i, 
                    edge: lifeguard_Vars.pointers_raw[i].edge,
                    align: lifeguard_Vars.pointers_raw[i].align, 
                    target: lifeguard_Vars.pointers_raw[i].target 
                }; 
            });

            // Fix wicked pointers
            lifeguard_Pointer.fix();
        },

        fix: function (e) {
            // This fixes pointers with arrow alignment issues. NOTE: This is a Wordpress issue. We're just fixing it.
           $.each( lifeguard_Vars.wickedPointers, function(i){

                if ( lifeguard_Vars.wickedPointers[i].edge == 'top' || lifeguard_Vars.wickedPointers[i].edge == 'bottom' ) {
                    if ( lifeguard_Vars.wickedPointers[i].align == 'left' ) {
                        if ( $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() < $( lifeguard_Vars.wickedPointers[i].target ).outerWidth() &&  
                            $( lifeguard_Vars.wickedPointers[i].target ).outerWidth() <= $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).outerWidth() ) {

                            $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'left': ( $( lifeguard_Vars.wickedPointers[i].target ).outerWidth() - $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() ) / 2 + 'px'
                            });
                        } else {
                            $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'left': '3px'
                            });
                        }
                    } else if ( lifeguard_Vars.wickedPointers[i].align == 'right' ) {
                        if ( $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() < $( lifeguard_Vars.wickedPointers[i].target ).outerWidth() &&
                            $( lifeguard_Vars.wickedPointers[i].target ).outerWidth() <= $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).outerWidth() ) {
                            $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'left': 'auto',
                                'right': ( $( lifeguard_Vars.wickedPointers[i].target ).outerWidth() - $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() ) / 2 + 'px'
                            });
                        } else {
                            $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'left': 'auto',
                                'right': '3px'
                            });
                        }
                    } else if ( lifeguard_Vars.wickedPointers[i].align == 'middle' ) {
                        $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                            'left': ( $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).outerWidth() - $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerWidth() ) / 2 + 'px'
                        });
                    }

                    // Fix for Edge Bottom. Pointer overlaps with the element. Reduce top value by 20px.
                    if ( lifeguard_Vars.wickedPointers[i].edge == 'bottom' ) {
                        $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).css({ 'top': $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).css('top').replace( /[^-\d\.]/g, '' ) - 20 + 'px' });
                    }
                } else {
                    if ( lifeguard_Vars.wickedPointers[i].align == 'top' ) {
                        if ( $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerHeight() < $( lifeguard_Vars.wickedPointers[i].target ).outerHeight() ) {
                            $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'top': ( $( lifeguard_Vars.wickedPointers[i].target ).outerHeight() - $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerHeight() ) / 2 + 'px'
                            });
                        } else {
                            $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'top': '20px'
                            });
                        }
                    } else if ( lifeguard_Vars.wickedPointers[i].align == 'bottom' ) {
                        if ( $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerHeight() < $( lifeguard_Vars.wickedPointers[i].target ).outerHeight() ) {
                            $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'top': 'auto',
                                'bottom': ( $( lifeguard_Vars.wickedPointers[i].target ).outerHeight() - $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).outerHeight() ) / 2 + 'px'
                            });
                        } else {
                            $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).find( '.wp-pointer-arrow' ).css({
                                'top': 'auto',
                                'bottom': '3px'
                            });
                        }
                    } 

                    // Fix for Edge Right. Pointer overlaps with the element. Reduce left value by 13px.
                    if ( lifeguard_Vars.wickedPointers[i].edge == 'right' ) {
                        $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).css({ 'left': $( '.wp-pointer' ).eq( lifeguard_Vars.wickedPointers[i].index ).css('left').replace( /[^-\d\.]/g, '' ) - 13 + 'px' });
                    }
                }
           });
        },

        restart: function (e) {
            e.preventDefault();

            if ( lifeguard_Vars.active != 'yes' ) return;

            var data = {
                        action: 'lifeguard_restart_collection',
                        pointers: lifeguard_Vars.pointers_raw,
                        '_wpnonce': lifeguard_Vars.nonce
                    },
                buttonText = $( '.wp-pointer' ).length ? 'Reiniciar...' : 'Empezar...';

            $('.lifeguard-help-content .button-primary').after('<div class="lifeguard-loading restarting">Reiniciando...</div>');
            $('.lifeguard-help-content .button-primary').addClass( 'lifeguard-doing-ajax' );
            $('.lifeguard-help-content .button-primary').val( buttonText );

            $.post( lifeguard_Vars.ajaxurl, data, function(res) {
                res = $.parseJSON(res);

                if( res.success ) {
                    // Set this to 0 so pointers will be shown
                    $.cookie( 'lifeguard-auto', 0 );
                    // Set this to 0 so pointers will be shown
                    $.cookie( 'lifeguard-manual', 0 );
                    // Set this to 0 so pointers will be shown
                  $.cookie( 'lifeguard-stopped', 0 );
                    // Set this to 0 so pointers will be shown
                    window.location.reload();
                } else {
                    console.log(res.error);
                }
            });
        },

        next: function (e) {
            $( '.wp-current-pointer').removeClass( 'wp-current-pointer' ).hide();
            $( '.wp-pointer').eq( ++lifeguard_Vars.currentPointer ).addClass('wp-current-pointer').fadeIn();

            // Position pointer
            lifeguard_Pointer.position();
        },

        back: function (e) {
            e.preventDefault();
            
            $( '.wp-current-pointer').removeClass( 'wp-current-pointer' ).hide();
            $( '.wp-pointer').eq( --lifeguard_Vars.currentPointer ).addClass('wp-current-pointer').fadeIn();

            // Position pointer
            lifeguard_Pointer.position();
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
        lifeguard_Pointer.init();
    });

})(jQuery);