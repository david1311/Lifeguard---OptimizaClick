<?php


//enqueues our locally supplied font awesome stylesheet



function change_footer_admin () {return '&nbsp;';}
add_filter('admin_footer_text', 'change_footer_admin', 9999);
function change_footer_version() {
require_once('user_help.php');
}
add_filter( 'update_footer', 'change_footer_version', 9999);




function wpb_custom_logo() {
?><style type="text/css">
#wpadminbar #wp-admin-bar-wp-logo > .ab-item .ab-icon:before {
background-image: url("<?php echo get_home_url();?>/wp-content/plugins/Optimiza_helpdesk/assets/images/logo_admin.png") !important;
background-position: 0 0;
color:rgba(0, 0, 0, 0); }
#wpadminbar #wp-admin-bar-wp-logo.hover > .ab-item .ab-icon {
background-position: 0 0; }
</style><?php
}

//hook into the administrative header output
add_action('wp_before_admin_bar_render', 'wpb_custom_logo');
/**
 * Deactivate this plugin
 *
 * @param string $serial_key
 * @return array
 */


/**
 * Checks if plugin is active
 *
 * @return boolean
 */
function tutopti_is_active() {
    if ( get_option( '_tutopti_status' ) != 'active' )
        return false;

    return true;
}


function bienvenida() {
global $current_user;
echo '<div class="welcome-panel-content">';
    echo'<h2>Bienvenido al panel de administracion de Optimizaclick</h2>';
        get_currentuserinfo();
     echo '<p class="about-description">Bienvenido ' . $current_user->user_login . "\n" . '</p></div>';
     echo '<div class="welcome-panel-column"><a class="button button-primary button-hero load-customize hide-if-no-customize" href="">Prueba</a>';
     echo '</div>';
     echo '<div class="welcome-panel-column">asdasd</div>';
     echo '<div class="welcome-panel-column welcome-panel-last">asdasd</div>';
}

remove_action('welcome_panel','wp_welcome_panel');
add_action('welcome_panel','bienvenida');

function bienvenida_init() {
global $wpdb;
$wpdb->update($wpdb->usermeta,array('meta_value'=>1),array('meta_key'=>'show_welcome_panel'));
}

add_action('after_switch_theme','st_welcome_init');






if( !function_exists("update_extra_post_info") ) {
function update_extra_post_info() {
  register_setting( 'extra-post-info-settings', 'extra_post_info' );
}
}
// Social Media Sharing Utility