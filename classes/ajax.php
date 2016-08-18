<?php
class lifeguard_Ajax {

    public function __construct() {
        add_action( 'wp_ajax_lifeguard_overlay_auto', array( $this, 'overlay_auto') );
        add_action( 'wp_ajax_lifeguard_overlay_manual', array( $this, 'overlay_manual') );

        add_action( 'wp_ajax_lifeguard_add_pointer', array( $this, 'add_pointer') );
        add_action( 'wp_ajax_lifeguard_update_pointer', array( $this, 'update_pointer') );
        add_action( 'wp_ajax_lifeguard_delete_pointer', array( $this, 'delete_pointer') );

        add_action( 'wp_ajax_lifeguard_restart_collection', array( $this, 'restart_collection') );

        add_action( 'wp_ajax_lifeguard_add_collection', array( $this, 'add_collection') );

        add_action( 'wp_ajax_lifeguard_splash', array( $this, 'splash') );
        add_action( 'wp_ajax_lifeguard_dismiss_splash', array( $this, 'dismiss_splash') );

        add_action( 'wp_ajax_lifeguard_activate', array( $this, 'activate' ) );
        add_action( 'wp_ajax_lifeguard_deactivate', array( $this, 'deactivate' ) );
    }

    public function overlay_auto() {
        check_ajax_referer( 'lifeguard_nonce' );

        echo json_encode(array(
            'success' => true,
            'html' => lifeguard_overlay_auto()
        ));

        exit;
    }

    public function overlay_manual() {
        check_ajax_referer( 'lifeguard_nonce' );

        echo json_encode(array(
            'success' => true,
            'html' => lifeguard_overlay_manual()
        ));

        exit;
    }

    public function add_pointer() {
        check_ajax_referer( 'lifeguard_add_pointer', 'lifeguard_nonce' );

        $pointer_obj = lifeguard_Pointer::getInstance();
        $result = $pointer_obj->add( $_POST );

        if ( !$result ) {
            echo json_encode(array(
                'success' => false,
                'error' => $result
            ));

            exit;
        }

        echo json_encode(array(
            'success' => true,
        ));

        exit;
    }

    public function update_pointer() {
        check_ajax_referer( 'lifeguard_add_pointer', 'lifeguard_nonce' );

        $pointer_obj = lifeguard_Pointer::getInstance();
        $result = $pointer_obj->update( $_POST );

        if ( !$result ) {
            echo json_encode(array(
                'success' => false,
                'error' => $result
            ));

            exit;
        }

        echo json_encode(array(
            'success' => true,
        ));

        exit;
    }

    public function delete_pointer() {
        check_ajax_referer( 'lifeguard_nonce' );

        $pointer_obj = lifeguard_Pointer::getInstance();
        $result = $pointer_obj->delete( $_POST['post_id'] );

        if ( !$result ) {
            echo json_encode(array(
                'success' => false,
                'error' => $result
            ));

            exit;
        }

        echo json_encode(array(
            'success' => true,
        ));

        exit;
    }

    public function restart_collection() {
        check_ajax_referer( 'lifeguard_nonce' );

        $collection_obj = lifeguard_Collection::getInstance();
        $result = $collection_obj->restart( $_POST['pointers'] );

        if ( !$result ) {
            echo json_encode(array(
                'success' => false,
                'error' => $result
            ));

            exit;
        }

        echo json_encode(array(
            'success' => true
        ));

        exit;
    }

    public function add_collection() {
        check_ajax_referer( 'lifeguard_nonce' );

        $collection_obj = lifeguard_Collection::getInstance();
        $result = $collection_obj->add( $_POST['title'] );

        if ( !$result ) {
            echo json_encode(array(
                'success' => false,
                'error' => $result
            ));

            exit;
        }

        echo json_encode(array(
            'success' => true,
            'term_id' => $result
        ));

        exit;
    }

    public function splash() {
        check_ajax_referer( 'lifeguard_nonce' );

        echo json_encode(array(
            'success' => true,
            'html' => lifeguard_splash()
        ));

        exit;
    }

    public function dismiss_splash() {
        check_ajax_referer( 'lifeguard_nonce' );

        update_user_meta( get_current_user_id(), '_lifeguard_splash_dismissed', 1 );

        echo json_encode(array(
            'success' => true
        ));

        exit;
    }

    public function activate() {
        check_ajax_referer( 'lifeguard_nonce' );

        global $lifeguard;

        $res = lifeguard_is_valid_serial_key( $_POST['serial_key'] );
        if ( !$res['success'] ) {
            echo json_encode(array(
                'success' => false,
                'message' => $res['message']
            ));

            exit;
        }

        if ( $res['item_name'] != $lifeguard->plugin_name ) {
            echo json_encode(array(
                'success' => false,
                'message' => 'The serial key your using is not for '.$lifeguard->plugin_name
            ));

            exit;
        }

        $res = lifeguard_register_server_info( $_POST['serial_key'] );
        if ( !$res['success'] ) {
            echo json_encode(array(
                'success' => false,
                'message' => $res['message']
            ));

            exit;
        }

        update_option( '_lifeguard_status', 'active' );
        update_option( '_lifeguard_sk', $_POST['serial_key'] );

        echo json_encode(array(
            'success' => true,
        ));

        exit;
    }

    public function deactivate() {
        check_ajax_referer( 'lifeguard_nonce' );

        $res = lifeguard_deactivate( $_POST['serial_key'] );
        if ( !$res['success'] ) {
            echo json_encode(array(
                'success' => false,
                'message' => $res['message']
            ));

            exit;
        }

        delete_option( '_lifeguard_status' );

        echo json_encode(array(
            'success' => true,
        ));

        exit;
    }

}