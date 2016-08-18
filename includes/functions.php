<?php
function change_footer_admin () {return '&nbsp;';}
add_filter('admin_footer_text', 'change_footer_admin', 9999);
function change_footer_version() {
require_once('user_help.php');
}
add_filter( 'update_footer', 'change_footer_version', 9999);

function wpb_custom_logo() {
?><style type="text/css">
#wpadminbar #wp-admin-bar-wp-logo > .ab-item .ab-icon:before {
background-image: url("<?php echo get_home_url();?>/wp-content/plugins/Lifeguard---OptimizaClick/assets/images/logo_admin.png") !important;
background-position: 0 0;
color:rgba(0, 0, 0, 0); }
#wpadminbar #wp-admin-bar-wp-logo.hover > .ab-item .ab-icon {
background-position: 0 0; }
</style><?php
}

add_action('wp_before_admin_bar_render', 'wpb_custom_logo');

function lifeguard_is_active() {
    if ( get_option( '_lifeguard_status' ) != 'active' )
        return false;

    return true;
}


if( !function_exists("update_extra_post_info") ) {
function update_extra_post_info() {
  register_setting( 'extra-post-info-settings', 'extra_post_info' );
    }
}

$filters = array('pre_term_description', 'pre_link_description', 'pre_link_notes', 'pre_user_description');
foreach ( $filters as $filter ) {
    remove_filter($filter, 'wp_filter_kses');
}

