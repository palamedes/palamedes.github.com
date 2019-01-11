// Quick way to change certain things
var blockSelector = "article.block";
var canvasSelector = "section.canvas";
var pagePostSelector = "article.page,article.post";

// Some variables we will need later
var actualBlockWidthHeight = 0;
var columnCount = 0;
var rows = [];
var blocks = [];
// This is protection against runaway js
var maxExecutions = 100;
var curExecution = 0;

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

  // initialize the page block sizes
  sizeBlocksToPage();
  // Now display the blocks
  displayBlocks();
  // In the event we have a page or a post, then do that
  displayPagePost();
  // Lets add an onclick for anything NOT a link within a block
  $(blockSelector).not('.nav, a').on('click', function() {
    location.assign($($(this).find('a.main-link')[0]).attr('href'));
  });

  // Make the gallery sizer icons work
  $('.gallery.sizer.large').on('click', function() {
    $('img.gallery.thumb.small').removeClass('small').addClass('large');
  });
  $('.gallery.sizer.small').on('click', function() {
    $('img.gallery.thumb.large').removeClass('large').addClass('small');
  });

});

// Add a ms wait for resizing so we don't flood the browser with resize requests
var rtime, timeout = false, delta = 500;
$(window).resize(function() {
  rtime = new Date();
  if (timeout === false) { timeout = true; setTimeout(windowResizeEndEvent, delta); }
});
// Function that will fire once the resize is done, not while it's moving.
function windowResizeEndEvent() {
  if (new Date() - rtime < delta) { setTimeout(windowResizeEndEvent, delta); } else { timeout = false;
    curExecution = 0;
    sizeBlocksToPage();
    displayBlocks();
    displayPagePost();
  }
}

// Unlike other crappy grids, this one will try to size the article blocks to the page dynamically before
// setting the 1x1, 1x2, 2x2, etc.. sizes.
function sizeBlocksToPage() {
  // Reset some variables
  rows = [];
  blocks = [];
  // Remove all sizing and positioning from our blocks
  $(blockSelector).css('width', '');
  $(blockSelector).css('height', '');
  $(blockSelector).css('top', '');
  $(blockSelector).css('left', '');
  $(blockSelector).css('position', 'relative');
  // Determine the minWidth of the object from CSS
  var minWidth = parseInt($(blockSelector).css('min-width'));
  // Now use that min width to set a percentage instead of a pixel count -- this makes the browser do the work of
  // getting us what our size should be instead of using javascripts jacked up math
  $(blockSelector).css('min-width', 100/Math.floor($(canvasSelector).width() / minWidth) + '%');
  // Store column count for later use
  columnCount = Math.floor($(canvasSelector).width() / minWidth);
  // Get the actual size, minus one.  Again to account for funky JS math
  actualBlockWidthHeight = parseInt($(blockSelector).first().outerWidth()) - 1;
  // Set the height/width to that actual block size (they are square by default and get resized later)
  $(blockSelector).css('width', actualBlockWidthHeight);
  $(blockSelector).css('height', actualBlockWidthHeight);
  // Reset the min-width back to what it was so we don't lose that.
  $(blockSelector).css('min-width', minWidth);
  // Adjust the size of the blocks based on the "size" attribute as assigned by the md file
  $(blockSelector).each(function(index) {
    var blockSize = "";
    if ($(this).data('size') != undefined) {
      blockSize = $(this).data('size').split('x');
    }
    if (blockSize == "") { blockSize = [1,1]; }
    // Get our block requested width and height (in "blocks")
    var width = parseInt(blockSize[0]), height = parseInt(blockSize[1]);
    // if our width is wider than our number of columns then you must pair it down or it will go forever
    if (width > columnCount) { width = columnCount; }
    // If our width or height is more than one block then show the expert.
    if (width > 1) { $(this).css('width', $(this).outerWidth() * width); $(this).addClass('exerpt'); }
    if (height > 1) { $(this).css('height', $(this).outerHeight() * height); $(this).addClass('exerpt'); }
    // If this is a text block, then show the exerpt
    if ($(this).find('main').hasClass('text')) { $(this).addClass('exerpt'); }
  });

  // In theory we now have the blocks in their correct location, so lets set that location with hard top/lefts
  // and then set the position absolute -- this fixes shifting on browser resize which looks ugly
  $(blockSelector).each(function() {
    $(this).css('left', $(this).position().left);
    $(this).css('top', $(this).position().top);
  });
  // Now set them all absolute.  We must do this AFTER we position, or it will jack up the positioning as it
  // steps through each one to set the top/left values.
  $(blockSelector).css('position', 'absolute');
}

// iterate through all the blocks and find a place for them in our array and place them there
function displayBlocks() {
  blocks = $(blockSelector).toArray();
  // Initialize Rows Array with at least one row.
  initializeRow(0);
  // Now step through the blocks and place them (A while loop was killing things)
  var times = blocks.length;
  for (var t = 0; t < times; t++) {
    var block = blocks.shift();
    placeBlock(block);
  }
}

// Lets display our page/post.
function displayPagePost() {
  $(pagePostSelector).css('width', $(canvasSelector).width() - $(blockSelector).first().outerWidth());
  $(pagePostSelector).css('left', $(blockSelector).first().outerWidth());
}

// Find a place for this block based on its size in the rows array, move it to that position and make it visible.
function placeBlock(block) {
  var row = 0, col = 1;
  // Look at our rows array ~ find a place for our new block
  var blockSize = "";
  // Get the blocks size and pay attention to that
  if ($(block).data('size') != undefined) {
    blockSize = $(block).data('size').split('x');
  }
  if (blockSize == "") { blockSize = [1,1]; }
  var width = parseInt(blockSize[row]), height = parseInt(blockSize[col]);
  // if our width is wider than our number of columns then you must pair it down or it will go forever
  if (width > columnCount) { width = columnCount; }
  // Find a spot in the array
  var rowColumn = findPosition(width,height);
  if (rowColumn) {
    // Claim the spots if not false
    if (claimPosition(rowColumn[row],rowColumn[col],width,height)) {
      // Move the block to this location
      $(block).css('top', rowColumn[row] * actualBlockWidthHeight);
      $(block).css('left', rowColumn[col] * actualBlockWidthHeight);
      // Show the block
      $(block).css('display', 'block');
    }
  }
}

// Find the first available position for this block in the array both in the x and y direction.
function findPosition(width,height) {
  if (width == undefined || height == undefined) { return false; }
  for (var r = 0; r < rows.length; r++) {
    for (var c = 0; c < columnCount; c++) {
      if (testPosition(r,c,width,height)) {
        return [r,c];
      }
    }
  }
  return false;
}

// Test to see if the found position will work for our width/height of this block
function testPosition(row,column,width,height) {
  if (row == undefined || column == undefined || width == undefined || height == undefined) { return false; }
  if (initializeRow(row + 1)) {
    var results = true;
    for (var h = 0; h < height; h++) {
      for (var w = 0; w < width; w++){
        if (rows[row + h][column + w] != 0) {
          results = false;
        }
      }
    }
    return results;
  }
  return false;
}

// In our rows array mark the following spots as used
function claimPosition(row,column,width,height) {
  if (row == undefined || column == undefined || width == undefined || height == undefined) { return false; }
  for (var h = 0; h < height; h++) {
    for (var w = 0; w < width; w++){
      rows[row + h][column + w] = 1;
    }
  }
  return true;
}

// We need to be able to dynamically grow rows
function initializeRow(row) {
  if (row == undefined) { return false; }
  if (rows[row] == undefined) {
    rows[row] = [];
    for (var col = 0; col < columnCount; col++) {
      rows[row][col] = 0;
    }
  }
  return true;
}

// @TODO 1x3 will break the world.  Why?
;
