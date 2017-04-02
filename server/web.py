import configparser
import json


from flask import Flask, request
from flask.ext.cors import CORS, cross-origin


import yelp


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# GET from https://api.dotino.com/yelp?business=RESTAURANT_ID_HERE to return Yelp restaurant info
@app.route('/yelp')
@cross_origin()
def get_business():
    business = request.args.get('business')
    bearer_token = yelp.obtain_bearer_token(yelp.API_HOST, yelp.TOKEN_PATH)
    return json.dumps(yelp.get_business(bearer_token, business))


@app.route('/')
@cross_origin()
def home():
    return 'For usage information regarding the Dotino API, please visit https://github.com/winsonluk/Dotino/blob/master/README.md'

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
