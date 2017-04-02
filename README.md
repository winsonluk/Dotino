# Dotino

**Restaurants when they are mentioned, not when they're marketed.**

&nbsp;

## Implementation

### Website

This website is hosted at https://dotino.com on [Google Firebase](https://firebase.google.com), with the domain registered on [NameBright](https://namebright.com). The frontend is written in JavaScript with jQuery. Dotino uses [D3.js](https://d3js.org) to parse the CSV file with Reddit comment information and [List.js](listjs.com) to search cities and subreddits. Cities and their corresponding subreddits were retrieved from [/r/LocationReddits](https://www.reddit.com/r/locationreddits), and all Reddit comments containing the string "yelp.com/biz/" were queried using SQL with [Google BigQuery](https://bigquery.cloud.google.com/table/fh-bigquery:reddit_comments.all) and saved as a flat CSV file. Only subreddits that are categorized as a "locational" subreddit **and** have at least one mention of "yelp.com/biz/" are included in this version of Dotino.

The local CSV file only contains data regarding the comment itself, and not the question it was written as a reply to, so the question's data is retrieved from https://api.reddit.com using *by_id*. Restaurant data is retrieved from https://api.dotino.com, which uses the [Yelp Fusion API](https://www.yelp.com/developers).

### API

The server is hosted at https://api.dotino.com with [Google App Engine](https://cloud.google.com/appengine). The backend is written in Python with the [Flask](http://flask.pocoo.org) web framework and designed to work with the [Yelp Fusion API](https://www.yelp.com/developers). The SSL certificate was obtained from [LetsEncrypt](https://letsencrypt.org).

### The Dotino Logo

The logo is an SVG created with [Sketch](https://www.sketchapp.com).

&nbsp;

## Usage

### Website

Visit https://dotino.com (with Tracking Protection disabled to enable compatibility with the Reddit API) and search for your desired city. Find restaurants mentioned on social media and click the question or the comment to see its context. Click the Yelp dot for more information about the restaurant.

Dotino has been optimized for desktop, tablet, and mobile usage. The motion background and navigation bar links to Privacy, Terms, and Contact are hidden on screen sizes 768 pixels and below to enhance mobile usability. Please access Dotino on a larger screen to experience the full website.

### API

**Obtain Yelp business information for a specific restaurant with its Yelp business ID.**

GET from https://api.dotino.com/yelp?business=BUSINESS_ID_HERE to return Yelp restaurant info in JSON. https://api.dotino.com currently only accepts CORS from https://dotino.com.

**Response Body ([from the Yelp Fusion API documentation](https://www.yelp.com/developers/documentation/v3))**
~~~~
{
  "id": "gary-danko-san-francisco",
  "name": "Gary Danko",
  "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/--8oiPVp0AsjoWHqaY1rDQ/o.jpg",
  "is_claimed": false,
  "is_closed": false,
  "url": "https://www.yelp.com/biz/gary-danko-san-francisco",
  "price": "$$$$",
  "rating": 4.5,
  "review_count": 4521,
  "phone": "+14152520800",
  "photos": [
    "http://s3-media3.fl.yelpcdn.com/bphoto/--8oiPVp0AsjoWHqaY1rDQ/o.jpg",
    "http://s3-media2.fl.yelpcdn.com/bphoto/ybXbObsm7QGw3SGPA1_WXA/o.jpg",
    "http://s3-media3.fl.yelpcdn.com/bphoto/7rZ061Wm4tRZ-iwAhkRSFA/o.jpg"
  ],
  "hours": [
    {
      "hours_type": "REGULAR",
      "open": [
        {
          "is_overnight": false,
          "end": "2200",
          "day": 0,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 1,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 2,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 3,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 4,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 5,
          "start": "1730"
        },
        {
          "is_overnight": false,
          "end": "2200",
          "day": 6,
          "start": "1730"
        }
      ],
      "is_open_now": false
    }
  ],
  "categories": [
    {
      "alias": "newamerican",
      "title": "American (New)"
    }
  ],
  "coordinates": {
    "latitude": 37.80587,
    "longitude": -122.42058
  },

  "location": {
    "address1": "800 N Point St",
    "address2": "",
    "address3": "",
    "city": "San Francisco",
    "state": "CA",
    "zip_code": "94109",
    "country": "US",
    "display_address": [
      "800 N Point St",
      "San Francisco, CA 94109"
    ],
    "cross_streets": "Hyde St & Larkin St"
  },
  "transactions": ["restaurant_reservation"]
}
~~~~

**Name**|**Type**|**Description**
:-----:|:-----:|:-----:
categories|object[]|A list of category title and alias pairs associated with this business.
categories[x].alias|string|Alias of a category, when searching for business in certain categories, use alias rather than the title.
categories[x].title|string|Title of a category for display purpose.
coordinates|object|The coordinates of this business.
coordinates.latitude|decimal|The latitude of this business.
coordinates.longitude|decimal|The longitude of this business.
display\_phone|string|Phone number of the business formatted nicely to be displayed to users. The format is the standard phone number format for the business's country.
hours|object[]|Opening hours of the business.
hours[x].is\_open\_now|boolean|Whether the business is currently open or not.
hours[x].hours\_type|string|The type of the opening hours information. Right now, always return REGULAR.
hours[x].open|object[]|The detailed opening hours of each day in a week.
hours[x].open[x].day|int|From 0 to 6, representing day of the week from Monday to Sunday. Notice that you may get the same day of the week more than once if the business has more than one opening time slots.
hours[x].open[x].start|string|Start of the opening hours in a day, in 24-hour clock notation, like 1000 means 10 AM.
hours[x].open[x].start|string|Start of the opening hours in a day, in 24-hour clock notation, like 1000 means 10 AM.
hours[x].open[x].end|string|End of the opening hours in a day, in 24-hour clock notation, like 2130 means 9:30 PM.
hours[x].open[x].is\_overnight|boolean|Whether the business opens overnight or not. When this is true, the end time will be lower than the start time.
id|string|Yelp ID of this business.
image\_url|string|URL of photo for this business.
is\_claimed|bool|Whether business has been claimed by a business owner
is\_closed|bool|Whether business has been (permanently) closed
location|object|The location of this business, including address, city, state, zip code and country.
location.address1|string|Street address of this business.
location.address2|string|Street address of this business, continued.
location.address3|string|Street address of this business, continued.
location.city|string|City of this business.
location.country|string|ISO 3166-1 alpha-2 country code of this business.
location.cross\_streets|string|Cross streets for this business.
location.display\_address|string[]|Array of strings that if organized vertically give an address that is in the standard address format for the business's country.
location.state|string|ISO 3166-2 State code of this business.
location.zip\_code|string|Zip code of this business.
name|string|Name of this business.
phone|string|Phone number of the business.
photos|object[]|URLs of up to three photos of the business.
price|string|Price level of the business. Value is one of $, $$, $$$ and $$$$.
rating|decimal|Rating for this business (value ranges from 1, 1.5, ... 4.5, 5).
review\_count|int|Number of reviews for this business.
url|string|URL for business page on Yelp.
transactions|string[]|A list of Yelp transactions that the business is registered for. Current supported values are "pickup", "delivery", and "restaurant\_reservation".

*If you would like to host your own API, add your Yelp Fusion API key to config.ini.EXAMPLE and rename the file to config.ini.*
