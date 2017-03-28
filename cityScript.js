$(document).ready(function() {
    var cityLength = location.search.length;
    var subreddit = "https://api.reddit.com/r/" + location.search.substring(6, cityLength) + "/search?q=restaurant&restrict_sr=on";
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
          document.getElementById("display").innerHTML =
              this.responseText;
			}
		};
		xhttp.open("GET", subreddit, true);
  	xhttp.send();
});
