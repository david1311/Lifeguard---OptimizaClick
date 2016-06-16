<?php
class tutopti_Ajax {

    public function __construct() {
        add_action( 'wp_ajax_tutopti_overlay_auto', array( $this, 'overlay_auto') );
        add_action( 'wp_ajax_tutopti_overlay_manual', array( $this, 'overlay_manual') );

        add_action( 'wp_ajax_tutopti_add_pointer', array( $this, 'add_pointer') );
        add_action( 'wp_ajax_tutopti_update_pointer', array( $this, 'update_pointer') );
        add_action( 'wp_ajax_tutopti_delete_pointer', array( $this, 'delete_pointer') );

        add_action( 'wp_ajax_tutopti_restart_collection', array( $this, 'restart_collection') );

        add_action( 'wp_ajax_tutopti_add_collection', array( $this, 'add_collection') );

        add_action( 'wp_ajax_tutopti_splash', array( $this, 'splash') );
        add_action( 'wp_ajax_tutopti_dismiss_splash', array( $this, 'dismiss_splash') );

        add_action( 'wp_ajax_tutopti_activate', array( $this, 'activate' ) );
        add_action( 'wp_ajax_tutopti_deactivate', array( $this, 'deactivate' ) );
    }

    public function overlay_auto() {
        check_ajax_referer( 'tutopti_nonce' );

        echo json_encode(array(
            'success' => true,
            'html' => tutopti_overlay_auto()
        ));

        exit;
    }

    public function overlay_manual() {
        check_ajax_referer( 'tutopti_nonce' );

        echo json_encode(array(
            'success' => true,
            'html' => tutopti_overlay_manual()
        ));

        exit;
    }

    public function add_pointer() {
        check_ajax_referer( 'tutopti_add_pointer', 'tutopti_nonce' );

        $pointer_obj = tutopti_Pointer::getInstance();
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
        check_ajax_referer( 'tutopti_add_pointer', 'tutopti_nonce' );

        $pointer_obj = tutopti_Pointer::getInstance();
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
        check_ajax_referer( 'tutopti_nonce' );

        $pointer_obj = tutopti_Pointer::getInstance();
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
        check_ajax_referer( 'tutopti_nonce' );

        $collection_obj = tutopti_Collection::getInstance();
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
        check_ajax_referer( 'tutopti_nonce' );

        $collection_obj = tutopti_Collection::getInstance();
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
        check_ajax_referer( 'tutopti_nonce' );

        echo json_encode(array(
            'success' => true,
            'html' => tutopti_splash()
        ));

        exit;
    }

    public function dismiss_splash() {
        check_ajax_referer( 'tutopti_nonce' );

        update_user_meta( get_current_user_id(), '_tutopti_splash_dismissed', 1 );

        echo json_encode(array(
            'success' => true
        ));

        exit;
    }

    public function activate() {
        check_ajax_referer( 'tutopti_nonce' );

        global $tutopti;

        $res = tutopti_is_valid_serial_key( $_POST['serial_key'] );
        if ( !$res['success'] ) {
            echo json_encode(array(
                'success' => false,
                'message' => $res['message']
            ));

            exit;
        }

        if ( $res['item_name'] != $tutopti->plugin_name ) {
            echo json_encode(array(
                'success' => false,
                'message' => 'The serial key your using is not for '.$tutopti->plugin_name
            ));

            exit;
        }

        $res = tutopti_register_server_info( $_POST['serial_key'] );
        if ( !$res['success'] ) {
            echo json_encode(array(
                'success' => false,
                'message' => $res['message']
            ));

            exit;
        }

        update_option( '_tutopti_status', 'active' );
        update_option( '_tutopti_sk', $_POST['serial_key'] );

        echo json_encode(array(
            'success' => true,
        ));

        exit;
    }

    public function deactivate() {
        check_ajax_referer( 'tutopti_nonce' );

        $res = tutopti_deactivate( $_POST['serial_key'] );
        if ( !$res['success'] ) {
            echo json_encode(array(
                'success' => false,
                'message' => $res['message']
            ));

            exit;
        }

        delete_option( '_tutopti_status' );

        echo json_encode(array(
            'success' => true,
        ));

        exit;
    }

}