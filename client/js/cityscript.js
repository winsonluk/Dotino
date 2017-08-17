var i = 0;  // Dot row to load
var numRows = 100;  // Increasing this value may lead to more 502 errors
var loadedCSV;  // csv with 'comment', 'time', 'parent', 'score', 'child', 'subreddit', 'url'

// The arrays' index represents the dot row index, and increments when 1/3 of a dot is loaded
//
// When both dots are fully loaded (redditArray[i] == yelpArray[i] == 3),
// display the entire row of three dots.
var redditArray = Array.apply(null, Array(numRows)).map(Number.prototype.valueOf,0);
var yelpArray = Array.apply(null, Array(numRows)).map(Number.prototype.valueOf,0);

// Loads all Reddit and Yelp dots for one city with unique container and dot IDs
window.onload = function() {
    document.getElementById("title").innerHTML = "/r/" + location.search.split('?')[1];

    // finish loading csv before loading dots
    d3.queue().defer(function(callback) {

        // yelp.csv contains rows 'comment', 'time', 'parent', 'score', 'child', 'subreddit', 'url'
        d3.csv("yelp.csv", function(csv) {
            window.loadedCSV = csv.filter(function(row) {
                return row['subreddit'] == location.search.split('?')[1].toLowerCase();
            });
            callback(null);
        });
    }).await(function() { loopDots(); });
}

// Load a single row of dots and wait 5 seconds until next load to avoid 502 errors
// (the essential Allow-Origin header from api.dotino.com is skipped if requests are too frequent)
function loopDots() {
    if (loadedCSV.length == 0) {
        document.getElementById('spinner').style.display = "none";
        alert('Sorry, this city is not yet in our database.');
        return;
    }
    setTimeout(function () {
        tempRow = document.createElement('div');
        tempRow.className = 'dotrow';
        tempRow.id = 'dotrow' + i;
        document.getElementsByTagName('body')[0].appendChild(tempRow);

        // create three dots (Question (j = 0), Reddit (j = 1), and Yelp (j = 2))
        for (j = 0; j < 3; j++) {
            tempContainer = document.createElement('div');
            tempContainer.className = 'container';
            tempDot = document.createElement('div');
            tempDot.className = 'circle';
            switch (j) {
                case 0:
                    tempDot.style.backgroundImage = 'url(img/circle_question.png)';
                    break;
                case 1:
                    tempDot.style.backgroundImage = 'url(img/circle_reddit.png)';
                    break;
                case 2:
                    tempDot.style.backgroundImage = 'url(img/circle_yelp.png)';
                    break;
            }

            // create top (k = 0), middle (k = 1), and bottom (k = 2) divs of a single dot
            for (k = 0; k < 3; k++) {
                tempText = document.createElement('div');
                createDot(tempText, i, j, k);
                tempDot.appendChild(tempText);
            }
            tempContainer.appendChild(tempDot);
            tempRow.appendChild(tempContainer);
        }
        i++;

        // create dots until limit reached or no more comments for the subreddit are found
        if (i < numRows && loadedCSV[i] != null) {
            loopDots();
        } else {
            document.getElementById('spinner').style.display = "none";
        }
    }, 1000);
}

// Create a question (j = 0), Reddit (j = 1), or Yelp (j = 2) dot
// with top (k = 0), middle (k = 1), and bottom (k = 2) texts
// for a specified row number (curr)
function createDot(tempText, curr, j, k) {

    switch (j) {

        // Create question dot
        case 0:
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var title = (JSON.parse(this.responseText))
                                    ['data']['children'][0]['data']['title'];
                    var url = (JSON.parse(this.responseText))
                                    ['data']['children'][0]['data']['url'];
                    var num_comments = (JSON.parse(this.responseText))
                                    ['data']['children'][0]['data']['num_comments'];
                    switch (k) {

                        // number of replies to the question
                        case 0:
                            tempText.className = 'text-top';
                            tempText.innerHTML = 'REPLIES:\<br\>' + num_comments;
                            break;

                        // the text of the question
                        case 1:
                            tempText.className = 'text-middle';
                            tempText.innerHTML = '<h1><a href=\''
                                    + url.substring(0, url.length - 17)
                                    + '\' target=\"_blank\">'
                                    + title + '<\/h1>';
                            break;

                        // subreddit the question was asked in
                        case 2:
                            tempText.className = 'text-bottom';
                            tempText.innerHTML =
                                    'SUBREDDIT:\<br\>/r/' + location.search.split('?')[1];
                            break;
                    }

                    // load entire row if this dot and the Yelp dot are fully loaded
                    if (++redditArray[curr] == 3 && yelpArray[curr] == 3) {
                        loadDots(curr);
                    }
                }
            };
            xhttp.open("GET", "https://api.dotino.com/reddit?qstring=by_id/t3_"
            + loadedCSV[curr]['parent']);
            xhttp.send();
            break;

        // Create Reddit dot
        case 1:
            switch (k) {

                // score of the Reddit comment (may be negative)
                case 0:
                    tempText.className = 'text-top';
                    tempText.innerHTML = 'SCORE:\<br\>' + loadedCSV[curr]['score'];
                    break;

                // The text of the comment or totalChars, whichever is greater,
                // but the eventual excerpt will be LESS THAN totalChars after
                // links are removed.
                //
                // The excerpt is centered by iterating index from 0 to n
                // until the index is centered on "yelp.com/biz/" with a padding
                // of totalChars / 2 before and after index.
                //
                // This algorithm is O(n).
                case 1:
                    tempText.className = 'text-middle';
                    var comment = loadedCSV[curr]['comment'];
                    var totalChars = 300;
                    var halfNumChars = totalChars / 2;
                    if (comment.length > totalChars) {
                        var yelpIndex = comment.indexOf("yelp.com/biz/");
                        var index = halfNumChars;
                        while (index < yelpIndex && index + halfNumChars < comment.length) {
                            index++;
                        }
                        var lower = index - halfNumChars;
                        var upper = index + halfNumChars;
                        if (lower != 0) {
                            before = comment.substring(0, lower);
                            after = comment.substring(lower);
                            after = "..." + after.substring(3);
                            comment = before + after;
                        }
                        if (upper < comment.length) {
                            comment = comment.substring(0, upper - 3) + "...";
                        }
                        tempText.innerHTML = '<a href=\''
                                + loadedCSV[curr]['url']
                                + '\' target=\"_blank\">'
                                + removeLink(comment.substring(lower, upper));
                    } else {
                        tempText.innerHTML = '<a href=\''
                                + loadedCSV[curr]['url']
                                + '\' target=\"_blank\">'
                                + removeLink(comment);
                    }
                    break;


                // date and time the comment was posted (in human-readable form)
                case 2:
                    tempText.className = 'text-bottom';
                    tempText.innerHTML = 'POSTED:\<br\>' + timeConverter(loadedCSV[curr]['time']);
                    break;
            }
            break;

        // Create Yelp dot
        case 2:
            var comment = loadedCSV[curr]['comment'];
            var regex = /yelp\.com\/biz\/(.+?(?=[^-\w]|$))/;
            if (comment.match(regex) == null) {
                return;
            }
            business = comment.match(regex)[1];
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var yelpData = JSON.parse(this.responseText);
                    switch (k) {

                        // Yelp rating (0-5)
                        case 0:
                            tempText.className = 'text-top';
                            tempText.innerHTML = 'RATING:<br>' + yelpData['rating'];
                            break;


                        // Restaurant name (in <h1>) and address
                        case 1:
                            tempText.className = 'text-middle';
                            tempText.style.textAlign = 'center';
                            tempText.style.position = 'relative';
                            tempText.style.top = '0%';
                            try {
                                tempText.innerHTML = '<h1><a href=\''
                                        + yelpData['url'] + '\' target=\"_blank\">'
                                        + yelpData['name'] + '<\/h1><br>'
                                        + yelpData['location']['address1'] + '<br>'
                                        + yelpData['location']['city'] + ", "
                                        + yelpData['location']['state'] + " "
                                        + yelpData['location']['zip_code'];
                            } catch (error) {
                                tempText.innerHTML = 'Restaurant not found';
                            }
                            break;

                        // Yelp price ($ to $$$$)
                        case 2:
                            tempText.className = 'text-bottom';
                            tempText.style.paddingTop = '0%';
                            tempText.innerHTML = 'PRICE:<br>' + yelpData['price'];
                            break;
                    }

                    // load entire row if this dot and the Reddit dot are fully loaded
                    if (++yelpArray[curr] == 3 && redditArray[curr] == 3) {
                        loadDots(curr);
                    }
                }
            };
            xhttp.open("GET", "https://api.dotino.com/yelp?business=" + business);
            xhttp.send();
            break;
    }
}

// Display one dot row when it is fully loaded
function loadDots(rowToLoad) {
    var tempDotrow = 'dotrow' + rowToLoad;
    var jTempDotrow = '#' + tempDotrow;
    document.getElementById(tempDotrow).style.display = "block";
    jQuery("#spinner").detach().appendTo(jTempDotrow);
}

// Converts Unix time to human-readable time
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
    return time;
}

// Remove distracting Yelp links from Reddit comments
function removeLink(link) {
    return link.replace(/(?:https?):\/\/[\S\n]+/g, '').replace(/\[|\]|\(|\)/g, ' ');
}
