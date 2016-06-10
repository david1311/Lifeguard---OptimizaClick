
<div class="tuto_content">
        <h1>PREGUNTAS <span style="color:blue;font-weight:900;">FRECUENTES</span></h1>


        <p>Bienvenido a la ayuda de Optimizaclick, desde aquí tendra unas sencillas respuestas a preguntas que puedan surgirle.</p>
 <form action="" method="POST">
        <input type="text" name="query" />
        <input type="submit" name="submit" value="Search" />
    </form>
<div class="acc-container">
<div class="acc-btn"><h1 class="selected"><span class="dashicons dashicons-format-aside"></span> ¿Como editar un texto?</h1></div>
<div class="acc-content open">
  <div class="acc-content-inner">
    <p>Proin sodales, nibh eget sollicitudin consectetur, elit nisl malesuada urna, ac fermentum turpis urna id augue. Vestibulum eu consectetur nunc. In ultricies erat nisl, a fringilla risus viverra sed. Phasellus vel sodales elit. Morbi nec adipiscing dolor. Vivamus volutpat vitae velit vel sagittis.</p>
  </div>
</div>
</div>
<div class="acc-btn"><h1><span class="dashicons dashicons-format-image"></span> ¿Como subir una foto?</h1></div>
<div class="acc-content">
  <div class="acc-content-inner">
    <p>Nulla facilisi. Proin sodales dolor in odio lacinia, ut venenatis massa lobortis. Morbi congue dignissim nisi gravida consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed egestas diam. Nunc ut mauris tempus, rutrum massa vel, pellentesque velit. Nullam eget diam sit amet diam pretium scelerisque. Nunc sed odio nisi. Nunc odio est, rhoncus vitae risus a, sagittis ultrices mauris. Fusce scelerisque posuere pulvinar.</p>
  </div>
</div>

<div class="acc-btn"><h1><span class="dashicons dashicons-admin-network"></span> ¿Como no se que mas?</h1></div>
<div class="acc-content">
  <div class="acc-content-inner">
    <p>Praesent ultricies risus quis magna convallis, ac condimentum tellus laoreet. Donec dictum velit enim, nec hendrerit leo mattis sit amet.</p>
  </div>
</div>

<div class="acc-btn"><h1><span class="dashicons dashicons-format-status"></span> ¿No se me ocurre nada?</h1></div>
<div class="acc-content">
  <div class="acc-content-inner">
    <p>Fusce eget ultricies ante. In augue urna, rhoncus ac tellus non, porta malesuada magna. Nulla tincidunt orci in metus rhoncus, at malesuada quam varius. Mauris sed tincidunt massa, ut cursus magna. Pellentesque cursus sapien turpis, id blandit magna tempus at.</p>
  </div>
</div>
</div>
    <div>
  <p>
    <label class="btn" for="modal-1">Opciones de usuario</label>
    <label class="btn btn--blue" for="modal-2">Paginas de ayuda</label>
  </p>
</div>
<input class="modal-state" id="modal-1" type="checkbox" />
<div class="modal">
  <label class="modal__bg" for="modal-1"></label>
  <div class="modal__inner">
    <label class="modal__close" for="modal-1"></label>
    <h2>Desde aqui puedes habilitar opciones de usuarios</h2>

<button class="restart">Reiniciar</button>
<script>
if(jQuery("input[@name='restart']:checked").val() == 'A') {
jQuery.cookie('key', '', { expires: -1 });}</script>
<?php 
?>
    
  </div>
</div>

<input class="modal-state" id="modal-2" type="checkbox" />
<div class="modal">
  <label class="modal__bg" for="modal-2"></label>
  <div class="modal__inner">
    <label class="modal__close" for="modal-2"></label>
    <h2>Ayuda</h2>
    <p><a href="#">Visual Composer</a></p>
  </div>
</div>
    </div>