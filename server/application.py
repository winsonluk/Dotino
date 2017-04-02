from bottle import route, run, default_app, static_file, request, template, hook, response
import configparser

import yelp


application = default_app()


# Allow CORS from https://dotino.com to this server (https://api.dotino.com)
@hook('after_request')
def enable_cors():
    response.headers['Access-Control-Allow-Origin'] = 'https://dotino.com'
    response.headers['Access-Control-Allow-Methods'] = 'GET'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'


# GET from https://api.dotino.com/yelp?business=RESTAURANT_ID_HERE to return Yelp restaurant info 
@route('/yelp', method=['GET'])
def get_business():
    business = request.query.business
    bearer_token = yelp.obtain_bearer_token(yelp.API_HOST, yelp.TOKEN_PATH)
    return yelp.get_business(bearer_token, business)


if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True)
