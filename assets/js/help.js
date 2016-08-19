function openNav() {
    document.getElementById("mySidenav").style.width = "100%";
}

/* Close/hide the sidenav */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}



jQuery('#searchButton').keyup(function(){
  var jQuerypage = jQuery('#tuto_content p, .acc-btn .one, .acc-content-inner');
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


jQuery('#goto').click(function(){
    jQuery(".acc-content-inner em").addClass("select");
    jQuery('.sidenav').animate({
      scrollTop: (jQuery('.select').first().offset().top)
    },1500);

});



jQuery(document).ready(function() {
    var offset = 220;
    var duration = 600;
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.up').fadeIn(duration);
        } else {
            jQuery('.up').fadeOut(duration);
        }
    });
    
    jQuery('.up').click(function(event) {
        event.preventDefault();
        jQuery('.sidenav').animate({scrollTop: 0}, duration);
        return false;
    })
});

