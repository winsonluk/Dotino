var options = {
  valueNames: [ 'city', 'state' ]
};

var userList = new List('wrapper', options);

function process() {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
          document.getElementById("display").innerHTML =
              this.responseText;
			}
		};
		xhttp.open("GET", "https://jsonplaceholder.typicode.com/posts", true);
  	xhttp.send();
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
        }, 1600 );
        $( "#logowide" ).fadeTo(3000, 1);
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
        }
    }).scroll();
});
