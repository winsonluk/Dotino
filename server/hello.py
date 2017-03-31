from bottle import route, run, default_app
from yelp import get_business
application = default_app()
@route('/hello')
def hello():
    return "Hello World!"

if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True)
