$(document).ready(function() {
    document.getElementById("title").innerHTML = "/r/" + location.search.split('?')[1];
    d3.csv("yelp.csv", function(csv) {
        csv = csv.filter(function(row) {
            return row['subreddit'] == location.search.split('?')[1].toLowerCase();
        })
        length = csv.length;
        for (i = 0; i < length; i++) {
            tempRow = document.createElement('div');
            tempRow.className = 'dotrow';
            var rowId = 'dotrow' + i;
            tempRow.id = rowId;
            document.getElementsByTagName('body')[0].appendChild(tempRow);
            for (j = 0; j < 3; j++) {
                tempContainer = document.createElement('div');
                tempContainer.className = 'container';
                containerId = rowId + '-container' + j;
                tempContainer.id = containerId;
                tempDot = document.createElement('div');
                tempDot.className = 'circle';
                switch (j) {
                    case 0:
                        tempDot.style.backgroundImage = 'url(img/circle_question.png)';
                        tempDot.id = containerId + '-questiondot' + j;
                        break;
                    case 1:
                        tempDot.style.backgroundImage = 'url(img/circle_reddit.png)';
                        tempDot.id = containerId + '-redditdot' + j;
                        break;
                    case 2:
                        tempDot.style.backgroundImage = 'url(img/circle_yelp.png)';
                        tempDot.id = containerId + '-yelpdot' + j;
                        break;
                }
                for (k = 0; k < 3; k++) {
                    tempText = document.createElement('div');
                    switch (k) {
                        case 0:
                            tempText.className = 'text-top';
                            tempText.innerHTML = 'SCORE:\<br\>' + csv[i]['score'];
                            break;
                        case 1:
                            tempText.className = 'text-middle';
                            var comment = removeLink(csv[i]['comment']);
                            var totalChars = 300;
                            var halfNumChars = totalChars / 2;
                            var yelpIndex = comment.indexOf("yelp.com/biz/");
                            var lower = yelpIndex - halfNumChars;
                            var upper = yelpIndex + halfNumChars;
                            if (upper > comment.length) {
                                lower = lower - (upper - comment.length);
                                upper = comment.length;
                            } else if (lower < 0) {
                                upper = upper + Math.min(comment.length - upper, Math.abs(lower));
                            }
                            if (lower < 0) {
                                comment = "..." + comment.substring(3);
                            }
                            if (upper == totalChars) {
                                comment = comment.substring(0, upper - 3) + "...";
                            }
                            lower = Math.max(0, lower);
                            tempText.innerHTML = comment.substring(lower, upper);
                            break;
                        case 2:
                            tempText.className = 'text-bottom';
                            tempText.innerHTML = 'POSTED:\<br\>' + timeConverter(csv[i]['time']);
                            break;
                    }
                    tempDot.appendChild(tempText);
                }
                tempContainer.appendChild(tempDot);
                tempRow.appendChild(tempContainer);
            }
        }
    });
});

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
    var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

function removeLink(link) {
    return link.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').replace(/\[|\]|\(|\)/g, ' ');
}
