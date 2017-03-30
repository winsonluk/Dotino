$(document).ready(function() {
    document.getElementById("title").innerHTML = "/r/" + location.search.split('?')[1];
    d3.csv("yelp.csv", function(csv) {
        csv = csv.filter(function(row) {
            return row['subreddit'] == location.search.split('?')[1].toLowerCase();
        })
        console.log(csv);
    });
});
