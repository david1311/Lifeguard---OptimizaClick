<?php

if ( ! defined( 'ABSPATH' ) ) exit; 

if ( ! class_exists( 'lifeguard_Collection' ) ) {

class lifeguard_Collection {
    
    private static $instance;  

    public $pointers;
    public $raw;

    public static function getInstance() {
        if ( !self::$instance ) {
            self::$instance = new lifeguard_Collection();
        }

        return self::$instance;
    }
 
   public function get( $screen_id, $page_name ) {
        $pointer_obj = lifeguard_Pointer::getInstance();

        $this->pointers = $pointer_obj->all( $screen_id, $page_name );

        $this->raw = $this->pointers;

        return $this->prepare();
    }

    public function get_raw() {
        if ( !$this->raw )
            return;

        return $this->raw;
    }


 public function prepare() {
        if ( !$this->pointers )
            return;

        $pointers = array();

        foreach( $this->pointers as $pointer ) {
               
                $pointers[$pointer->pointer_id] = array(
                    'pointer_id' => $pointer->pointer_id,
                    'screen' => $pointer->screen_id,
                    'target' => $pointer->target,
                    'options' => array(
                        'content' => sprintf( '<h3> %s </h3> <p> %s </p>',
                            __( $pointer->post_title , 'lifeguard' ),
                            __( $pointer->post_content, 'lifeguard' )
                        ),
                        'position' => array( 
                            'edge' => $pointer->edge, 
                            'align' => $pointer->align 
                        )
                    )
                );
                
        }

        return $this->screen( $pointers );
    }

    public function screen( $pointers = array() ) {

        if ( ! $pointers || ! is_array( $pointers ) )
            return;

        $dismissed = explode( ',', (string) get_user_meta( get_current_user_id(), 'dismissed_wp_pointers', true ) );

        foreach ( $pointers as $pointer_id => $pointer ) {

            if ( in_array( $pointer_id, $dismissed ) )
                unset( $pointers[ $pointer_id ] );
        }

        return array_values( $pointers );
    }


    public function add( $title, $description = '' ) {
        $term = wp_insert_term( $title, 'lifeguard_contents', array(
                'description'=> $description
        ));

        if ( is_wp_error( $term ) )
            return false;

        return $term['term_id'];
    }


    public function restart( $pointers = array() ) {
        $user_id = get_current_user_id();

        $dismissed = $dismissed_bak = explode( ',', (string) get_user_meta( $user_id, 'dismissed_wp_pointers', true ) );

        for ( $i = 0; $i < sizeof( $pointers ); $i++ ) {
            foreach ( $dismissed as $key => $value ) {
                if ( $pointers[$i]['pointer_id'] == $value ) 
                    unset( $dismissed[$key] );
            }
        }

        $dismissed = implode( ',', $dismissed );

        update_user_meta( $user_id, 'dismissed_wp_pointers', $dismissed );

        return true; 
    }

}

}