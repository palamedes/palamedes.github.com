$(function() {

  // Initialize the lightbox
  $('.fancybox').fancybox();

  // Added a drop down menu openMenu event
  $(".dropdown").on('openMenu', function() {
    $(this).siblings().trigger('closeMenu');
    $(this).addClass('open');
    $(this).children('i.icon').removeClass('fa-angle-right').addClass('fa-angle-down');
    $(this).children('.menu').removeClass('hidden');
  });

  // Add a drop down menu closeMenu event
  $(".dropdown").on('closeMenu', function() {
    $(this).removeClass('open');
    $(this).children('i.icon').addClass('fa-angle-right').removeClass('fa-angle-down');
    $(this).children('.menu').addClass('hidden');
  });

  // Add an onclick to the various drop down menus
  $(".dropdown").on('click', function() {
    if ($(this).hasClass('open')) {
      $(this).trigger('closeMenu');
    } else {
      $(this).trigger('openMenu');
    }
  });

  // Portfolio page tabs
  $(".tab").on('click', function() {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
    $('div.canvas div.post').removeClass('active');
    $('div.canvas div.post' + $(this).attr('href')).addClass('active');
    return false;
  });

  // Add an onclick for the gallery small sizer
  $(".gallery.sizer.small").on('click', function() {

    $(this).parent().parent().find('img.thumb').removeClass('large').addClass('small');
  });

  // Add an onclick for the gallery large sizer
  $(".gallery.sizer.large").on('click', function() {
    $(this).parent().parent().find('img.thumb').removeClass('small').addClass('large');
  });

  // Clear console
  setTimeout(function(){ console.clear(); }, 3000);

  $(document).on('keyup', function(event) {
    if (event.keyCode == 37) {
      $('a.prev-post')[0].click();
    }
    if (event.keyCode == 39) {
      $('a.next-post')[0].click();
    }
  });

});
