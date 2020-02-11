from flask import Flask, jsonify, request


app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        post_json = request.get_json()
        return jsonify({'you sent': post_json}), 201
    else:
        return jsonify({'about': 'Something written'})


@app.route('/multi/<int:num>', methods=['GET'])
def get_multiply10(num):
    return jsonify({'result': num*10})


if __name__ == '__main__':
    app.run(debug=True)
