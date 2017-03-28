// Initialize List for list.js
var options = {
    valueNames: [ 'city', 'state' ],
    page: 7
};
var userList = new List('wrapper', options);

// Show error message if no city found, else update list
function process() {
    if (userList.visibleItems.length == 0) {
        $( "#error_message" ).fadeTo(2000, 1);
    }
    $('table.table-fill tr').each(function(n, row) {
        var $row = $(row);
        var domRow = $(row)[0];
        var city = "window.document.location='city.html?city=" + $row.find('td:eq(0)').text().replace(/\s+/g, '') + "';";
        row.setAttribute("class", "clickable-row");
        row.setAttribute("onclick", city);
    });
}

// Scroll in list of cities
window.smoothScroll = function(target) {
    document.getElementById("user_input").focus();
    reddit.style.display = 'none';
    yelp.style.display = 'none';
    var scrollContainer = target;
    do { // find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { // find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    targetY += 5;

    scroll = function(c, a, b, i) {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function(){ scroll(c, a, b, i); }, 20);
    }
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0); // start scrolling
}

// Fade-in logo and animate search bar movement to top
$(document).ready(function() {
    $("input").on("click", function(e) {
        e.preventDefault();
        var $div = $('div.s-bar');
        $div.animate({
            top: '0%',
            marginBottom: - $div.height()
        }, 1000 );
        $( "#logo_wide" ).fadeTo(2000, 1);
    });
});

// Scroll to top before reload
var toScroll = true;
window.onbeforeunload = function() {
    toScroll = false;
    $(window).scrollTop(0);
}

// Scroll to list page when threshold reached
var reached = false;
if (!reached) {
    $(document).on('scroll', function() {
      if ($(this).scrollTop() >= 100 && !reached) {
          reached = true;
          $("#user_input").click();
      }
    });
}

// Prevent scrolling on list page
$(function() {
    var scrollPoint = $(window).height();
    var scrolledPast = false;
    $(window).scroll(function() {
        if (toScroll) {
            $(window).scrollTop() > scrollPoint ? scrolledPast = true : '';
            scrolledPast ? $(window).scrollTop(scrollPoint) : '';
        }
    }).scroll();
});

// Link to corresponding city page for cities in list
$('table.table-fill tr').each(function(n, row) {
    var $row = $(row);
    var domRow = $(row)[0];
    var city = "window.document.location='city.html?city=" + $row.find('td:eq(0)').text().replace(/\s+/g, '') + "';";
    row.setAttribute("class", "clickable-row");
    row.setAttribute("onclick", city);
});

// Refresh city page as search updates
$( "#user_input" ).keypress(function() {
    $('table.table-fill tr').each(function(n, row) {
        var $row = $(row);
        var domRow = $(row)[0];
        var city = "window.document.location='city.html?city=" + $row.find('td:eq(0)').text().replace(/\s+/g, '') + "';";
        row.setAttribute("class", "clickable-row");
        row.setAttribute("onclick", city);
    });
    $( "#error_message" )[0].style.opacity = '0';
});
