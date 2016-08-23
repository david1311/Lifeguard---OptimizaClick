<?php
/*
Plugin Name: LifeGuard Optimiza
Plugin URI: http://www.optimizaclick.com
Description: Ayuda de usuarios, manuales, y otras muchas opciones.
Author: Departamento de Desarrollo - Optimizaclick 
Author URI: http://www.optimizaclick.com
Version: 1.2.1
Copyright: 2016 - 2xxx
*/


if ( ! defined( 'ABSPATH' ) ) exit; 

if ( ! class_exists( 'WP_Custom_Pointers' ) ) {

class WP_Custom_Pointers {

    private $pointer_obj;
    private $collection_obj;
    public $version = '1.2.1';
    public $remote_version;
    public $plugin_path;
    public $plugin_uri;
    public $current_screen;
    public $plugin_name = 'LifeGuard Optimiza - Desarrollado por Optimizaclick';

    function __construct() {
        define( 'lifeguard_VERSION', $this->version );
        add_action( 'init', array( $this, 'register_taxonomy' ) );
        add_action( 'admin_notices', array( $this, 'admin_notices' ) );
        spl_autoload_register( array( $this, 'autoload' ) );
 
        add_action( 'admin_init', array( $this, 'init' ) );
        add_action( 'admin_bar_menu', array( $this, 'admin_bar_node'), 999 );
        add_action( 'admin_menu', array( $this, 'admin_menu' ) );
        add_action( 'admin_enqueue_scripts', array($this, 'admin_scripts'), 2000 );
        add_action( 'init', array( $this, 'register_post_type' ) );



      
        add_action( 'admin_footer', array( $this, 'hide_add_new_link' ) );
       
        register_activation_hook( __FILE__, array( $this, 'install') );
        register_deactivation_hook( __FILE__, array( $this, 'uninstall') );


  
        // Include required files
        add_action( 'plugins_loaded', array( $this, 'includes' ));
        add_action( 'update_option__lifeguard_version', array($this, 'add_intro_notice') );
    }

    public function add_intro_notice() {
        update_user_meta( get_current_user_id(), 'dismiss_first_version_activation_notice_lifeguard', false );
    }

    public function autoload( $class ) {

        $name = explode( '_', $class );

        if ( isset( $name[1] ) ) {
            $class_name = strtolower( $name[1] );

            $filename = dirname( __FILE__ ) . '/classes/' . $class_name . '.php';

            if ( file_exists( $filename ) ) {
                require_once $filename;
            }
        }
    }
    
    public function init() {
        $this->plugin_path = dirname( __FILE__ );
        $this->plugin_uri = plugins_url( '', __FILE__ );

        $ajax = new lifeguard_Ajax();
        $this->pointer_obj = lifeguard_Pointer::getInstance();
        $this->collection_obj = lifeguard_Collection::getInstance();
    }
    
    public function register_taxonomy() {
        $labels = array(
            'name'                => _x( 'Categorias', 'lifeguard' ),
            'singular_name'       => _x( 'Categoria', 'lifeguard' ),
            'search_items'        => __( 'Buscar Categorias' ),
            'all_items'           => __( 'Todas las categorias' ),
            'parent_item'         => __( 'Categorias unidas' ),
            'parent_item_colon'   => __( 'Categorias emparejadas:' ),
            'edit_item'           => __( 'Editar categoria' ), 
            'update_item'         => __( 'Actualizar Categoria' ),
            'add_new_item'        => __( 'Añadir nueva categoria' ),
            'new_item_name'       => __( 'Añadir nombre de categoria' ),
            'menu_name'           => __( 'Categorias' )
        );    

        $args = array(
            'hierarchical'        => true,
            'labels'              => $labels,
            'show_ui'             => true,
            'show_admin_column'   => true,
            'query_var'           => true,
            'rewrite'             => array( 'slug' => 'lifeguard_contents' )
        );
                register_taxonomy( 'lifeguard_contents', array( 'lifeguard_pointer' ), $args );
    }
    
    public function install() {
            $this->add_intro_notice();  
    }
    
    

    
	
    /**
     * Uninstall
     */
    public function uninstall() {
        $options = array(  
                '_lifeguard_version',
                '_lifeguard_status',
                '_lifeguard_preloads_ran',
                '_lifeguard_term_id_self',
                '_lifeguard_status',
                '_lifeguard_sk'
            );

        foreach ( $options as $option ) {
            delete_option( $option );
        }

        global $wpdb;

        $sql = "SELECT `ID` FROM {$wpdb->posts} WHERE `post_type` = '%s'";
        $pointers = $wpdb->get_results( $wpdb->prepare( $sql, 'lifeguard_pointer' ) );

        foreach( $pointers as $pointer ) {
            wp_delete_post( $pointer->ID );
        }

        $sql = "SELECT {$wpdb->terms}.term_id FROM {$wpdb->terms}";
        $sql .= " JOIN {$wpdb->term_taxonomy} ON {$wpdb->terms}.term_id = {$wpdb->term_taxonomy}.term_id";
        $sql .= " WHERE {$wpdb->term_taxonomy}.taxonomy = '%s'";
        $collections = $wpdb->get_results( $wpdb->prepare( $sql, 'lifeguard_contents' ) );

        foreach( $collections as $collection ) {
            wp_delete_term( $collection->term_id, 'lifeguard_contents' );
        }
        
        $user_ID = get_current_user_id();
        
        delete_user_option( $user_ID, 'dismiss_coupon_reminder_lifeguard' );
        delete_user_option( $user_ID, 'dismiss_sharing_reminder_lifeguard' );
    }


    public function admin_scripts() {
          if ( get_option( '_lifeguard_preloads_ran' ) != 1 ) {
            $this->preload();
            update_option( '_lifeguard_preloads_ran', 1 );
        }
        $this->current_screen = get_current_screen();

        // JS
        wp_enqueue_script( 'wp-pointer' );
        wp_enqueue_script( 'jquery-ui-core' );
        wp_enqueue_script( 'lifeguard_help', plugins_url( 'assets/js/prefixfree.min.js', __FILE__ ) );
        wp_enqueue_script( 'lifeguard_validate', plugins_url( 'assets/js/jquery.validate.min.js', __FILE__ ) );
        wp_enqueue_script( 'lifeguard-mousetrap', plugins_url( 'assets/js/mousetrap.min.js', __FILE__ ) );
        wp_enqueue_script( 'lifeguard-cookie', plugins_url( 'assets/js/jquery.cookie.min.js', __FILE__ ) );
        wp_enqueue_script( 'lifeguard-admin', plugins_url( 'assets/js/admin.js', __FILE__ ), '', '', true );
        wp_enqueue_script( 'lifeguard-create-auto-status', plugins_url( 'assets/js/create.auto.status.js', __FILE__ ), '', '', true );
        wp_enqueue_script( 'lifeguard-create-auto', plugins_url( 'assets/js/create.auto.js', __FILE__ ), '', '', true );
        wp_enqueue_script( 'lifeguard-create-manual', plugins_url( 'assets/js/create.manual.js', __FILE__ ), '', '', true );
        wp_enqueue_script( 'lifeguard-create', plugins_url( 'assets/js/create.js', __FILE__ ), '', '', true );
        wp_enqueue_script( 'lifeguard-pointer', plugins_url( 'assets/js/pointer.js', __FILE__ ), '', '', true );
        wp_enqueue_script( 'lifeguard-ayuda', plugins_url( 'assets/js/help.js', __FILE__ ), '', '', true );
        wp_localize_script( 'lifeguard-admin', 'lifeguard_Vars', array(
            'ajaxurl' => admin_url( 'admin-ajax.php' ),
            'nonce' => wp_create_nonce( 'lifeguard_nonce' ),
            'pointers' => $this->collection_obj->get( $this->current_screen->id, $this->get_page() ),
            'pointers_raw' => $this->collection_obj->get_raw(),
            'screen_id' => $this->current_screen->id,
            'page' => $this->get_page(),
            'splash_dismissed' => get_user_meta( get_current_user_id(), '_lifeguard_splash_dismissed' ),
            'active' => lifeguard_is_active() ? 'yes' : 'no'
        ) );

        // CSS
        wp_enqueue_style( 'wp-pointer' );
        wp_enqueue_style( 'jquery-ui', plugins_url( 'assets/css/jquery-ui-1.9.1.custom.css', __FILE__ ) );
        wp_enqueue_style( 'lifeguard-admin', plugins_url( 'assets/css/admin.css', __FILE__ ) );
        wp_enqueue_style( 'lifeguard-create', plugins_url( 'assets/css/create.css', __FILE__ ) );
        wp_enqueue_style( 'lifeguard-pointer', plugins_url( 'assets/css/pointer.css', __FILE__ ) );
     	wp_enqueue_style('font-awesome', plugins_url('assets/css/font-awesome.min.css',__FILE__ ));
        wp_enqueue_style('boootstrap', plugins_url('assets/css/bootstrap.css',__FILE__ )); 
        if ( lifeguard_is_active() ) {
            $this->contextual_help();
        }
    }




    public function includes() {
        require_once dirname( __FILE__ ) . '/includes/html.php';
        require_once dirname( __FILE__ ) . '/includes/functions.php';
         require_once dirname( __FILE__ ) . '/includes/preloads.php';
		  require_once dirname( __FILE__ ) . '/includes/updater.php';
    }

    public function admin_menu() {
        $capability = 'edit_posts'; 
        
        global $submenu;
        unset( $submenu['edit.php?post_type=lifeguard_pointer'][10] );
    }

//custom updates/upgrades


    public function hide_add_new_link() {
        if ( isset($_GET['post_type']) && $_GET['post_type'] == 'lifeguard_pointer' ) {
            ?> <style type="text/css"> #icon-edit + h2 .add-new-h2 { display:none; } </style> <?php
        }
    }


    public function admin_bar_node( $wp_admin_bar ) {

        $args = array(
            'id'    => 'lifeguard-parent',
            'title' => '',
            'href'  => '#',

        );
 
        $wp_admin_bar->add_node( $args );

        $args = array(
            'id'    => 'lifeguard-auto',
            'parent' => 'lifeguard-parent',
            'title' => 'Grabar acciones',
            'href'  => '#',
        );

        $wp_admin_bar->add_node( $args );
/*
        $args = array(
            'id'    => 'lifeguard-manual',
            'parent' => 'lifeguard-parent',
            'title' => 'Manual',
            'href'  => '#',
        );

        $wp_admin_bar->add_node( $args );
*/
   $args = array(
            'id'    => 'lifeguard-stop',
            'parent' => 'lifeguard-parent',
            'title' => 'Parar de grabar',
            'href'  => '#',
        );
     
       $wp_admin_bar->add_node( $args );
       
       
        $args = array(
            'id'    => 'lifeguard-dudas',
            'parent' => 'lifeguard-parent',
            'title' => 'Mail',
            'href'  => 'mailto:vdelrio@optimizaclick.com',
        );
    
       $wp_admin_bar->add_node( $args );
       
               $args = array(
            'id'    => 'lifeguard-restart',
            'parent' => 'lifeguard-parent',
            'title' => 'Reiniciar',
            'href'  => '#',
        );

        $wp_admin_bar->add_node( $args );
       
    }

function add_drafts_admin_menu_item() {
  add_posts_page(__('Drafts'), __('Drafts'), 'read', 'edit.php?post_status=draft&post_type=post');
}

   

    public function register_post_type() {
        $labels = array(
            'name' => 'Lifeguard',
            'singular_name' => 'Nota',
            'add_new' => 'Añadir nuevo',
            'add_new_item' => 'Añadir nueva nota',
            'edit_item' => 'Editar nota',
            'new_item' => 'Nueva nota',
            'all_items' => 'Todas las notas',
            'view_item' => 'Ver nota',
            'search_items' => 'Buscar notas',
            'not_found' =>  'No hay notas encontradas',
            'not_found_in_trash' => 'No hay notas en la papelera', 
            'parent_item_colon' => '',
            'menu_name' => 'Lifeguard'
        );

          $args = array(
            'labels' => $labels,
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => true, 
            'show_in_menu' => true, 
            'query_var' => true,
            'rewrite' => array( 'slug' => 'lifeguard_pointer' ),
            'capability_type' => 'post',
            'has_archive' => true, 
            'hierarchical' => false,
            'menu_position' => 82,
            'supports' => array(),
         'menu_icon' => plugins_url( '', __FILE__ ) . '/assets/images/menu-icon.png'
        ); 

        register_post_type( 'lifeguard_pointer', $args );
    }


   
    
    

    public function contextual_help() {
        if ( !$this->collection_obj->get_raw() )
            $content = lifeguard_contextual_help_content( false );
        else
            $content = lifeguard_contextual_help_content( true );

        $this->current_screen->add_help_tab( array( 
           'id' => 'lifeguard-help-tab',            
           'title' => __( 'Guia', 'lifeguard' ),      
           'content' => $content, 
        ) );
    }


    
    
    public function get_page() {
        global $pagenow, $post;

        if ( $post->ID && is_string( $post->ID ) ) 
            $page = $post->ID;
        else if ( $_GET['page'] ) 
            $page = $_GET['page'];
        else
            $page = $pagenow; 

        return $page;
    }

 
        
  public function preload() {
    
     global $post, $wpdb,$lifeguard_preloads;
        foreach ( $lifeguard_preloads as $preload ) {
            $this->pointer_obj->add( $preload );
        }
        include('db.php');
        }
        
        
       
        
    
    
    
    public function admin_notices() {
        
		$dismiss_coupon_reminder_lifeguard = get_user_option( 'dismiss_coupon_reminder_lifeguard' );
		$dismiss_sharing_reminder_lifeguard = get_user_option( 'dismiss_sharing_reminder_lifeguard' );
        $dismiss_first_version_activation_notice_lifeguard = get_user_option( 'dismiss_first_version_activation_notice_lifeguard' );
		
		if ( $_GET['dismiss_coupon_reminder_lifeguard'] == true ) {
		    update_user_meta( get_current_user_id(), 'dismiss_coupon_reminder_lifeguard', true );
		    return;
		}
		
		if ( $_GET['dismiss_sharing_reminder_lifeguard'] == true ) {
		    update_user_meta( get_current_user_id(), 'dismiss_sharing_reminder_lifeguard', true );
		    return;
		}

        if ( $dismiss_first_version_activation_notice_lifeguard == false ) {
            ?>
        
            <?php
            

            update_user_meta( get_current_user_id(), 'dismiss_first_version_activation_notice_lifeguard', true );
        }
		
		
		if ( get_current_screen()->parent_file == 'edit.php?post_type=lifeguard_pointer' ) {
    
            if ( get_bloginfo( 'version' ) < '4.0' ) { ?>
                <div class="error">
                    <p><?php _e( 'Necesitas una version superior para el funcionamiento correcto', 'lifeguard' ); ?></p>
                </div>
            <?php
            }
            ?>
        
        <?php if ( $dismiss_coupon_reminder_lifeguard == false ) : ?>
           
            

        <?php 
        
     
        endif;
        
        } 
    
    }

    public function verify() {
        $res = lifeguard_verify();

        if ( !$res ) {
            delete_option( '_lifeguard_status' );
            lifeguard_deactivate();
        }
    }

}

$GLOBALS['lifeguard'] = new WP_Custom_Pointers();



}
