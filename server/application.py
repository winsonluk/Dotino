import base64
import configparser
import json
import urllib2


from flask import Flask, request, Response
from flask_cors import CORS


import yelp


application = Flask(__name__)
CORS(application)


# GET from https://api.dotino.com/yelp?business=RESTAURANT_ID_HERE to return Yelp restaurant info
@application.route('/yelp', methods=['GET'])
def get_business():
    business = request.args.get('business')
    toReturn = json.dumps(yelp.get_business(business))
    return Response(toReturn, mimetype='text/plain')

#@application.route('/reddit', methods=['GET'])
#def get_reddit():
#    config = configparser.ConfigParser()
#    config.read('config.ini')
#    client_id = config.get('reddit', 'ID')
#    client_secret = config.get('reddit', 'SECRET')
#    query = request.args.get('qstring')
#    oauthRequest = urllib2.Request("https://www.reddit.com/api/v1/access_token")
#    base64string = base64.b64encode('%s:%s' % (client_id, client_secret))
#    oauthRequest.add_header("Authorization", "Basic %s" % base64string)
#    oauthRequest.add_header("grant_type", "client_credentials")
#    dataRequest = urllib2.Request("https://oauth.reddit.com/" + query,
#    headers={"Authorization" : "bearer " + urllib2.urlopen(oauthRequest).read()})
#    resp = Response(urllib2.urlopen(dataRequest).read(), mimetype='text/plain')
#    resp.headers['Access-Control-Allow-Origin'] = '*'
#    return resp
#
@application.route('/.well-known/acme-challenge/Qyk_ybc8y4UAJpm59tzehEk0t7BbebpevBtVUwMItQs')
def verification():
    return 'Qyk_ybc8y4UAJpm59tzehEk0t7BbebpevBtVUwMItQs.hzO8b2WnaBC-iG7q-iIt4EFY9QFz6awFmEInonlRo-g'

@application.route('/')
def home():
    return 'For usage information regarding the Dotino API, please visit https://github.com/winsonluk/Dotino/blob/master/README.md'

if __name__ == '__main__':
    application.run(host='0.0.0.0', port=8080)
