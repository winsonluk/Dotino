$(document).ready(function() {
    document.getElementById("title").innerHTML = "/r/" + location.search.split('?')[1];
    d3.csv("yelp.csv", function(csv) {
        csv = csv.filter(function(row) {
            return row['subreddit'] == location.search.split('?')[1].toLowerCase();
        })
        length = csv.length;
        var temp;
        for (i = 0; i < length; i++) {
            temp = document.createElement('div');
            temp.className = 'dotrow';
            temp.innerHTML = csv[i];

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
                tempDot.style.opacity = "0.3";
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
                        case 1:
                            tempText.className = 'text-middle';
                        case 2:
                            tempText.className = 'text-bottom';
                    }
                    tempDot.appendChild(tempText);
                }
                tempContainer.appendChild(tempDot);
                tempRow.appendChild(tempContainer);
            }
        }
    });
});
