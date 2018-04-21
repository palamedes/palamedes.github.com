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

  // Portfolio page -- Transition site to the right and out
  $("div.portfolio a.navigation.right").on('click', function() {
    // Fire transition
    transitionPortfolio(false);
    // Return nothing (don't follow the link)
    return false;
  });

  // Portfolio page -- Transition site to the right and out
  $("div.portfolio a.navigation.left").on('click', function() {
    // Fire transition
    transitionPortfolio(true);
    // Return nothing (don't follow the link)
    return false;
  });

  // Transition function to keep things dry
  transitionPortfolio = function(right) {
    // Clear the autotransition timeout.
    clearTimeout(autoTransition);
    // Get the showing site.
    showing = $('div.portfolio div.site.showing');
    // Now get the next waiting (or first if we need to roll around)
    waiting = ($('div.portfolio div.site.showing + div').length == 0) ? $('div.portfolio div.site.showing').parent().children('div:first') : $('div.portfolio div.site.showing + div');
    // Prep waiting
    waiting.addClass(((right)?'left':'right')).removeClass('waiting');
    // Give the prep enough time to fire, then set the class changes which uses css transitions to animate
    setTimeout(function() {
      showing.removeClass('showing').addClass(((right)?'right':'left'));
    },100);
    // Bring the waiting one in a tad later
    setTimeout(function() {
      waiting.addClass('showing').removeClass(((right)?'left':'right'));
    },400);
    // Okay now clean up - timeout is based on 0.5s css transition
    setTimeout(function() {
      showing.addClass('waiting').removeClass(((right)?'right':'left'));
    },650);
    // Resetup our autotransition
    autoTransition = setTimeout(function() {
      transitionPortfolio(false);
    }, 10000);
  };

  // Setup our autotransition
  autoTransition = setTimeout(function() {
    transitionPortfolio(false);
  }, 10000);

  // Clear console
  setTimeout(function(){ console.clear(); }, 5000);
  
});
