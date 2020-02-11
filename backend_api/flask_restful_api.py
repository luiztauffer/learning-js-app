from flask import Flask, request
from flask_restful import Resource, Api


app = Flask(__name__)
api = Api(app)


class CommunicateData(Resource):
    def get(self):
        return {'about': 'Something written'}

    def post(self):
        post_json = request.get_json()
        return {'you sent': post_json}, 201


class MultiplicateData(Resource):
    def get(self, num):
        print('result: ', num*10)
        return {'result': num*10, 'another_key': 'a message'}

    def post(self, num):
        return {'result': num*10}, 201


api.add_resource(CommunicateData, '/')
api.add_resource(MultiplicateData, '/multiplicate/<int:num>')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
