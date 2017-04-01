from bottle import route, run, default_app, static_file, request, template
import configparser

import yelp


application = default_app()


@route('/yelp')
def get_business():
    business = request.query.business
    bearer_token = yelp.obtain_bearer_token(yelp.API_HOST, yelp.TOKEN_PATH)
    return yelp.get_business(bearer_token, business)


if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True)
