import configparser
import json


from flask import Flask, request


import yelp


app = Flask(__name__)


# allow cross-domain uploads (CORS)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'https://dotino.com')
    return response


# GET from https://api.dotino.com/yelp?business=RESTAURANT_ID_HERE to return Yelp restaurant info
@app.route('/yelp')
def get_business():
    business = request.args.get('business')
    bearer_token = yelp.obtain_bearer_token(yelp.API_HOST, yelp.TOKEN_PATH)
    return json.dumps(yelp.get_business(bearer_token, business))


@app.route('/')
def home():
    return 'For usage information regarding the Dotino API, please visit https://github.com/winsonluk/Dotino/blob/master/README.md'

if __name__ == '__main__':
    app.run()
