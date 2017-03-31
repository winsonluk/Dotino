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
                    createDot(csv, tempText, j, k);
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

function createDot(csv, tempText, j, k) {
    switch (j) {
        case 0:
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var title = (JSON.parse(this.responseText))['data']['children'][0]['data']['title'];
                    var url = (JSON.parse(this.responseText))['data']['children'][0]['data']['url'];
                    var num_comments = (JSON.parse(this.responseText))['data']['children'][0]['data']['num_comments'];
                    switch (k) {
                        case 0:
                            tempText.className = 'text-top';
                            tempText.innerHTML = 'REPLIES:\<br\>' + num_comments;
                            break;
                        case 1:
                            tempText.className = 'text-middle';
                            tempText.innerHTML = title;
                            break;
                        case 2:
                            tempText.className = 'text-bottom';
                            tempText.innerHTML = '/r/' + location.search.split('?')[1];
                            break;
                  }
                }
            };
            xhttp.open("GET", "https://api.reddit.com/by_id/t3_" + csv[i]['parent'], true);
            xhttp.send();
            break;
        case 1:
            switch (k) {
                case 0:
                    tempText.className = 'text-top';
                    tempText.innerHTML = 'SCORE:\<br\>' + csv[i]['score'];
                    break;
                case 1:
                    tempText.className = 'text-middle';
                    var comment = csv[i]['comment'];
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
                        tempText.innerHTML = removeLink(comment.substring(lower, upper));
                    } else {
                        tempText.innerHTML = removeLink(comment);
                    }
                    break;
                case 2:
                    tempText.className = 'text-bottom';
                    tempText.innerHTML = 'POSTED:\<br\>' + timeConverter(csv[i]['time']);
                    break;
            }
            break;
        case 2:
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                    console.log(this.responseText);
            };
            xhttp.open("GET", "https://api.yelp.com/v3/businesses/thin-and-craft-san-diego", true);
            xhttp.setRequestHeader("Authorization", "Bearer V1EiegiHur2A14Qa9ll54v_I5_iS5SA3hSsIczZKBFj_GEV1kg4sJhAWb9FmeEa69vppLLFPpeio2mDmrVMxjA9-K8z6J1cs4thVJA05Vsq8U7I4CubaafvI3KjdWHYx");
            xhttp.send(null);
            break;
    }
}
