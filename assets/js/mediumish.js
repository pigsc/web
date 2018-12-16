jQuery(document).ready(function($){
  var offset = 1250;
  var duration = 800;

  jQuery(window).scroll(function() {
    if (jQuery(this).scrollTop() > offset) {
      jQuery('.back-to-top').fadeIn(duration);
    } else {
      jQuery('.back-to-top').fadeOut(duration);
    }
  });
  jQuery('.back-to-top').click(function(event) {
    event.preventDefault();
    jQuery('html, body').animate({scrollTop: 0}, duration);
    return false;
  })

  // alertbar later
  $(document).scroll(function () {
    var y = $(this).scrollTop();
    if (y > 280) {
      $('.alertbar').fadeIn();
    } else {
      $('.alertbar').fadeOut();
    }
  });

  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('nav').outerHeight();

  $(window).scroll(function(event){
    didScroll = true;
  });

  setInterval(function() {
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 250);

  function hasScrolled() {
    var st = $(this).scrollTop();
    var brandrow = $('.brandrow').css("height");

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
    return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
      // Scroll Down
      $('nav').removeClass('nav-down').addClass('nav-up');
      $('.nav-up').css('top', - $('nav').outerHeight() + 'px');

    } else {
      // Scroll Up
      if(st + $(window).height() < $(document).height()) {
        $('nav').removeClass('nav-up').addClass('nav-down');
        $('.nav-up, .nav-down').css('top', '0px');
      }
    }

    lastScrollTop = st;
  }


  $('.site-content').css('margin-top', $('header').outerHeight() + 'px');
});
