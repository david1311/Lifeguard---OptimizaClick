<?php
global $lifeguard_preloads, $post, $wpdb;
$lifeguard_preloads = array(
	array(
        
        // PANEL DE ADMINISTRACION
        
        'order' => 1,
        'screen' => 'dashboard', 
        'page' => 'index.php',
        'target' => '.wrap h1', 
        'title' => 'Bienvenido',
        'content' => 'Este es tu panel de administración, desde aquí podrás controlar toda la información de tu pagina web.A través de unos sencillos pasos podrás aprender como utilizarlo.',
        'edge' => 'top',
        'align' => 'middle',

	),
    	array(
        'order' => 2,
        'screen' => 'dashboard', 
        'page' => 'index.php',
        'target' => '#menu-dashboard a div:nth-child(3)', 
        'title' => 'Bienvenido',
        'content' => 'Aquí tienes el menú desde el cual podrás administrar todas las opciones.Empecemos!',
        'edge' => 'left', 
        'align' => 'middle',

	),
        array(
        'order' => 3,
        'screen' => 'dashboard', 
        'page' => 'index.php',
        'target' => '#menu-pages a div:nth-child(3)', 
        'title' => 'Páginas',
        'content' => 'Las paginas de tu web están aquí, así que si necesitas cambiar un texto o una imagen de tu web, este es el lugar.',
        'edge' => 'left', 
        'align' => 'middle', 
	),
        array(
        'order' => 4,
        'screen' => 'dashboard', 
        'page' => 'index.php',
        'target' => '#toplevel_page_woocommerce a div:nth-child(3)', 
        'title' => 'Páginas',
        'content' => 'Principalmente desde este panel manejaras los pedidos de tu tienda.',
        'edge' => 'left', 
        'align' => 'middle', 
	),
        array(
        'order' => 5,
        'screen' => 'dashboard', 
        'page' => 'index.php',
        'target' => '#menu-posts-product a div:nth-child(3)', 
        'title' => 'Productos',
        'content' => 'Ya estamos terminando con la visión básica del menú, ya que estamos en productos que sera el ultimo punto que tendrás que modificar. Mas tarde podrás ver como puedes agregar y editar productos.',
        'edge' => 'left', 
        'align' => 'middle', 
	),
        array(
        'order' => 6,
        'screen' => 'dashboard', 
        'page' => 'index.php',
        'target' => '#menu-posts-product a div:nth-child(3)', 
        'title' => 'Productos',
        'content' => 'Ya estamos terminando con la visión básica del menú, ya que estamos en productos que sera el ultimo punto que tendrás que modificar. Mas tarde podrás ver como puedes agregar y editar productos.',
        'edge' => 'left', 
        'align' => 'middle', 
	),
        
        
        // ENTRADAS
        
        
        array(
        'order' => 1,
        'screen' => 'edit-post', 
        'page' => 'edit.php',
        'target' => '.row-title', 
        'title' => 'Tu blog',
        'content' => 'Bien!, ya estas en las entradas de tu blog, pronto descubrirás lo sencillo que es agregar una entrada o editar una creada.',
        'edge' => 'top', 
        'align' => 'middle', 
       
	),
         array(
        'order' => 2,
        'screen' => 'edit-post', 
        'page' => 'edit.php',
        'target' => '.page-title-action', 
        'title' => 'Crear una entrada',
        'content' => 'Vamos a añadir tu primera entrada de blog, es tan sencillo como hacer click en "Añadir Nueva"', 'Añadir Nueva Entrada.',
        'edge' => 'top', 
        'align' => 'middle', 
       
	),
        array(
        'order' => 3,
        'screen' => 'edit-post', 
        'page' => 'edit.php',
        'target' => '.edit a', 
        'title' => 'Editar una entrada',
        'content' => 'En caso de que ya tengas una entrada creada en el blog y quieras editarla solo tienes que irte encima del apartado que necesites y hacer click en el apartado "Editar.',
        'edge' => 'top', 
        'align' => 'middle',
        'collection' => 'tutorial-entradas'
        
	),
          
        
        // MEDIOS
        
        
         array(
        'order' => 1,
        'screen' => 'upload', 
        'page' => 'upload.php',
        'target' => '.page-title-action', 
        'title' => 'Galería',
        'content' => 'Aquí tienes todos los contenidos que hay incluidos en tu web, ya sean fotos, videos u otros datos.',
        'edge' => 'top', 
        'align' => 'middle', 
       
	),
         
         array(
        'order' => 2,
        'screen' => 'upload', 
        'page' => 'upload.php',
        'target' => '#media-search-input', 
        'title' => 'Añadir objeto',
        'content' => 'Para añadir una imagen o vídeo lo único que tienes que hacer es arrastrarlo de tu escritorio al navegador y el archivo se subirá automáticamente.',
        'edge' => 'top', 
        'align' => 'middle', 
      
	),
            
        
        // PAGINAS - LISTADO
        
        
         array(
        'order' => 1,
        'screen' => 'edit-page', 
        'page' => 'edit.php',
        'target' => '#title a', 
        'title' => 'Listado de páginas',
        'content' => 'Empezamos viendo el listado de todas las paginas que están creadas en la web. A continuación aprenderemos a gestionarlas.',
        'edge' => 'top', 
        'align' => 'middle', 
        
	),
        array(
        'order' => 2,
        'screen' => 'edit-page', 
        'page' => 'edit.php',
        'target' => '#title a', 
        'title' => 'Editar páginas',
        'content' => 'Al igual que vimos en las entradas, seguiremos el mismo procedimiento, en el cual, desde el apartado "Añadir Nueva" agregaremos una nueva pagina y desde "Editar" podremos modificar una existente.',
        'edge' => 'top', 
        'align' => 'middle', 
       
	),
               
        
        // PRODUCTOS - LISTADO
        
        
         array(
        'order' => 1,
        'screen' => 'edit-product', 
        'page' => 'edit.php',
        'target' => '#name a', 
        'title' => 'Tus productos',
        'content' => 'El listado que se visualiza a continuación forma parte de tu tienda, ya que aquí se muestran todos tus productos, el funcionamiento es simple ya que sigue el mismo procedimiento de paginas y entradas.',
        'edge' => 'top', 
        'align' => 'middle', 
   
	),
            array(
        'order' => 2,
        'screen' => 'edit-product', 
        'page' => 'edit.php',
        'target' => '.colspanchange', 
        'title' => 'Crear y Editar',
        'content' => 'En este apartado crear los productos es de una forma diferente, para ello tienes que coger un producto cualquiera, ponerte encima de el y clickar en el apartado de "Duplicar", para "Editar" es de la misma manera, pinchando en el boton de "Editar',
        'edge' => 'top', 
        'align' => 'middle', 
        
	),
                        
        
        // PEDIDOS - LISTADO
        
        
         array(
        'order' => 1,
        'screen' => 'edit-shop_order', 
        'page' => 'edit.php',
        'target' => '#order_title a', 
        'title' => 'Tus productos',
        'content' => 'Desde este apartado vas a controlar los pedidos que se realicen en la web.',
        'edge' => 'top', 
        'align' => 'middle', 
        
	));
         
?>