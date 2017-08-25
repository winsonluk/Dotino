import base64
import configparser
import json
import urllib2


from flask import Flask, request, Response


import yelp


app = Flask(__name__)


# GET from https://api.dotino.com/yelp?business=RESTAURANT_ID_HERE to return Yelp restaurant info
@app.route('/yelp', methods=['GET'])
def get_business():
    business = request.args.get('business')
    bearer_token = yelp.obtain_bearer_token(yelp.API_HOST, yelp.TOKEN_PATH)
    toReturn = json.dumps(yelp.get_business(bearer_token, business))
    resp = Response(toReturn, mimetype='text/plain')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

#@app.route('/reddit', methods=['GET'])
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
@app.route('/.well-known/acme-challenge/Qyk_ybc8y4UAJpm59tzehEk0t7BbebpevBtVUwMItQs')
def verification():
    return 'Qyk_ybc8y4UAJpm59tzehEk0t7BbebpevBtVUwMItQs.hzO8b2WnaBC-iG7q-iIt4EFY9QFz6awFmEInonlRo-g'

@app.route('/')
def home():
    return 'For usage information regarding the Dotino API, please visit https://github.com/winsonluk/Dotino/blob/master/README.md'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
