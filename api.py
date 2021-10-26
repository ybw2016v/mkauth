import requests as r
from flask import Flask
from flask_redis import FlaskRedis
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
app.config.update(RESTFUL_JSON=dict(ensure_ascii=False))
api = Api(app)

app.config['REDIS_URL'] = "redis://127.0.0.1:6379/0"
app.config['JSON_AS_ASCII'] = False
rc = FlaskRedis(app, decode_responses=True)


MURL="https://m.dogcraft.top/api/miauth/gen-token"

parser = reqparse.RequestParser()
parser.add_argument('i', type=str, help='token')

from datetime import datetime


def get_token(i):
    Name="MKauth {}".format(str(datetime.now()))
    upjson={"session":None,"name":Name,"permission":["read:account"],"i":i}
    resdog=r.post(MURL,json=upjson)
    res=resdog.json()
    return res

class Auth(Resource):
    def post(self):
        args = parser.parse_args()
        token=args["i"]
        rdog=rc.get("t:{}".format(token))
        if rdog is None:
            idog=get_token(token)
            if "token" in idog:
                ttdog=idog["token"]
                rc.set("t:{}".format(token),ttdog)
                return {"r":"OK","t":ttdog}
            else:
                return {"r":"ERROR"}
        else:
            return {"r":"OK","t":rdog}




api.add_resource(Auth, '/')


if __name__ == '__main__':
    app.run(debug=True)
