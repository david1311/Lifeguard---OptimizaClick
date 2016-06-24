<?php
global $wpdb;

$insert_posts= array(
        'post_title'    => '¿Como agregar una página?',
        'post_name'     => 'como-agregar-una-pagina',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/como-agregar-una-pagina.ldb', FILE_USE_INCLUDE_PATH)
);

$insert_posts= array(
        'post_title'    => '¿Como creo una entrada?',
        'post_name'     => 'como-creo-una-entrada',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/como-creo-una-entrada.ldb', FILE_USE_INCLUDE_PATH)
);

$insert_posts= array(
        'post_title'    => '¿Como edito una pagina?',
        'post_name'     => 'como-edito-una-pagina',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/como-edito-una-pagina.ldb', FILE_USE_INCLUDE_PATH)
);

$insert_posts= array(
        'post_title'    => '¿Como edito una entrada?',
        'post_name'     => 'como-edito-una-entrada',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/como-edito-una-entrada.ldb', FILE_USE_INCLUDE_PATH)
);

$insert_posts= array(
        'post_title'    => '¿Que puedo hacer?',
        'post_name'     => 'que-puedo-hacer',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/que-puedo-hacer.ldb', FILE_USE_INCLUDE_PATH)
);

$insert_posts= array(
        'post_title'    => '¿Como añadir un producto?',
        'post_name'     => 'como-añadir-un-producto',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/como-añadir-un-producto.ldb', FILE_USE_INCLUDE_PATH)
);

$insert_posts= array(
        'post_title'    => '¿Como utilizo el editor visual?',
        'post_name'     => 'como-utilizo-el-editor-visual',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/como-utilizo-el-editor-visual.ldb', FILE_USE_INCLUDE_PATH)
);

$insert_posts= array(
        'post_title'    => '¿Como manejo mis pedidos?',
        'post_name'     => 'como-manejo-mis-pedidos',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/como-manejo-mis-pedidos.ldb', FILE_USE_INCLUDE_PATH)
);

$insert_posts= array(
        'post_title'    => '¿Como edito un producto?',
        'post_name'     => 'como-edito-un-producto',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/como-edito-un-producto.ldb', FILE_USE_INCLUDE_PATH)
);

$insert_posts= array(
        'post_title'    => '¿Como puedo gestionar las categorías?',
        'post_name'     => 'como-puedo-gestionar-las-categorias',
        'post_type'     => 'tutopti_pointer',
        'post_status'   => 'publish',
        'post_content'  =>  file_get_contents('txt/como-puedo-gestionar-las-categorias.ldb', FILE_USE_INCLUDE_PATH)
);

wp_insert_post( $insert_posts );



?>
