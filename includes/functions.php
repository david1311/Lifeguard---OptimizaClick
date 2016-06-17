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
background-image: url("<?php echo get_home_url();?>/wp-content/plugins/Optimiza_helpdesk/assets/images/logo_admin.png") !important;
background-position: 0 0;
color:rgba(0, 0, 0, 0); }
#wpadminbar #wp-admin-bar-wp-logo.hover > .ab-item .ab-icon {
background-position: 0 0; }
</style><?php
}

add_action('wp_before_admin_bar_render', 'wpb_custom_logo');

function tutopti_is_active() {
    if ( get_option( '_tutopti_status' ) != 'active' )
        return false;

    return true;
}


if( !function_exists("update_extra_post_info") ) {
function update_extra_post_info() {
  register_setting( 'extra-post-info-settings', 'extra_post_info' );
    }
}



//SE ACTIVAN LAS ACTIVIDADES CRON DEL PLUGIN AL SER ACTIVADO
register_activation_hook(__FILE__, 'activate_cron_accions');

//SE ASOCIA UNA FUNCION AL ACTIVARSE EL PLUGIN
function activate_cron_accions() 
{
	//SE REGISTRA UNA ACCION PARA QUE SE EJECUTE DIARIAMENTE
    if (! wp_next_scheduled ( 'optimiza_notifications' )) 
		wp_schedule_event(time(), 'daily', 'optimiza_notifications');
	
	//SE REGISTRA UNA ACCION PARA QUE SE EJECUTE 2 VECES AL DIA
	if (! wp_next_scheduled ( 'optimiza_plugin_auto_update' )) 
		wp_schedule_event(time(), 'twicedaily', 'optimiza_plugin_auto_update');	
}

//SE ASOCIAN LAS FUNCIONES QUE REALIZARAN LAS ACCIONES DE LAS ACTIVIDADES DEL CRON
add_action('optimiza_notifications', 'send_notifications_wp');

add_action('optimiza_plugin_auto_update', 'check_update_optimiza_plugin');

//SE ASOCIA UNA FUNCION AL DESACTIVAR EL PLUGIN
register_deactivation_hook(__FILE__, 'deactivate_cron_accions');

//SE CANCELAN LAS ACTIVIDADES CRON DEL PLUGIN AL SER DESACTIVADO
function deactivate_cron_accions() 
{
	wp_clear_scheduled_hook('optimiza_plugin_auto_update');
	wp_clear_scheduled_hook('optimiza_notifications');
}


//FUNCION QUE DEVUELVE LA VERSION ACTUAL DEL PLUGIN INSTALADO
function get_version_plugin()
{
	if ( ! function_exists( 'get_plugins' ) ) 
        require_once ABSPATH . 'wp-admin/includes/plugin.php';
	
	$plugins = get_plugins(); 
	
	return $plugins['Optimiza-Helpdesk/tutopti.php']["Version"];
}	

//FUNCION QUE DEVUELVE LA VERSION ACTUAL DEL PLUGIN EN EL RESPOSITORIO DE GITHUB O LA URL DE DESCARGA
function get_repository_values($data)
{	
	$content = file_get_contents(respository_url);
	
	$values = explode("|", $content);
	
	if($data == "version")
		return $values[0];
	else
		return $values[1]; 
}


