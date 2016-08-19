<?php global $post;?>
<?php $home = get_home_url();?>

<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="http://www.optimizaclick.com" style="padding-top:5px;"><img src="<?php echo $home;?>/wp-content/plugins/Lifeguard---OptimizaClick/assets/images/logo-optimiza.png"></a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="active"><a href="<?php echo get_home_url();?>"><?php echo get_bloginfo( 'name' );?> <span class="sr-only">(current)</span></a></li>
        <li><a href="<?php echo $home;?>/wp-admin/edit.php">Entradas</a></li>
        <li><a href="<?php echo $home;?>/wp-admin/edit.php?post_type=page">Páginas</a></li>
          <?php
            if ( class_exists( 'WooCommerce' ) ) {?>
           <li><a href="<?php echo $home;?>/wp-admin/post-new.php?post_type=product">Añadir producto</a></li>
           <li><a href="<?php echo $home;?>/wp-admin/edit.php?post_type=shop_order">Pedidos</a></li>
          <?php } ?>
           <li style="background: #006277;font-weight: 900;"><a href="#"><i class="fa fa-user" aria-hidden="true"></i> Panel de clientes</a></li>
      </ul>
      <ul class="nav navbar-nav" style="padding: 8px 30px 0px 0px;float: right;">
          <input type="text" id="searchButton" placeholder="Introduce aquí tu busqueda"></input>
          <button type="button" id="goto"><i class="fa fa-search" aria-hidden="true"></i></button>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
