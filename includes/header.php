<?php global $post;?>
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
      <a class="navbar-brand" href="#"><img src="<?php echo get_home_url();?>/wp-content/plugins/Optimiza_helpdesk/assets/images/logo_optimiza_4.png"></a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="active"><a href="<?php echo get_home_url();?>"><?php echo get_bloginfo( 'name' );?> <span class="sr-only">(current)</span></a></li>
        <li><a href="#">Prueba</a></li>
       
      </ul>
      <ul class="nav navbar-nav" style="padding-top:10px;">
          <input type="text" id="searchButton" placeholder="Introduce aquí tu busqueda"></input>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>

<script>
jQuery('#searchButton').keyup(function(){
  var jQuerypage = jQuery('.tuto_content p, h4');
  jQuerypage.each(function(i,a){
        jQuerya = jQuery(a)
      jQuerya.html(jQuerya.html().replace(/<em>/g,"").replace(/\<\/em\>/g,""))
    })
  var searchedText = jQuery('#searchButton').val();
  if(searchedText != ""){
    jQuerypage.each(function(i,a){
        jQuery( ".acc-content" ).removeClass("unactive").addClass( "activa" );
      jQuerya = jQuery(a)
      var html = jQuerya.text().replace(new RegExp("("+searchedText+")", "igm"), "<em>$1</em>")
      jQuerya.html(html)
    })
  }else if (searchedText == ""){
    jQuery( ".acc-content" ).removeClass("activa").addClass( "unactive" );
  }
});
</script>

