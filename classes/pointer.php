<?php

if ( ! defined( 'ABSPATH' ) ) exit; 

if ( ! class_exists( 'lifeguard_Pointer' ) ) {

class lifeguard_Pointer {
    
    private static $instance;  

    public static function getInstance() {
        if ( !self::$instance ) {
            self::$instance = new lifeguard_Pointer();
        }

        return self::$instance;
    }

    public function all( $screen_id, $page_name ) {
        global $wpdb;

        $sql = "SELECT PointerID.meta_value AS 'pointer_id', Target.meta_value AS 'target', Edge.meta_value AS 'edge',";
        $sql .= " Align.meta_value AS 'align', Screen.meta_value AS 'screen_id',";
        $sql .= " OrderX.meta_value AS 'order', `ID` AS 'post_id', `post_content`, `post_title`";
        if ( lifeguard_is_active() ) 
            $sql .= " ,`term_taxonomy_id` AS 'collection'";
        $sql .= " FROM {$wpdb->posts}";
        $sql .= " JOIN {$wpdb->postmeta} PointerID ON {$wpdb->posts}.ID = PointerID.post_id"; 
        $sql .= " JOIN {$wpdb->postmeta} Target ON {$wpdb->posts}.ID = Target.post_id"; 
        $sql .= " JOIN {$wpdb->postmeta} Edge ON {$wpdb->posts}.ID = Edge.post_id"; 
        $sql .= " JOIN {$wpdb->postmeta} Align ON {$wpdb->posts}.ID = Align.post_id"; 
        $sql .= " JOIN {$wpdb->postmeta} Screen ON {$wpdb->posts}.ID = Screen.post_id"; 
        $sql .= " JOIN {$wpdb->postmeta} Page ON {$wpdb->posts}.ID = Page.post_id"; 
        $sql .= " JOIN {$wpdb->postmeta} OrderX ON {$wpdb->posts}.ID = OrderX.post_id"; 
        if ( lifeguard_is_active() )
            $sql .= " JOIN {$wpdb->term_relationships} ON {$wpdb->posts}.ID = {$wpdb->term_relationships}.object_id";
        $sql .= " WHERE {$wpdb->posts}.post_type = '%s'";
        $sql .= " AND PointerID.meta_key = '%s'";
        $sql .= " AND Target.meta_key = '%s'";
        $sql .= " AND Edge.meta_key = '%s'";
        $sql .= " AND Align.meta_key = '%s'";
        $sql .= " AND Screen.meta_key = '%s'";
        $sql .= " AND Screen.meta_value = '%s'";
        $sql .= " AND Page.meta_key = '%s'";
        $sql .= " AND Page.meta_value = '%s'";
        $sql .= " AND OrderX.meta_key = '%s'";
        $sql .= " AND {$wpdb->posts}.post_status = '%s'";
        $sql .= " ORDER BY CAST( OrderX.meta_value AS UNSIGNED ) ASC LIMIT 999";

        $pointers = $wpdb->get_results( 
            $wpdb->prepare( 
                $sql,  
                'lifeguard_pointer',
                '_lifeguard_id', 
                '_lifeguard_target', 
                '_lifeguard_edge', 
                '_lifeguard_align', 
                '_lifeguard_screen', 
                $screen_id,
                '_lifeguard_page',
                $page_name, 
                '_lifeguard_order', 
                'publish' 
            ) 
        );

        return $pointers;
    }

    public function add( $pointer = array() ) {
        $args = array(
            'post_title'    => $pointer['title'],
            'post_content'  => $pointer['content'],
            'post_status'   => 'publish', 
            'post_type'     => 'lifeguard_pointer',
            'post_author'   => get_current_user_id(),
            'tax_input'     => array( 'lifeguard_contents' => array( intval( $pointer['collection'] ) ) )
        );

        $post_id = wp_insert_post( $args );

        if ( !$post_id ) 
            return false;

        $metadata = array( 
            '_lifeguard_id' => uniqid(), 
            '_lifeguard_screen' => $pointer['screen'], 
            '_lifeguard_page' => $pointer['page'], 
            '_lifeguard_target'=> $pointer['target'], 
            '_lifeguard_edge' => $pointer['edge'], 
            '_lifeguard_align' => $pointer['align'], 
            '_lifeguard_order' => $pointer['order'], 
        );

        $meta_ids = array();
        foreach ( $metadata as $key => $value ) {
            $meta_ids[] = add_post_meta( $post_id, $key, $value );
        }

        if ( sizeof( $meta_ids ) != sizeof( $metadata ) ) 
            return false;

        return $post_id;
    }

    public function update( $pointer = array() ) {
        $args = array(
            'ID'            => $pointer['post_id'],
            'post_title'    => $pointer['title'],
            'post_content'  => $pointer['content'],
            'tax_input'     => array( 'lifeguard_contents' => array( intval( $pointer['collection'] ) ) )
        );

        $post_id = wp_update_post( $args );

        if ( !$post_id ) 
            return false;

        $metadata = array( 
            '_lifeguard_edge' => $pointer['edge'], 
            '_lifeguard_align' => $pointer['align'], 
            '_lifeguard_order' => $pointer['order'], 
        );

        $meta_ids = array();
        foreach ( $metadata as $key => $value ) {
            $meta_ids[] = update_post_meta( $post_id, $key, $value );
        }

        if ( sizeof( $meta_ids ) != sizeof( $metadata ) ) 
            return false;

        return $post_id;
    }

    public function delete( $id ) {
        $result = wp_delete_post( $id );

        if ( !$result )
            return false;

        return true;
    }

} 

}