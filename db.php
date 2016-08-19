<?php
wp_insert_term(
    'Tutorial - Productos',   
    'lifeguard_contents', 
    array(
        'description' => '<i class="fa fa-shopping-bag"></i> PRODUCTOS',
        'slug'        => 'tutorial-productos',
    ));
         
         wp_insert_term(
    'Tutorial - Entradas',   
    'lifeguard_contents', 
    array(
        'description' => '<i class="fa fa-hashtag"></i> ENTRADAS',
        'slug'        => 'tutorial-entradas',
    ));
          wp_insert_term(
    'Tutorial - Paginas',  
    'lifeguard_contents',
    array(
        'description' => '<i class="fa fa-sticky-note"></i> PAGINAS',
        'slug'        => 'tutorial-paginas',
    ));
          wp_insert_term(
    'Tutorial - Gestor',  
    'lifeguard_contents',
    array(
        'description' => '<i class="fa fa-shopping-cart"></i> PEDIDOS',
        'slug'        => 'tutorial-gestor',
    ));
           wp_insert_term(
    'Tutorial - Mail',  
    'lifeguard_contents', 
    array(
        'description' => '<i class="fa fa-envelope"></i> CUENTAS DE CORREO',
        'slug'        => 'tutorial-correo',
    ));
           
       
         
 


$producto = get_term_by('slug', 'tutorial-productos', 'lifeguard_contents'); 
$productos = $producto->term_id;

$entrada = get_term_by('slug', 'tutorial-entradas', 'lifeguard_contents'); 
$entradas = $entrada->term_id;

$pagina = get_term_by('slug', 'tutorial-paginas', 'lifeguard_contents'); 
$paginas = $pagina->term_id;

$gestor = get_term_by('slug', 'tutorial-gestor', 'lifeguard_contents'); 
$gestores = $gestor->term_id;

$correo = get_term_by('slug', 'tutorial-correo', 'lifeguard_contents'); 
$correos = $correo->term_id;
         
    // PAGINAS - TUTORIALES
     
     
      $my_post = array(
  'post_title'    => '¿Como puedo gestionar las categorías?',
  'post_content'  => file_get_contents('includes/txt/como-puedo-gestionar-las-categorias.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $paginas ),
);
wp_insert_post( $my_post );
    
      $my_post = array(
  'post_title'    => '¿Como agregar una página?',
  'post_content'  => file_get_contents('includes/txt/como-agregar-una-pagina.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $paginas ),
); 
wp_insert_post( $my_post );

      $my_post = array(
  'post_title'    => '¿Como edito una pagina?',
  'post_content'  => file_get_contents('includes/txt/como-edito-una-pagina.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $paginas ),
); 
wp_insert_post( $my_post );


$my_post = array(
  'post_title'    => '¿Como utilizo el editor visual?',
  'post_content'  => file_get_contents('includes/txt/como-utilizo-el-editor-visual.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $paginas ),
); 
wp_insert_post( $my_post );

$my_post = array(
  'post_title'    => '¿Que puedo hacer?',
  'post_content'  => file_get_contents('includes/txt/que-puedo-hacer.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $paginas ),
); 
wp_insert_post( $my_post );
                 
   

        
        // ENTRADAS - TUTORIALES
        
        
        
        
        $my_post = array(
  'post_title'    => '¿Como creo una entrada?',
  'post_content'  => file_get_contents('includes/txt/como-creo-una-entrada.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $entradas ),
); 
wp_insert_post( $my_post );

$my_post = array(
  'post_title'    => '¿Como puedo gestionar las categorías?',
  'post_content'  => file_get_contents('includes/txt/como-puedo-gestionar-las-categorias.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $entradas ),
); 
wp_insert_post( $my_post );

$my_post = array(
  'post_title'    => '¿Como edito una entrada?',
  'post_content'  => file_get_contents('includes/txt/como-edito-una-entrada.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $entradas ),
); 
wp_insert_post( $my_post );
      
        
        // PRODUCTOS - TUTORIALES
        

$my_post = array(
  'post_title'    => '¿Como añadir un producto?',
  'post_content'  => file_get_contents('includes/txt/como-añadir-un-producto.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $productos ),
); 
wp_insert_post( $my_post );

$my_post = array(
  'post_title'    => '¿Como edito un producto?',
  'post_content'  => file_get_contents('includes/txt/como-edito-un-producto.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $productos ),
); 
wp_insert_post( $my_post );   
               
        
        
        // PEDIDOS - TUTORIALES
        
        
        
$my_post = array(
  'post_title'    => '¿Como veo mis pedidos?',
  'post_content'  => file_get_contents('includes/txt/como-veo-mis-pedidos.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $gestores ),
);
wp_insert_post( $my_post );
$my_post = array(
  'post_title'    => '¿Como manejo mis pedidos?',
  'post_content'  => file_get_contents('includes/txt/como-manejo-mis-pedidos.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $gestores ),
); 
wp_insert_post( $my_post );
                 
        
        
        // CONFIGURAR CUENTA DE CORREO
        
        

$my_post = array(
  'post_title'    => '¿Como configuro mi cuenta de correo?',
  'post_content'  => file_get_contents('includes/txt/como-configurar-correo.ldb', FILE_USE_INCLUDE_PATH),
  'post_status'   => 'publish',
  'post_author'   => 1,
  'post_type' => 'lifeguard_pointer',
  'tax_input' => array( 'lifeguard_contents' => $correos ),
);

wp_insert_post( $my_post );

?>