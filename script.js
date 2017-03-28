var options = {
    valueNames: [ 'city', 'state' ],
    page: 10
};

var userList = new List('wrapper', options);

function process() {
    if (userList.visibleItems.length == 0) {
        $( "#error_message" ).fadeTo(2000, 1);
    }
}

window.smoothScroll = function(target) {
    document.getElementById("user_input").focus();
    reddit.style.display = 'none';
    yelp.style.display = 'none';
    var scrollContainer = target;
    do { //find scroll container
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { //find the top of target relatively to the container
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    targetY += 5;

    scroll = function(c, a, b, i) {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function(){ scroll(c, a, b, i); }, 20);
    }
    // start scrolling
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}

$(document).ready(function() {
    $("input").on("click", function(e) {
        e.preventDefault();
        var $div = $('div.s-bar');
        $div.animate({
            top: '0%',
            marginBottom: - $div.height()
        }, 1000 );
        $( "#logowide" ).fadeTo(2000, 1);
    });
});

var toScroll = true;
window.onbeforeunload = function() {
    toScroll = false;
    $(window).scrollTop(0);
}

var reached = true;
if (reached) {
$(document).on('scroll', function() {
  if ($(this).scrollTop() >= 100 && reached) {
      reached = false;
      $("#user_input").click();
  }
});
}

$(function() {
    var scrollPoint = $(window).height();
    var scrolledPast = false;
    $(window).scroll(function() {
        if (toScroll) {
        $(window).scrollTop() > scrollPoint ? scrolledPast = true : '';
        $(window).scrollTop() < scrollPoint && scrolledPast == true ? $(window).scrollTop(scrollPoint) : '';
        $(window).scrollTop() > scrollPoint && scrolledPast == true ? $(window).scrollTop(scrollPoint) : '';
        }
    }).scroll();
});

$('table.table-fill tr').each(function(n, row) {
    var $row = $(row);
    var domRow = $(row)[0];
    var city = "window.document.location='city.html?city=" + $row.find('td:eq(0)').text().replace(/\s+/g, '') + "';";
    row.setAttribute("class", "clickable-row");
    row.setAttribute("onclick", city);
});

$( "#user_input " ).keypress(function() {
$('table.table-fill tr').each(function(n, row) {
    var $row = $(row);
    var domRow = $(row)[0];
    var city = "window.document.location='city.html?city=" + $row.find('td:eq(0)').text().replace(/\s+/g, '') + "';";
    row.setAttribute("class", "clickable-row");
    row.setAttribute("onclick", city);
});
});

/*
$row.find('th:last').after('<th>Enquire</th>');
$row.find('td:last').after('<td><a class="mailenquiry" href="mailto:foo@foo.co.uk?subject=Enquiry about ' + module + ' on ' + date + '">Enquire</a></td>');
*/
