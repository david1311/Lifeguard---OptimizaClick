<div id="mySidenav" class="sidenav"><a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
<?php require_once("header.php");?>

<div class="style">
<?php

# Sacamos los post que se almacenan en el tutorial

$values = get_posts(array(
  'post_type' => 'lifeguard_pointer',
  'numberposts' => -1,
  'order'    => 'ASC',
  'orderby' => 'parent',
  'tax_query' => array(
    array(
      'taxonomy' => 'lifeguard_contents',
      'field' => 'slug',
      'order'    => 'DESC',
      'orderby' => 'name',
      'terms' => array('tutorial-productos',
                       'tutorial-paginas',
                       'tutorial-entradas',
					   'tutorial-gestor',
					   'tutorial-correo',),//
      'category'         => '',
      'include_children' => true
    )
  )
));
?>
<?php $title_final=null;?>

<div id="tuto_content">
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
            <h1><i class="fa fa-question-circle" aria-hidden="true"></i> PREGUNTAS <span style="color:#0184a1;font-weight:900;">FRECUENTES</span></h1>
            <h5>"Si tienes mas dudas <strong>despues</strong> de seguir el tutorial, aquí tienes unos <strong>pequeños aputes</strong> para que puedas guiarte."</h5>
            </div><!-- /input-group -->
        </div><!-- /.col-lg-6 -->
        <?php
foreach($values as $value) {
   $titles = get_the_terms($value->ID, 'lifeguard_contents',array("order"=>"ASC"));
   foreach($titles as $title) {
    if($title->description!=$title_final) {
      echo '<h2> ' . $title->description .'<a href="#tuto_content" class="up"><i class="fa fa-caret-square-o-up"></i></a></h2>';    
    }
  $title_final=$title->description;
   }

?>
            <div class="acc-container">
            <div class="acc-btn"><h4><i class="fa fa-plus-square"></i> <span class="one"><?php echo $value->post_title; ?></span></h4></div>
               <div class="acc-content">
                <div class="acc-content-inner">
                <p><?php echo $value->post_content;?></p>
              </div>
            </div>
        </div>
 
    <?php  } ?>

</div>
		
    </div>

    </div>
</div> 
	<div class="ayuda" onclick="openNav()">
		<a class="tooltips" href="#"><i class="fa fa-life-ring"></i><span>¿Necesitas ayuda?</span></a>
	</div>
</div>
</div>

